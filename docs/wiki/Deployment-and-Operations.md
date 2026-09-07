# Deployment & Operations Guide

This guide describes the build, release, and operational procedures for deploying the **ZIVAH International Website** into production, specifically targeting standalone Node.js hosting environments such as **cPanel Node.js Selector** (e.g. InterServer cPanel Boost 2 Cores).

---

## 🚀 Deployment Model

The site builds using Next.js standalone output:

- **Build Output:** `.next/standalone/` contains a lightweight Node.js server with only production dependencies bundled.
- **Entry Points:** `server.cjs` or `node .next/standalone/server.js`.
- **Target OS:** Linux (cPanel with CloudLinux / Passenger Node.js Selector, Node 20+ runtime).

---

## 🐙 Deployment Method 1: cPanel Git™ Version Control (Native)

This repository includes native support for **[cPanel Git™ Version Control](https://docs.cpanel.net/cpanel/files/git-version-control/)** via `.cpanel.yml` and `scripts/cpanel-deploy.sh`.

### How it Works:

1. cPanel manages a clone of this repository in `/home/<user>/repositories/website`.
2. When you trigger **Deploy HEAD Commit** (or configure a GitHub Webhook), cPanel executes `.cpanel.yml`.
3. `.cpanel.yml` runs `scripts/cpanel-deploy.sh`, which:
   - Detects the Node.js / NPM environment.
   - Installs dependencies (`pnpm` or `npm`).
   - Compiles the Next.js standalone application (`next build --webpack`).
   - Synchronizes standalone files (`.next/standalone`, `.next/static`, `public`, `server.cjs`) to the target app directory (`$HOME/zivah-app` or custom path).
   - Signals Phusion Passenger to reload gracefully (`touch tmp/restart.txt`).

### Setup in InterServer cPanel:

1. **Configure Node.js App**:
   - In cPanel, go to **Software** > **Setup Node.js App**.
   - Create an application:
     - **Node.js version**: 22.x or 20.x.
     - **Application root**: `zivah-app` (relative to your home directory).
     - **Application URL**: `zivahinternational.com`.
     - **Application startup file**: `server.cjs`.
   - Save and note the application root path.

2. **Clone in Git™ Version Control**:
   - In cPanel, go to **Files** > **Git™ Version Control**.
   - Click **Create**:
     - Clone URL: `https://github.com/zivah-international/website.git` (or SSH clone URL with deploy key).
     - Repository Path: `repositories/website` (or `repositories/zivah-website`).
     - Repository Name: `zivah-website`.
   - Click **Create**.

3. **Deploy**:
   - In **Git™ Version Control**, click **Manage** on `zivah-website`.
   - Go to the **Pull or Deploy** tab.
   - Click **Update from Remote** (pulls latest code from GitHub).
   - Click **Deploy HEAD Commit** (runs `scripts/cpanel-deploy.sh`).
   - Check the deployment log to verify completion.

> [!TIP]
> To customize the target application directory, create a `.cpanel-target` file in your home directory containing the path (e.g. `/home/username/zivah-app`) or set `CPANEL_DEPLOY_PATH`.

---

## ⚡ Deployment Method 2: GitHub Actions CI/CD (FTP + UAPI)

The repository also includes `.github/workflows/deploy.yml`:

- Compiles the project inside GitHub Actions runners (7 GB RAM).
- Prepares production assets in `deploy/`.
- Uploads to cPanel via secure FTP (`SamKirkland/FTP-Deploy-Action`).
- Restarts the application by calling cPanel UAPI (`NodeJS/restart_app`).

---

## 📦 Required Environment Variables in cPanel

In the cPanel **Setup Node.js App** interface, configure the following environment variables:

| Variable                        | Description                                   | Example                                                  |
| :------------------------------ | :-------------------------------------------- | :------------------------------------------------------- |
| `NODE_ENV`                      | Production flag                               | `production`                                             |
| `PORT`                          | Listening port (assigned by cPanel Passenger) | `3000`                                                   |
| `DATABASE_URL`                  | PostgreSQL connection string                  | `postgresql://dbuser:pwd@127.0.0.1:5432/zivah_db`        |
| `EMAIL_HOST`                    | SMTP server host                              | `smtp.gmail.com` or `mail.zivahinternational.com`        |
| `EMAIL_PORT`                    | SMTP port                                     | `465` or `587`                                           |
| `EMAIL_USER`                    | SMTP username                                 | `noreply@zivahinternational.com`                         |
| `EMAIL_PASS`                    | SMTP application password                     | `********`                                               |
| `EMAIL_FROM`                    | Outgoing sender email                         | `"ZIVAH International" <noreply@zivahinternational.com>` |
| `BUSINESS_EMAIL`                | Inbound notification recipient                | `export@zivahinternational.com`                          |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (optional)              | `G-XXXXXXXXXX`                                           |

---

## 🩺 Health Check & Monitoring

The application includes an automated health probe at:

```
GET /api/health
```

Expected response (`200 OK`):

```json
{
  "status": "healthy",
  "timestamp": "2026-09-06T22:30:00.000Z",
  "database": "connected"
}
```

---

## 🔄 Production Database Migrations

For initial deployment or subsequent schema updates:

```bash
# 1. Ensure DATABASE_URL points to the production database
# 2. Push schema definitions
pnpm db:push

# 3. Seed initial baseline data (countries, units, categories, admin user)
pnpm db:seed
```
