# Architecture Overview

This document describes the high-level architecture of the **ZIVAH International Website**.

---

## 🏛️ System Architecture

The application is structured as a full-stack Next.js monolith using the App Router. There are no separate backend microservices; backend capabilities are provided by Next.js Route Handlers (`src/app/api/`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client Browser                                  │
│       (Public Pages: /[locale]/* | Admin Dashboard: /admin/*)          │
└──────────────────┬──────────────────────────────▲──────────────────────┘
                   │ HTTPS                        │ React Server Components
                   │ Fetch / Form Actions         │ & Client Hydration
                   ▼                              │
┌─────────────────────────────────────────────────┴──────────────────────┐
│                    Next.js App Router (Node.js)                        │
│                                                                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │   Pages & Layouts             │   │   API Route Handlers          │ │
│  │   - src/app/[locale]/*        │   │   - /api/auth/*               │ │
│  │   - src/app/admin/*           │   │   - /api/admin/*              │ │
│  │   - src/app/(auth)/*          │   │   - /api/quotes/*             │ │
│  │                               │   │   - /api/products/*           │ │
│  └──────────────┬────────────────┘   └───────────────┬───────────────┘ │
│                 │                                    │                 │
│                 ▼                                    ▼                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                       Application Services & Lib                  │ │
│  │   - src/lib/auth.ts (Session verification via DB)                 │ │
│  │   - src/lib/db.ts (PostgreSQL connection pool via `pg`)           │ │
│  │   - src/lib/email.ts (Nodemailer notification service)            │ │
│  │   - src/lib/rate-limit.ts (Upstash Redis rate limiter)            │ │
│  └─────────────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     │ Parameterized SQL Queries (pg)
                                     ▼
                       ┌───────────────────────────┐
                       │   PostgreSQL 13+ Database │
                       │   (Sessions, Products,    │
                       │    Quotes, Users, etc.)   │
                       └───────────────────────────┘
```

---

## 📂 Source Code Structure

The repository follows Next.js App Router conventions:

```
src/
├── app/
│   ├── (auth)/                  # Public auth views (sign-in, sign-up)
│   ├── [locale]/                # Localized public routes
│   │   ├── contact/             # Contact page & submission
│   │   ├── markets/             # Global market presence
│   │   ├── products/            # Dynamic catalog & product detail
│   │   │   └── [slug]/
│   │   │       └── ficha-tecnica/ # Downloadable/printable technical sheet
│   │   ├── quality/             # Quality assurance, certifications
│   │   ├── quote/               # Multi-step export quote calculator
│   │   └── legal/               # Privacy, terms, cookies, GDPR
│   ├── admin/                   # Protected admin backoffice
│   │   ├── categories/          # Category CRUD & translations
│   │   ├── products/            # Product catalog management
│   │   └── settings/            # Internationalization & site config
│   └── api/                     # Internal REST API endpoints
│       ├── auth/                # Sign-in, sign-up, sign-out, session
│       ├── admin/               # Administrative operations
│       ├── categories/          # Category queries
│       ├── contact/             # Contact form dispatch
│       ├── health/              # Server & DB health probe
│       ├── products/            # Public product search & catalog
│       └── quotes/              # Quote submission & country/unit lookups
├── components/                  # React UI components
│   ├── sections/                # Reusable landing page sections
│   └── ui/                      # Radix UI + shadcn primitives
├── i18n/                        # Routing and message loader config
├── lib/                         # Server and client utility libraries
│   ├── auth.ts                  # DB session verification
│   ├── db.ts                    # PostgreSQL connection pool (`pg`)
│   ├── email.ts                 # Nodemailer transport
│   ├── password.ts              # bcryptjs password hashing
│   └── rate-limit.ts            # Rate limiting configuration
├── messages/                    # Translation dictionaries (es.json, en.json)
└── types/                       # Shared TypeScript definitions
```

---

## 🌐 Internationalization (i18n)

The site uses `next-intl` with path-based locale prefixes:

- Default Locale: `es` (Spanish)
- Secondary Locale: `en` (English)
- Structure: `/[locale]/products`, `/[locale]/quote`, etc.
- Dictionaries are stored in `src/messages/es.json` and `src/messages/en.json`.
- Dynamic product and category translations are stored in the PostgreSQL database with multi-locale columns or translation tables.

---

## 🔄 Two-Tier Database Architecture

A fundamental architectural principle of this codebase is the clear separation of concerns between runtime queries and schema management:

1. **Production Runtime (`src/lib/db.ts`):** Direct SQL queries executed through the `pg` (`Pool`) client. This maximizes performance, minimizes dependency overhead in production standalone bundles, and avoids Prisma runtime client overhead.
2. **Development & Migrations (`prisma/`):** Prisma is used strictly as a Developer Tool to manage `schema.prisma`, execute schema push (`pnpm db:push`), run migrations (`pnpm db:migrate`), and seed data (`pnpm db:seed`).

> [!CAUTION]
> Application code **must never** import `@prisma/client`. All application queries must use the `pg` connection pool with parameterized queries.
