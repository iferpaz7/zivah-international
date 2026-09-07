# Zivah Website — Agent Guide

## Purpose and architecture

- This is the full-stack Zivah corporate website: Next.js 16 App Router, React 19, TypeScript,
  Tailwind CSS 4, and Radix UI primitives.
- It uses a custom session-based authentication system backed by PostgreSQL. Tokens are UUIDs
  stored in the `sessions` table and delivered via encrypted `HttpOnly` cookies. Route Handlers
  live under `src/app/api/auth/`. There is no external OIDC provider (like Cognito).
- Admin dashboard routes live in `src/app/admin`, while public pages (Home, Products, Quality, Contact, Quote)
  are in `src/app`.
- The database architecture is two-tier:
  1. **Runtime:** Direct PostgreSQL queries using the `pg` connection pool (`src/lib/db.ts`).
  2. **Development/Migrations:** Prisma is used for schema management and seeding only. **Never import `@prisma/client` in application code.**

## Contracts and implementation rules

- The application is monolithic. Browser code calls the internal Next.js API routes at `/api/*`.
- Use Zod schemas for strict input validation on all API endpoints.
- Passwords must be hashed using `bcryptjs` (12 salt rounds).
- Prevent SQL injection by strictly using parameterized queries in all `pg` database calls. Never use string concatenation for SQL queries.
- Keep user-facing copy in Spanish, with support for English via internationalization (`next-intl`).
- Reuse existing Radix UI components and design tokens; do not introduce competing UI libraries.
- The system handles quotes and product inquiries. Pay close attention to measurement units and variations in the `quotes` and `products` tables.

## Validation and delivery

- Use `pnpm`. Before handoff run, as applicable:

  ```bash
  pnpm format:check
  pnpm type-check
  pnpm lint
  pnpm build
  git diff --check
  ```

- Deployment is targeting a cPanel Node.js hosting environment using standalone output. Do not assume Vercel or Amplify-specific build behaviors.
- Do not commit `.next/`, `node_modules/`, `.env*`, credentials, tokens, certificates, or unrelated working-tree changes.
