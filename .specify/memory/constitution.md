# ZIVAH International Website Constitution

## Core Principles

### I. Full-Stack Next.js on cPanel (Standalone)

- Stack: Next.js 16.2.9 App Router, React 19, TypeScript 5 (strict), Tailwind CSS 4.3.1, Radix UI primitives.
- Delivery Model: Standalone Node.js deployment on cPanel hosting. The app is built with `pnpm build` outputting to `.next/standalone/` and run via `node server.cjs` (or `npm start`).
- Authentication Architecture:
  - Custom session-based auth (NO Cognito, NO external providers).
  - Passwords hashed with `bcryptjs` (12 salt rounds).
  - Session tokens (UUIDs) stored in the `sessions` table and managed via `HttpOnly`, `Secure`, `SameSite=lax` cookies.
  - Auth checks for protected routes use `getAuthUser()` which queries the database directly.

### II. Database Layer (PostgreSQL)

- Two-Tier Approach:
  1. **Runtime**: Direct PostgreSQL queries using the `pg` connection pool (`src/lib/db.ts`). This is what the application uses in production. Parameterized queries are mandatory to prevent SQL injection.
  2. **Development**: Prisma ORM (`@prisma/client`) is used **strictly** for schema definition, migrations, and database seeding (`prisma/schema.prisma`). It must **never** be imported or used in application code.

### III. API Routes & Contracts

- The application contains its own API routes under `src/app/api/`. There is no separate backend service.
- Endpoints:
  - `/api/auth/` (sign-in, sign-up, sign-out, session)
  - `/api/admin/` (CRUD operations for admin dashboard)
  - `/api/products/`, `/api/categories/` (Public catalog)
  - `/api/quotes/`, `/api/contact/` (Forms and submissions)
- Input Validation: All API inputs must be strictly validated using Zod schemas.
- Rate Limiting: Upstash Redis-based rate limiting is applied to sensitive endpoints.

### IV. Secrets & Runtime Environment

- Local development secrets belong in `.env.local` (never committed to Git).
- Production environment variables must be configured in the cPanel Node.js Selector (e.g. `DATABASE_URL`, `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`).
- Never commit `.next/`, `out/`, `node_modules/`, `.env*` files, credentials, or session secrets.

### V. Branching & Commit Conventions

- Follow **Conventional Commits**: `<type>(<scope>): <description>`.
  - Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.
- Branching workflow:
  - `main`: Stable production.
  - `feature/*`, `fix/*`, `hotfix/*`.
  - Pull requests require code review before merging.

## Quality Gates & Verification Standards

### Tooling & Commands

- Node.js 18.18.0+ and `pnpm`.

```bash
# Code formatting check
pnpm format:check

# TypeScript typecheck
pnpm type-check

# ESLint check
pnpm lint

# Production build
pnpm build
```

### Pre-commit & CI Checks

- Husky is configured to run linting and formatting before commit (via `lint-staged`).

## Governance & Amendments

1. **Supremacy**: This Constitution defines the non-negotiable architectural and security guardrails for the Zivah website.
2. **Database Access Constraint**: The use of Prisma in application code is strictly forbidden. All application queries must use the `pg` connection pool.
3. **Spec-Kit Compliance**: All specs and plans under `specs/` must pass the Constitution Check before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-09-06 | **Source**: `README.md` & `AGENTS.md`
