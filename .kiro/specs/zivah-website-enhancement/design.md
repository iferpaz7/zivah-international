# Design Document

## Overview

El diseño propuesto transforma el sitio web estático de ZIVAH International en una aplicación web moderna usando Next.js 15+, PostgreSQL, Prisma ORM, y TailwindCSS. La solución implementa arquitectura de aplicación full-stack con Server Side Rendering (SSR), Static Site Generation (SSG), y API Routes nativas de Next.js.

La arquitectura seguirá el patrón de App Router de Next.js con componentes de servidor y cliente, utilizando Prisma como ORM para la gestión de datos y TailwindCSS para un diseño responsivo y moderno. Se implementará un sistema de autenticación con NextAuth.js, panel de administración intuitivo, y API Routes para todas las operaciones CRUD.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js UI)  │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│   Prisma ORM    │◄─────────────┘
                        │   (Data Layer)  │
                        └─────────────────┘
```

### Directory Structure

```
/zivah-international/
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # TailwindCSS configuration
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── src/                     # Application source
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── (admin)/         # Admin routes group
│   │   ├── (auth)/          # Auth routes group
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── validations.ts   # Zod schemas
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript type definitions
├── .env.local               # Environment variables
└── .env.example             # Environment template
```

### Technology Stack

- **Framework**: Next.js 15+ (App Router, SSR, SSG, React Compiler)
- **Database**: PostgreSQL 15+ (with connection pooling)
- **ORM**: Prisma (type-safe database client)
- **Frontend**: React 19+ with TypeScript
- **Styling**: TailwindCSS + Headless UI components
- **Authentication**: NextAuth.js v5 (OAuth, credentials)
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend API or NodeMailer
- **File Upload**: Next.js API routes with cloud storage
- **State Management**: React Server Components + Zustand (client state)
- **Testing**: Jest + Testing Library + Playwright

## Components and Interfaces

### 1. Database Layer (Prisma ORM)

#### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(100)
  slug        String    @unique @db.VarChar(100)
  description String?   @db.Text
  icon        String?   @db.VarChar(50)
  color       String?   @db.VarChar(7)
  sortOrder   Int       @default(0) @map("sort_order")
  products    Product[]
  
  @@map("categories")
}

model Product {
  id            Int         @id @default(autoincrement())
  name          String      @db.VarChar(255)
  categoryId    Int?        @map("category_id")
  description   String?     @db.Text
  features      Json?
  price         Decimal?    @db.Decimal(10, 2)
  stockQuantity Int         @default(0) @map("stock_quantity")
  imageUrl      String?     @db.VarChar(500) @map("image_url")
  isActive      Boolean     @default(true) @map("is_active")
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")
  
  category      Category?   @relation(fields: [categoryId], references: [id])
  quoteItems    QuoteItem[]
  
  @@index([categoryId])
  @@index([isActive])
  @@map("products")
}

model Quote {
  id             Int         @id @default(autoincrement())
  quoteNumber    String      @unique @db.VarChar(20) @map("quote_number")
  customerName   String      @db.VarChar(255) @map("customer_name")
  customerEmail  String      @db.VarChar(255) @map("customer_email")
  customerPhone  String?     @db.VarChar(50) @map("customer_phone")
  company        String?     @db.VarChar(255)
  country        String?     @db.VarChar(100)
  message        String?     @db.Text
  status         QuoteStatus @default(PENDING)
  totalAmount    Decimal?    @db.Decimal(12, 2) @map("total_amount")
  adminNotes     String?     @db.Text @map("admin_notes")
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")
  
  items          QuoteItem[]
  
  @@index([status])
  @@index([customerEmail])
  @@index([createdAt])
  @@map("quotes")
}

model QuoteItem {
  id         Int     @id @default(autoincrement())
  quoteId    Int     @map("quote_id")
  productId  Int     @map("product_id")
  quantity   Int
  unitPrice  Decimal @db.Decimal(10, 2) @map("unit_price")
  totalPrice Decimal @db.Decimal(12, 2) @map("total_price")
  notes      String? @db.Text
  
  quote      Quote   @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  product    Product @relation(fields: [productId], references: [id])
  
  @@map("quote_items")
}

model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique @db.VarChar(50)
  email     String    @unique @db.VarChar(255)
  password  String    @db.VarChar(255)
  fullName  String?   @db.VarChar(255) @map("full_name")
  role      UserRole  @default(VIEWER)
  isActive  Boolean   @default(true) @map("is_active")
  lastLogin DateTime? @map("last_login")
  createdAt DateTime  @default(now()) @map("created_at")
  
  activityLogs ActivityLog[]
  
  @@map("admin_users")
}

model SiteSetting {
  id           Int         @id @default(autoincrement())
  key          String      @unique @db.VarChar(100) @map("setting_key")
  value        String?     @db.Text @map("setting_value")
  type         SettingType @default(TEXT) @map("setting_type")
  description  String?     @db.Text
  updatedAt    DateTime    @updatedAt @map("updated_at")
  
  @@map("site_settings")
}

model ActivityLog {
  id         Int      @id @default(autoincrement())
  userId     Int?     @map("user_id")
  action     String   @db.VarChar(100)
  tableName  String?  @db.VarChar(50) @map("table_name")
  recordId   Int?     @map("record_id")
  oldValues  Json?    @map("old_values")
  newValues  Json?    @map("new_values")
  ipAddress  String?  @db.VarChar(45) @map("ip_address")
  userAgent  String?  @db.Text @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")
  
  user       User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("activity_logs")
}

enum QuoteStatus {
  PENDING
  PROCESSING
  SENT
  CLOSED
}

enum UserRole {
  ADMIN
  MANAGER
  VIEWER
}

enum SettingType {
  TEXT
  NUMBER
  BOOLEAN
  JSON
}
```

