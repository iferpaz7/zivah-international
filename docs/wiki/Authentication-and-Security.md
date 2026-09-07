# Authentication & Security

This guide outlines the authentication system, authorization layers, and security practices implemented in the **ZIVAH International Website**.

---

## 🔐 Custom Session-Based Authentication

The application implements a self-contained, session-based authentication system backed by PostgreSQL. It does **not** rely on external third-party identity providers (e.g. Auth0, AWS Cognito, or Firebase).

### Authentication Flow

```
   [User Browser]                   [Next.js API]                    [PostgreSQL DB]
          │                                │                                 │
          │ 1. POST /api/auth/sign-in      │                                 │
          │    (email, password)           │                                 │
          ├───────────────────────────────>│                                 │
          │                                │ 2. Query user by email          │
          │                                ├────────────────────────────────>│
          │                                │<────────────────────────────────┤
          │                                │ 3. Verify bcryptjs hash         │
          │                                │ 4. Generate UUID session token  │
          │                                │ 5. INSERT into `sessions` table │
          │                                ├────────────────────────────────>│
          │                                │<────────────────────────────────┤
          │ 6. Set-Cookie: session_token   │                                 │
          │    (HttpOnly, Secure, SameSite)│                                 │
          │<───────────────────────────────┤                                 │
          │                                │                                 │
          │ 7. Authenticated Request       │                                 │
          │    (Cookie: session_token)     │                                 │
          ├───────────────────────────────>│ 8. getAuthUser()                │
          │                                │    Verify token & expiry        │
          │                                ├────────────────────────────────>│
          │                                │<────────────────────────────────┤
```

---

## 🍪 Cookie & Session Details

- **Token Format:** Cryptographically secure UUID (`crypto.randomUUID()`).
- **Storage:** Persisted in the `sessions` table with an expiration date (default: 7 days) and user ID.
- **Delivery:** Transported to the browser via an `HttpOnly`, `SameSite=lax`, `Secure` (production only) cookie.
- **Client Shielding:** JavaScript executing in the browser cannot read the `session_token` cookie, preventing token theft via Cross-Site Scripting (XSS).

---

## 👥 Role-Based Access Control (RBAC)

The application defines four distinct user roles in the `users` table:

| Role                | Permissions                                                                                            |
| :------------------ | :----------------------------------------------------------------------------------------------------- |
| **`admin`**         | Full administrative privileges: user management, product/category updates, quote processing, settings. |
| **`sales_manager`** | Full quote management, quote assignment, customer communication, product catalog viewing.              |
| **`sales_rep`**     | Assigned quote processing and correspondence.                                                          |
| **`viewer`**        | Read-only access to admin dashboards and analytics.                                                    |

### Protected Route Enforcement

Server-side protection is enforced in `src/lib/auth.ts` using `getAuthUser()`:

```typescript
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
```

---

## 🛡️ Security Defenses

### 1. SQL Injection Prevention

All PostgreSQL database queries must execute with parameterized arguments through `src/lib/db.ts`:

```typescript
// SECURE
await query('SELECT * FROM users WHERE email = $1', [email]);

// FORBIDDEN
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

### 2. Password Hashing

Passwords are never stored in plaintext. They are hashed using `bcryptjs` with **12 salt rounds** before writing to the database (`src/lib/password.ts`).

### 3. Strict Input Validation (Zod)

Every API endpoint validates incoming payloads using Zod schemas before processing data:

- Rejects unexpected fields.
- Validates lengths, email formats, and string boundaries.
- Coerces and sanitizes numeric values.

### 4. Rate Limiting (Upstash Redis)

Sensitive endpoints (login, quote requests, contact submissions) are throttled using `@upstash/ratelimit` to protect against brute-force attacks and abuse.

### 5. Security Headers

Production HTTP headers configured in `next.config.ts` include:

- `Content-Security-Policy` (CSP)
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY` (Clickjacking defense)
- `X-Content-Type-Options: nosniff` (MIME sniffing defense)
- `Referrer-Policy: strict-origin-when-cross-origin`
