# Welcome to the ZIVAH International Website Wiki

Welcome to the official documentation for the **ZIVAH International S.A.** corporate website and export portal. ZIVAH International is a premier exporter of Ecuadorian seafood, tropical fruits, and specialty coffee, with headquarters in Samborondón, Guayas, Ecuador and distribution facilities in Miami, Florida.

---

## 📌 Project Overview

This repository hosts the full-stack Next.js application powering Zivah International's customer-facing showcase, dynamic product catalog, international quotation system, and administrative backoffice.

- **Type:** Full-Stack Monolithic Web Application
- **Runtime Framework:** Next.js 16 (App Router) with React 19 & TypeScript 5+
- **Styling & UI:** Tailwind CSS 4, Radix UI Primitives, Lucide Icons, Sonner
- **Database Architecture:** PostgreSQL 13+ with direct `pg` connection pooling at runtime & Prisma for dev-time migrations/schema
- **Authentication:** Custom session-based authentication (bcryptjs + UUID tokens stored in DB and managed via HttpOnly cookies)
- **Internationalization:** Multi-language routing with `next-intl` (Spanish default, English supported)
- **Target Deployment:** Standalone Node.js hosting on cPanel

---

## 🧭 Documentation Index

| Section                                                      | Description                                                                                                 |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **[Architecture Overview](Architecture)**                    | High-level system design, Next.js App Router structure, i18n routing, and BFF patterns.                     |
| **[Database Architecture](Database-Architecture)**           | Two-tier architecture: runtime `pg` connection pool vs dev-only Prisma ORM, migrations, and schema guide.   |
| **[Authentication & Security](Authentication-and-Security)** | Session lifecycle, cookie security, password hashing, RBAC roles, rate limiting, and security headers.      |
| **[UI & Design System](UI-Design-System)**                   | Radix UI primitives, shadcn-compatible component design, Tailwind CSS 4 theme tokens, and guidelines.       |
| **[API Reference](API-Reference)**                           | Comprehensive reference for `/api/*` endpoints (auth, admin, products, categories, quotes, contact).        |
| **[Development Workflow](Development-Workflow)**             | Local setup, environment configuration, code quality standards, and Conventional Commits.                   |
| **[Deployment & Operations](Deployment-and-Operations)**     | Building standalone output, cPanel deployment instructions, process management, and production maintenance. |

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/zivah-international/website.git
cd website

# 2. Install dependencies with pnpm
pnpm install

# 3. Configure local environment variables
cp .env.example .env.local
# Edit .env.local with your local PostgreSQL DATABASE_URL and email credentials

# 4. Initialize Database (Dev Only)
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Core Architectural Guardrails

1. **Monolithic Architecture**: Browser code interacts solely with internal Next.js API routes (`/api/*`).
2. **Strict Database Layering**: Production code **must never** import `@prisma/client`. All runtime queries must execute through the parameterized `pg` pool (`src/lib/db.ts`).
3. **Session-Based Auth**: No external third-party OIDC/identity providers. Auth tokens are random UUIDs stored in the `sessions` table and validated on each authenticated request.
4. **Input Validation**: All API routes strictly validate request payloads with Zod schemas.