#### Service Layer Interfaces

```typescript
// lib/services/product.service.ts
export interface ProductFilters {
  categoryId?: number;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]>
  async getProductById(id: number): Promise<Product | null>
  async getProductsByCategory(categoryId: number): Promise<Product[]>
  async createProduct(data: CreateProductInput): Promise<Product>
  async updateProduct(id: number, data: UpdateProductInput): Promise<Product>
  async deleteProduct(id: number): Promise<boolean>
  async updateStock(id: number, quantity: number): Promise<Product>
}

// lib/services/quote.service.ts
export interface QuoteFilters {
  status?: QuoteStatus;
  customerEmail?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class QuoteService {
  async getQuotes(filters?: QuoteFilters): Promise<Quote[]>
  async getQuoteById(id: number): Promise<Quote | null>
  async createQuote(data: CreateQuoteInput): Promise<Quote>
  async updateQuoteStatus(id: number, status: QuoteStatus): Promise<Quote>
  async getQuoteStatistics(): Promise<QuoteStatistics>
  async generateQuoteNumber(): Promise<string>
}
```

### 2. API Routes Layer

#### Next.js API Routes

```typescript
// app/api/products/route.ts
export async function GET(request: Request): Promise<Response>
export async function POST(request: Request): Promise<Response>

// app/api/products/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response>
export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<Response>
export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<Response>

// app/api/categories/route.ts
export async function GET(): Promise<Response>
export async function POST(request: Request): Promise<Response>

// app/api/quotes/route.ts
export async function GET(request: Request): Promise<Response>
export async function POST(request: Request): Promise<Response>

// app/api/quotes/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response>
export async function PATCH(request: Request, { params }: { params: { id: string } }): Promise<Response>

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// app/api/upload/route.ts
export async function POST(request: Request): Promise<Response>
```

### 3. Service Layer

#### Core Services

```typescript
// lib/services/product.service.ts
export class ProductService {
  async getAllProducts(filters?: ProductFilters): Promise<Product[]>
  async getProductById(id: number): Promise<Product | null>
  async createProduct(data: CreateProductInput): Promise<Product>
  async updateProduct(id: number, data: UpdateProductInput): Promise<Product>
  async deleteProduct(id: number): Promise<boolean>
  async updateStock(id: number, quantity: number): Promise<Product>
}

// lib/services/quote.service.ts
export class QuoteService {
  async createQuote(data: CreateQuoteInput): Promise<Quote>
  async processQuote(id: number): Promise<boolean>
  async sendQuoteEmail(quote: Quote): Promise<boolean>
  async generateQuoteNumber(): Promise<string>
  async calculateTotal(items: QuoteItem[]): Promise<number>
}

// lib/services/email.service.ts
export class EmailService {
  async sendQuoteNotification(quote: Quote): Promise<boolean>
  async sendQuoteResponse(quote: Quote, message: string): Promise<boolean>
  async sendWelcomeEmail(email: string, name: string): Promise<boolean>
}

// lib/services/auth.service.ts
export class AuthService {
  async verifyCredentials(username: string, password: string): Promise<User | null>
  async hashPassword(password: string): Promise<string>
  async comparePassword(password: string, hash: string): Promise<boolean>
  async createUser(data: CreateUserInput): Promise<User>
}

// lib/services/file.service.ts
export class FileService {
  async uploadImage(file: File): Promise<string>
  async deleteImage(url: string): Promise<boolean>
  async optimizeImage(file: File): Promise<File>
}
```

### 4. Frontend Components

#### React Components

