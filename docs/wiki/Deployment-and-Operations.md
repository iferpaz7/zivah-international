# Deployment & Operations Guide

This guide describes the build, release, and operational procedures for deploying the **ZIVAH International Website** into production, specifically targeting standalone Node.js hosting environments such as **cPanel Node.js Selector**.

---

## 🚀 Deployment Model

The site builds using Next.js standalone output:

- **Build Output:** `.next/standalone/` contains a lightweight Node.js server with only production dependencies bundled.
- **Entry Points:** `server.cjs` or `node .next/standalone/server.js`.
- **Target OS:** Linux (cPanel with CloudLinux / Passenger Node.js Selector, or standard Node 20+ runtime).

---

## 🏗️ Production Build

Run the production build:

```bash
pnpm build
```

This generates:

1. `.next/standalone/` (Minimal self-contained server)
2. `.next/static/` (Client-side static chunks)
3. `public/` (Public images, icons, and assets)

---

## 📦 cPanel Node.js Deployment Steps

### 1. File Upload

Copy the following files and directories to your cPanel application root (e.g. `/home/user/public_html` or dedicated app directory):

- The contents of `.next/standalone/` (including `server.js` and bundled `node_modules`)
- `.next/static/` placed into `.next/static/` inside the application directory
- `public/` folder placed at the root
- `server.cjs` (custom entry point for cPanel Passenger integration)
- `package.json`

### 2. Configure Environment Variables in cPanel

In the cPanel **Setup Node.js App** interface, set the following environment variables:

| Variable                        | Description                         | Example                                                  |
| :------------------------------ | :---------------------------------- | :------------------------------------------------------- |
| `NODE_ENV`                      | Production flag                     | `production`                                             |
| `PORT`                          | Listening port (assigned by cPanel) | `3000`                                                   |
| `DATABASE_URL`                  | PostgreSQL connection string        | `postgresql://dbuser:pwd@127.0.0.1:5432/zivah_db`        |
| `EMAIL_HOST`                    | SMTP server host                    | `smtp.gmail.com` or `mail.zivahinternational.com`        |
| `EMAIL_PORT`                    | SMTP port                           | `465` or `587`                                           |
| `EMAIL_USER`                    | SMTP username                       | `noreply@zivahinternational.com`                         |
| `EMAIL_PASS`                    | SMTP application password           | `********`                                               |
| `EMAIL_FROM`                    | Outgoing sender email               | `"ZIVAH International" <noreply@zivahinternational.com>` |
| `BUSINESS_EMAIL`                | Inbound notification recipient      | `export@zivahinternational.com`                          |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (optional)    | `G-XXXXXXXXXX`                                           |

### 3. Application Startup

- **Application Startup File:** Set to `server.cjs` (or `node_modules/next/dist/bin/next` depending on cPanel configuration).
- Click **Restart Application** in the cPanel dashboard.

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

Use this endpoint for uptime monitoring (e.g. UptimeRobot, Pingdom, or cPanel crons).

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

> [!NOTE]
> Database commands are run during maintenance or deployment windows from the command line/SSH. The running application does not invoke Prisma at runtime.
