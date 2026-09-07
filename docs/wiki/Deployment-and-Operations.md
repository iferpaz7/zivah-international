# Deployment & Operations Guide

This guide describes the build, release, and operational procedures for deploying the **ZIVAH International Website** into production, specifically targeting standalone Node.js hosting environments such as **cPanel Node.js Selector** (e.g. InterServer cPanel Boost 2 Cores).

---

## 🚀 Deployment Architecture

The application is deployed as a standalone Node.js server managed by **Phusion Passenger** inside cPanel:

- **Build Output:** `.next/standalone/` contains a lightweight Node.js server with only production dependencies bundled.
- **Entry Points:** `server.cjs` (custom cPanel wrapper with database health monitoring).
- **Target OS:** Linux (cPanel with CloudLinux / Passenger Node.js Selector, Node 20+ / 22+).

---

## 🐙 Primary Deployment: cPanel Git™ Version Control (Native)

This repository uses native **[cPanel Git™ Version Control](https://docs.cpanel.net/cpanel/files/git-version-control/)** via `.cpanel.yml` and `scripts/cpanel-deploy.sh`.

```
┌─────────────────┐       git push        ┌──────────────────────┐
│ Developer / CI  │ ────────────────────> │ GitHub Repository    │
└─────────────────┘                       └──────────┬───────────┘
                                                     │
                                                     │ 1. Git Pull (--ff-only)
                                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        InterServer cPanel Hosting                      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Git™ Version Control (/home/user/repositories/website)           │  │
│  │   - Pulls latest commit from GitHub                              │  │
│  │   - Executes .cpanel.yml -> scripts/cpanel-deploy.sh             │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     │ 2. Install & Build               │
│                                     │    pnpm install && pnpm build    │
│                                     │                                  │
│                                     │ 3. Sync Standalone Artifacts     │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Node.js Application (/home/zivahint/public_html/app)             │  │
│  │   - server.cjs / server.js (Entry point)                         │  │
│  │   - .next/standalone + .next/static + public                     │  │
│  │   - tmp/restart.txt (Touched to trigger Passenger reload)        │  │
│  └──────────────────────────────────▲───────────────────────────────┘  │
│                                     │                                  │
│                                     │ 4. HTTP Proxy / Port Routing     │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Web Server (Apache / LiteSpeed with Phusion Passenger)           │  │
│  │   - Serves domain: https://zivahinternational.com                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Complete Step-by-Step Setup in InterServer cPanel:

#### Step 1: Configure Node.js Application

1. Log into your cPanel dashboard.
2. In the **Software** section, click **Setup Node.js App**.
3. Create or inspect the application:
   - **Node.js version**: `22.x` (or `20.x`).
   - **Application mode**: `Production`.
   - **Application root**: `public_html/app` (or `/home/zivahint/public_html/app`).
   - **Application URL**: `zivahinternational.com` (or your domain).
   - **Application startup file**: `server.cjs` (or `server.js`).
4. Click **Create** (or **Save**).
5. Note the command for entering the virtual environment (e.g. `source /home/zivahint/nodevenv/public_html/app/22/bin/activate`).

#### Step 2: Configure Environment Variables

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

#### Step 3: Configure SSH Access (For Private GitHub Repositories)

If your GitHub repository is private:

1. In cPanel, go to **Security** > **SSH Access**.
2. Click **Manage SSH Keys** > **Generate a New Key**.
3. Name it `id_rsa_github`, generate it, and authorize it.
4. View the public key, copy its content.
5. In GitHub, go to your repository > **Settings** > **Deploy keys** > **Add deploy key**:
   - Paste the public key, title it `cPanel InterServer`, and click **Add key**.

#### Step 4: Clone Repository in cPanel Git™ Version Control

1. In cPanel, go to **Files** > **Git™ Version Control**.
2. Click **Create**:
   - **Clone a Repository**: Toggle to **ON**.
   - **Clone URL**: `git@github.com:zivah-international/website.git` (SSH) or `https://github.com/zivah-international/website.git` (HTTPS).
   - **Repository Path**: `repositories/website` (recommended to keep source code clean and outside webroot).
   - **Repository Name**: `zivah-website`.
3. Click **Create**. cPanel will clone the repository.

#### Step 5: Deploy the Application

1. In **Git™ Version Control**, find `zivah-website` and click **Manage**.
2. Go to the **Pull or Deploy** tab.
3. Click **Update from Remote**:
   - Fetches the latest commits from GitHub via `git pull --ff-only`.
4. Click **Deploy HEAD Commit**:
   - cPanel reads `.cpanel.yml` and executes `scripts/cpanel-deploy.sh`.
   - The script installs dependencies, builds the Next.js standalone bundle, copies files to `zivah-app`, and updates `tmp/restart.txt`.
5. Check the **Last Deployment Information** box on the same page to verify success.

#### Step 6 (Optional): Automatic Deployment via GitHub Webhook

To deploy automatically upon pushing to `main`:

1. In cPanel Git Version Control, check the repository settings for the Webhook URL.
2. In GitHub, go to **Settings** > **Webhooks** > **Add webhook**.
3. Paste the Payload URL provided by cPanel, select `application/json`, and trigger on `Just the push event`.

---

## 🗄️ Production Database Migrations

During initial setup or after database schema changes:

1. Open cPanel **Advanced** > **Terminal** (or connect via SSH).
2. Enter the repository directory:
   ```bash
   cd ~/repositories/website
   source ~/nodevenv/zivah-app/22/bin/activate
   ```
3. Run migrations and seed data:
   ```bash
   # Push schema changes to production database
   pnpm db:push

   # Seed baseline data (currencies, countries, measures, categories, admin account)
   pnpm db:seed
   ```

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
  "timestamp": "2026-09-06T22:30:00.000Z",
  "database": "connected"
}
```

---

## ⚠️ Legacy Deployment Method (Deactivated)

The file [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml) formerly handled deployment via FTP and cPanel UAPI. It has been **deactivated** (`if: false` and triggers removed) to avoid conflicting deployments with the native cPanel Git Version Control workflow.
