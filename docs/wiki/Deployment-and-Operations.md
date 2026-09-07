# Deployment & Operations Guide

This guide describes the build, release, and operational procedures for deploying the **ZIVAH International Website** into production, specifically targeting standalone Node.js hosting environments such as **cPanel Node.js Selector** (e.g. InterServer cPanel Boost 2 Cores).

---

## 🚀 Deployment Architecture

The application is deployed as an optimized standalone Next.js server managed by **Phusion Passenger** inside cPanel:

- **Build Pipeline:** GitHub Actions CI/CD runs on dedicated 4-core runners to compile Next.js standalone output in ~45 seconds.
- **Delivery:** Only the production standalone bundle, static assets, and public directory are uploaded via FTP to `/home/zivahint/public_html/app` (~15 seconds).
- **Restart Mechanism:** Phusion Passenger's file-based restart trigger (`tmp/restart.txt`).
- **Server Resources:** Near-zero CPU utilization on the shared hosting server during deployment. Standalone runtime consumes only ~50MB–80MB RAM.
- **SSH/Terminal:** **Not required.** Desktops or CI push directly to GitHub; Phusion Passenger reloads automatically without terminal commands.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      1. GitHub Actions Runner (CI)                      │
│                                                                         │
│  - Checkout code & Setup Node 22 + pnpm                                 │
│  - Compile Next.js: pnpm install && pnpm build                          │
│  - Package .next/standalone + .next/static + public                     │
│  - Generate deploy/tmp/restart.txt (with timestamp + git SHA)           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ 2. FTP Upload (SamKirkland/FTP-Deploy-Action)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       2. InterServer cPanel Server                      │
│                                                                         │
│  Target: /home/zivahint/public_html/app                                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Application Root:                                                 │  │
│  │   - server.js / server.cjs (Entry points)                         │  │
│  │   - .next/standalone/ (Internal optimized server bundle)         │  │
│  │   - .next/static/ & public/ (Static assets)                       │  │
│  │   - tmp/restart.txt (Uploaded with new timestamp)                 │  │
│  └───────────────────────────────────┬───────────────────────────────┘  │
│                                      │                                  │
│                                      │ 3. Incoming HTTP Request         │
│                                      ▼                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Phusion Passenger Web Server                                      │  │
│  │   - Detects updated timestamp on tmp/restart.txt                  │  │
│  │   - Gracefully stops old Node.js worker process                   │  │
│  │   - Spawns new Node.js worker process running new code            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ cPanel Configuration (One-Time Setup)

### Step 1: Configure Node.js Application

1. Log into your cPanel dashboard.
2. In the **Software** section, click **Setup Node.js App**.
3. Create or inspect the application:
   - **Node.js version**: `22.x` (or `20.x`).
   - **Application mode**: `Production`.
   - **Application root**: `public_html/app` (or `/home/zivahint/public_html/app`).
   - **Application URL**: `zivahinternational.com` (or your domain).
   - **Application startup file**: `server.js` (or `server.cjs`).
4. Click **Create** (or **Save**).

### Step 2: Configure Environment Variables

In the same **Setup Node.js App** page, scroll to **Environment variables** and add:

| Variable                        | Description                    | Example                                                  |
| :------------------------------ | :----------------------------- | :------------------------------------------------------- |
| `NODE_ENV`                      | Environment flag               | `production`                                             |
| `DATABASE_URL`                  | PostgreSQL connection pool URL | `postgresql://user:password@host:5432/zivahint_web`      |
| `EMAIL_HOST`                    | SMTP server host               | `smtp.gmail.com`                                         |
| `EMAIL_PORT`                    | SMTP server port               | `587`                                                    |
| `EMAIL_USER`                    | SMTP username                  | `noreply@zivahinternational.com`                         |
| `EMAIL_PASS`                    | SMTP application password      | `********`                                               |
| `EMAIL_FROM`                    | Outgoing sender display        | `"ZIVAH International" <noreply@zivahinternational.com>` |
| `BUSINESS_EMAIL`                | Contact & quote recipient      | `export@zivahinternational.com`                          |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4             | `G-XXXXXXXXXX`                                           |

Click **Save**.

---

## 🔄 Automated CI/CD Workflow (`deploy.yml`)

The repository uses [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

### Workflow Triggers

- Automatic on `git push origin main`.
- Manual on-demand execution via GitHub Actions UI (**Run workflow**).

### Required GitHub Secrets & Variables

Configured under **Settings** > **Secrets and variables** > **Actions**:

- **Secrets**:
  - `FTP_HOST`: cPanel FTP server host (e.g. `ftp.zivahinternational.com`).
  - `FTP_USER`: FTP deployment username.
  - `FTP_PASSWORD`: FTP deployment password.
  - `FTP_PATH`: Target directory path on FTP (e.g. `public_html/app`).
- **Variables**:
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics measurement ID.

---

## 🔄 How Phusion Passenger Reloads the Application

Phusion Passenger monitors the timestamp of:
`/home/zivahint/public_html/app/tmp/restart.txt`

When GitHub Actions packages the build, it executes:

```bash
mkdir -p deploy/tmp
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") - ${{ github.sha }}" > deploy/tmp/restart.txt
```

When FTP uploads `deploy/tmp/restart.txt`, the server updates the file's modification time (`mtime`). On the very next incoming web request, Phusion Passenger compares `mtime` against the worker process launch time, terminates the old worker gracefully, and boots the new application without dropped connections.

---

## 🩺 Monitoring & Health Checks

Verify your live deployment by pinging the health endpoint:

```
GET https://zivahinternational.com/api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2026-09-07T04:00:00.000Z",
  "database": "connected"
}
```