```typescript
// components/products/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToQuote?: (product: Product) => void;
}
export function ProductCard({ product, onAddToQuote }: ProductCardProps): JSX.Element

// components/products/ProductList.tsx
interface ProductListProps {
  products: Product[];
  loading?: boolean;
}
export function ProductList({ products, loading }: ProductListProps): JSX.Element

// components/quotes/QuoteForm.tsx
interface QuoteFormProps {
  items: QuoteItem[];
  onSubmit: (data: CreateQuoteInput) => Promise<void>;
}
export function QuoteForm({ items, onSubmit }: QuoteFormProps): JSX.Element

// components/admin/Dashboard.tsx
interface DashboardProps {
  statistics: QuoteStatistics;
  recentQuotes: Quote[];
}
export function Dashboard({ statistics, recentQuotes }: DashboardProps): JSX.Element

// components/admin/ProductManager.tsx
interface ProductManagerProps {
  onProductCreate: (data: CreateProductInput) => Promise<void>;
  onProductUpdate: (id: number, data: UpdateProductInput) => Promise<void>;
  onProductDelete: (id: number) => Promise<void>;
}
export function ProductManager(props: ProductManagerProps): JSX.Element

// components/forms/ContactForm.tsx
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}
export function ContactForm(): JSX.Element

// hooks/useQuote.ts
export function useQuote() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const addItem = (product: Product, quantity: number) => void;
  const removeItem = (productId: number) => void;
  const calculateTotal = () => number;
  const submitQuote = (customerData: CustomerData) => Promise<void>;
  return { items, addItem, removeItem, calculateTotal, submitQuote };
}
```

## Data Models

### TypeScript Types

```typescript
// types/product.ts
export interface Product {
  id: number;
  name: string;
  categoryId?: number;
  description?: string;
  features?: Record<string, any>;
  price?: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  quoteItems?: QuoteItem[];
}

export interface CreateProductInput {
  name: string;
  categoryId?: number;
  description?: string;
  features?: Record<string, any>;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// types/quote.ts
export interface Quote {
  id: number;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  country?: string;
  message?: string;
  status: QuoteStatus;
  totalAmount?: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  quoteId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  product: Product;
}

export interface CreateQuoteInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  country?: string;
  message?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}

// types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  products?: Product[];
}

// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  CLOSED = 'CLOSED'
}
```

## Error Handling

### Error Types

```typescript
// lib/errors/base.ts
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
  
  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly isOperational = true;
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly isOperational = true;
}

export class DatabaseError extends AppError {
  readonly statusCode = 500;
  readonly isOperational = true;
}
```

### API Error Response Format

```typescript
// lib/api/response.ts
export interface ApiErrorResponse {
  error: true;
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ApiSuccessResponse<T = any> {
  error: false;
  data: T;
  message?: string;
  timestamp: string;
}

export function createErrorResponse(error: AppError): ApiErrorResponse {
  return {
    error: true,
    message: error.message,
    code: error.name,
    statusCode: error.statusCode,
    details: error.context,
    timestamp: new Date().toISOString(),
  };
}

export function createSuccessResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  return {
    error: false,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}
```

### Error Boundary and Global Handler

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// lib/logger.ts
export class Logger {
  static error(message: string, context?: Record<string, any>): void
  static warn(message: string, context?: Record<string, any>): void
  static info(message: string, context?: Record<string, any>): void
  static debug(message: string, context?: Record<string, any>): void
}
```

## Testing Strategy

### Unit Testing

- **Models**: Validación de datos, métodos de negocio
- **Repositories**: Operaciones CRUD, consultas complejas
- **Services**: Lógica de negocio, integración entre componentes
- **Controllers**: Manejo de requests, responses

### Integration Testing

- **Database**: Conexiones, transacciones, migraciones
- **Email**: Envío de notificaciones, templates
- **File Upload**: Subida de imágenes, validación de archivos
- **Authentication**: Login, logout, permisos

### End-to-End Testing

- **User Flows**: Solicitud de cotización completa
- **Admin Flows**: Gestión de productos, procesamiento de cotizaciones
- **API Endpoints**: Todas las rutas REST

### Performance Testing

- **Load Testing**: Simulación de tráfico alto
- **Database Performance**: Optimización de consultas
- **Caching**: Efectividad del sistema de caché
- **Mobile Performance**: Tiempos de carga en dispositivos móviles

## Security Considerations

### Authentication & Authorization

- **Password Hashing**: bcrypt con salt
- **Session Management**: Tokens JWT + PHP sessions
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **CSRF Protection**: Tokens en formularios

### Data Protection

- **SQL Injection**: Prepared statements obligatorios
- **XSS Prevention**: Sanitización de inputs y outputs
- **File Upload Security**: Validación de tipos MIME
- **Data Encryption**: Información sensible en base de datos

### Infrastructure Security

- **HTTPS**: Certificado SSL obligatorio
- **File Permissions**: Configuración segura en cPanel
- **Database Access**: Usuarios con permisos mínimos
- **Backup Security**: Encriptación de backups

## Performance Optimization

### Caching Strategy

```typescript
// lib/cache/cache-manager.ts
export class CacheManager {
  // Next.js built-in caching
  static async get<T>(key: string): Promise<T | null>
  static async set<T>(key: string, value: T, ttl?: number): Promise<void>
  static async delete(key: string): Promise<void>
  static async invalidateTag(tag: string): Promise<void>
}

