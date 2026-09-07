# API Reference

This document catalogs the internal REST API endpoints available in the **ZIVAH International Website**. All API endpoints reside under `src/app/api/`.

---

## 🔑 Authentication Endpoints

### 1. User Sign In

`POST /api/auth/sign-in`

Authenticates credentials and establishes an HttpOnly session cookie.

- **Request Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Responses:**
  - `200 OK`: Sets `session_token` cookie and returns user object (`id`, `email`, `name`, `role`).
  - `401 Unauthorized`: Invalid email or password.
  - `429 Too Many Requests`: Rate limit exceeded.

---

### 2. User Sign Up

`POST /api/auth/sign-up`

Creates a new user account (defaults to `viewer` or standard client role).

- **Request Body (JSON):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Responses:**
  - `201 Created`: User created, session cookie established.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Email already registered.

---

### 3. User Sign Out

`POST /api/auth/sign-out`

Invalidates current session in the database and clears the session cookie.

- **Responses:**
  - `200 OK`: Session cleared.

---

### 4. Current Session

`GET /api/auth/session`

Returns the currently authenticated user based on the incoming session cookie.

- **Responses:**
  - `200 OK`: `{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`
  - `401 Unauthorized`: No active session or token expired.

---

## 📦 Public Catalog Endpoints

### 1. List Products

`GET /api/products`

Retrieves published products with optional category filtering and search parameters.

- **Query Parameters:**
  - `category` (optional string): Category slug.
  - `search` (optional string): Search term.
  - `locale` (optional string): `es` | `en` (default `es`).
- **Response:**
  - `200 OK`: Array of product summaries.

---

### 2. List Categories

`GET /api/categories`

Retrieves active product categories.

- **Response:**
  - `200 OK`: Array of categories (`id`, `slug`, `name_es`, `name_en`, `icon`).

---

## 📝 Quote & Inquiry Endpoints

### 1. Submit Quote Request

`POST /api/quotes`

Submits an international export quotation inquiry. Automatically triggers email notifications via Nodemailer.

- **Request Body (JSON):**
  ```json
  {
    "companyName": "Acme Global Imports",
    "contactName": "John Smith",
    "email": "john@acme.com",
    "phone": "+1 555-0199",
    "destinationCountryId": "uuid-here",
    "incoterm": "FOB",
    "notes": "Looking for weekly shipments to Port of Miami.",
    "items": [
      {
        "productId": "uuid-here",
        "variantId": "uuid-here",
        "quantity": 1000,
        "measureId": "uuid-here"
      }
    ]
  }
  ```
- **Responses:**
  - `201 Created`: `{ "success": true, "quoteId": "..." }`
  - `400 Bad Request`: Missing required fields or invalid item IDs.

---

### 2. Quote Reference Lookups

- `GET /api/quotes/countries`: Returns available shipping destination countries.
- `GET /api/quotes/measures`: Returns measurement units and family groupings (kg, lbs, cases).
- `GET /api/quotes/products/search?q=shrimp`: Autocomplete search for quote line items.

---

## 📬 Contact Form Endpoint

### Submit Contact Message

`POST /api/contact`

Receives customer inquiries from the contact page and sends email notifications to sales representatives.

- **Request Body (JSON):**
  ```json
  {
    "name": "Carlos Mendoza",
    "email": "carlos@example.com",
    "phone": "+593 99 999 9999",
    "subject": "Inquiry on Organic Shrimp Availability",
    "message": "We would like to request product specs and pricing..."
  }
  ```
- **Responses:**
  - `200 OK`: `{ "message": "Inquiry received successfully" }`
  - `400 Bad Request`: Zod validation errors.

---

## ⚙️ Administrative Endpoints (Admin Role Required)

- `GET /api/admin/products`: Full product list including inactive items.
- `POST /api/admin/products`: Create a new product.
- `PUT /api/admin/products/[id]`: Update product metadata and specifications.
- `DELETE /api/admin/products/[id]`: Deactivate / delete product.
- `POST /api/admin/products/[id]/translations`: Save localized translations for a product.
- `GET /api/admin/categories`: Category management.
- `POST /api/admin/categories`: Create category.
- `PUT /api/admin/categories/[id]`: Update category.

---

## 💓 Health Endpoint

### Health Check

`GET /api/health`

Verifies that the Node.js process is active and database connectivity via `pg` is healthy.

- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-06T22:30:00.000Z",
    "database": "connected"
  }
  ```
