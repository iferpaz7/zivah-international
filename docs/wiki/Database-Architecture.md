# Database Architecture & Management

This document details the database design, two-tier architecture, data models, and migration workflows for the **ZIVAH International Website**.

---

## 🏗️ The Two-Tier Database Pattern

To achieve optimal performance on constrained Node.js standalone environments (such as cPanel hosting) while maintaining a strict, declarative schema definition, the project implements a two-tier database pattern:

| Stage                    | Technology                | Purpose                                                                           | Permitted in `src/`?             |
| :----------------------- | :------------------------ | :-------------------------------------------------------------------------------- | :------------------------------- |
| **Runtime (Production)** | `pg` (node-postgres pool) | Handles all live application queries, connection lifecycle, and transactions.     | ✅ **Yes** (via `src/lib/db.ts`) |
| **Development**          | Prisma ORM                | Defines tables, relationships, generates schema, seeds data, and runs migrations. | ❌ **Strictly Forbidden**        |

### Why This Separation?

1. **Lightweight Standalone Output**: Next.js standalone builds do not need to bundle heavy native Prisma engines or binary targets into production.
2. **Deterministic SQL Control**: Complex queries, joins for quotes, and localized translations are written in explicit, tunable SQL.
3. **Safety Guarantee**: Prisma ensures database consistency during local development and schema updates, while `pg` provides lean runtime execution.

---

## 🔒 Runtime Queries (`src/lib/db.ts`)

All database interactions in API routes and server components are made through the helper in `src/lib/db.ts`:

```typescript
import { query } from '@/lib/db';

// Example: Safe parameterized query
const result = await query(
  'SELECT id, name_es, name_en, slug FROM products WHERE is_active = $1 ORDER BY created_at DESC',
  [true]
);
```

### Critical SQL Rules

- **Strict Parameterization**: Always use `$1, $2, ...` placeholders. **Never** concatenate user input into SQL strings (`'SELECT ... WHERE id = ' + id`).
- **Connection Release**: Queries executed through `query(...)` automatically check out and return connections to the pool.
- **Transactions**: For multi-step operations (such as creating a quote with multiple line items), check out a client explicitly from the pool, execute `BEGIN`, `COMMIT` / `ROLLBACK`, and `client.release()` in a `finally` block.

---

## 🗄️ Core Database Models

The schema is defined in `prisma/schema.prisma`. Major entity relationships:

```
┌──────────────┐         ┌──────────────┐
│    users     │1───────*│   sessions   │
└──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌───────────────────┐
│  categories  │1───────*│   products   │1───────*│ product_variants  │
└──────────────┘         └──────┬───────┘         └───────────────────┘
                                │1
                                │
                                │*
                         ┌──────┴───────┐         ┌───────────────────┐
                         │product_prices│*───────1│     measures      │
                         └──────────────┘         └───────────────────┘

┌──────────────┐         ┌──────────────┐         ┌───────────────────┐
│  countries   │1───────*│    quotes    │1───────*│    quote_items    │
└──────────────┘         └──────┬───────┘         └───────────────────┘
                                │1
                                │*
                         ┌──────┴───────────────┐
                         │ quote_communications │
                         └──────────────────────┘
```

### Table Summary

- **`users`**: System users, password hashes (bcrypt), and roles (`admin`, `sales_manager`, `sales_rep`, `viewer`).
- **`sessions`**: Active authentication sessions with UUID tokens, IP addresses, and expiration timestamps.
- **`categories`**: Product taxonomy hierarchy supporting localized names and slugs.
- **`products`**: Product specifications, origin, nutritional info, certifications, and active status.
- **`product_variants`**: Packaging variations, presentation formats, and grades.
- **`product_prices`**: Pricing tiers mapped to specific units of measure and currencies.
- **`measures` / `measure_families`**: Units of measure (kg, lbs, master cartons) with conversion ratios.
- **`countries`**: Destination countries for export shipping calculations.
- **`quotes` / `quote_items`**: Export inquiries, requested volumes, delivery terms (FOB/CIF), and contact details.
- **`contact_submissions`**: General inquiry and contact form entries.
- **`activity_logs`**: Administrative audit trail.

---

## 🛠️ Development & Migration Workflow

Commands executed via `pnpm`:

```bash
# 1. Update schema.prisma
# Edit prisma/schema.prisma with model changes

# 2. Push schema to development database
pnpm db:push

# 3. Re-generate Prisma types (used by seed scripts)
pnpm db:generate

# 4. Seed database with initial catalog, units, countries, and admin user
pnpm db:seed

# 5. Visual database exploration
pnpm db:studio
```

---

## 👤 Default Seed Credentials

When `pnpm db:seed` executes, it creates the initial administrative account:

- **Email**: `admin@zivahinternational.com`
- **Password**: `admin123!`

You can override these values via `.env.local` using `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`.