// Using Next.js 13+ caching
export const revalidate = 3600; // 1 hour
export async function getProducts() {
  return await fetch('/api/products', {
    next: { tags: ['products'] }
  });
}
```

### Database Optimization

- **Connection Pooling**: Prisma connection pooling
- **Query Optimization**: Prisma query optimization and includes
- **Database Indexing**: Proper indexing in Prisma schema
- **Pagination**: Cursor-based pagination with Prisma

```typescript
// Optimized queries with Prisma
const products = await prisma.product.findMany({
  include: {
    category: true,
    _count: {
      select: { quoteItems: true }
    }
  },
  where: {
    isActive: true,
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10,
  skip: (page - 1) * 10,
});
```

### Frontend Optimization

- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic code splitting with Next.js
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Static Generation**: ISR (Incremental Static Regeneration)
- **Edge Functions**: Vercel Edge Functions for geo-performance

## Deployment Strategy

### Vercel Deployment (Recommended)

1. **Database Setup**: PostgreSQL instance on Neon, Supabase, or Railway
2. **Environment Variables**: Configure in Vercel dashboard
3. **Domain Configuration**: Custom domain setup with Vercel
4. **Email Setup**: Resend API for transactional emails
5. **SSL Certificate**: Automatic HTTPS with Vercel

### Alternative: VPS Deployment

1. **Server Setup**: Ubuntu/Debian server with Node.js 18+
2. **Database**: PostgreSQL 15+ with connection pooling
3. **Process Management**: PM2 for Node.js process management
4. **Reverse Proxy**: Nginx for load balancing and SSL termination
5. **SSL Certificate**: Let's Encrypt with Certbot

### Environment Configuration

```bash
# .env.local
# Database
DATABASE_URL="postgresql://username:password@hostname:5432/database"

# NextAuth.js
NEXTAUTH_URL="https://zivah.com"
NEXTAUTH_SECRET="your-secret-key"

# Email
RESEND_API_KEY="re_xxxxxxxxxx"
FROM_EMAIL="no-reply@zivah.com"

# File Upload
NEXT_PUBLIC_UPLOAD_MAX_SIZE="10485760"
UPLOAD_DIR="/uploads"

# App Configuration
NEXT_PUBLIC_APP_URL="https://zivah.com"
NODE_ENV="production"
```

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    ppr: true, // Partial Prerendering
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zivah.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;
```

### Migration Strategy

1. **Backup Current Site**: Complete backup of static site
2. **Database Setup**: PostgreSQL instance with Prisma migrations
3. **Content Migration**: Static content to dynamic database-driven content
4. **Development Environment**: Local development with Docker/Docker Compose
5. **Staging Deployment**: Vercel preview deployment for testing
6. **Production Deployment**: Production deployment with monitoring

## Monitoring and Maintenance

### Logging and Analytics

```typescript
// lib/logger.ts
import { Logger } from '@/lib/logger';

export class AppLogger {
  static info(message: string, context?: Record<string, any>): void
  static warn(message: string, context?: Record<string, any>): void
  static error(message: string, context?: Record<string, any>): void
  static debug(message: string, context?: Record<string, any>): void
}

// Integration with Vercel Analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

### Health Checks and Monitoring

- **Database Health**: Prisma connection monitoring
- **API Monitoring**: Response times and error rates
- **Email Delivery**: Track email send success rates
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Sentry integration for error monitoring
- **Uptime Monitoring**: External service monitoring

### Backup and Recovery Strategy

- **Database Backups**: Automated PostgreSQL backups (daily/weekly)
- **Code Repository**: Git version control with GitHub
- **Asset Backups**: Cloud storage backup for uploaded files
- **Environment Recovery**: Infrastructure as Code with Terraform/Pulumi
- **Disaster Recovery**: Multi-region deployment capability

### Development Workflow

```typescript
// Development setup with Docker Compose
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/zivah_dev
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: zivah_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```