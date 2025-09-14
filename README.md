# 🌊 ZIVAH International S.A. - Website

Modern Next.js website for **ZIVAH International S.A.**, premium Ecuadorian product exporters with headquarters in Samborondón, Guayas and distribution office in Miami, Florida.

## ✅ **Project Status: PRODUCTION READY**

### 🚀 **Tech Stack**
- **Framework**: Next.js 15.5.3 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4.1.13 with custom theme
- **Language**: TypeScript
- **Features**: Dark/Light mode, Smooth scrolling, Glass morphism effects
- **Deployment**: cPanel Node.js hosting compatible

### 🏗️ **Project Structure**

```
zivah-international/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles with theme variables
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── page.tsx           # Homepage with dynamic content
│   │   └── api/               # API routes
│   │       ├── categories/    # Product categories endpoint
│   │       ├── products/      # Products endpoint
│   │       ├── quotes/        # Quote requests endpoint
│   │       └── contact/       # Contact form endpoint
│   ├── components/            # React components
│   │   ├── ThemeProvider.tsx  # Theme context provider
│   │   ├── ClientThemeProvider.tsx # Client wrapper
│   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   ├── lib/                   # Utilities and services
│   │   ├── prisma.ts         # Database client
│   │   ├── utils.ts          # Helper functions
│   │   └── services/         # Business logic
│   └── types/                # TypeScript definitions
├── prisma/                   # Database layer
│   ├── schema.prisma        # Database schema
│   ├── seed.ts             # Database seeding
│   └── migrations/         # Database migrations
├── public/                  # Static assets
│   ├── assets/images/      # Images and icons
│   ├── robots.txt         # SEO configuration
│   ├── sitemap.xml        # Site structure
│   └── site.webmanifest   # PWA manifest
└── Configuration files
    ├── next.config.ts      # Next.js configuration
    ├── tailwind.config.ts  # Tailwind CSS setup
    ├── tsconfig.json      # TypeScript config
    └── package.json       # Dependencies and scripts
```

## 🎯 **Features**

### 🌙 **Dark/Light Mode**
- System preference detection
- localStorage persistence
- Smooth transitions with CSS variables
- Glass morphism effects adaptation
- Theme toggle with animated icons

### 📱 **Dynamic Content**
- PostgreSQL database with 3 categories, 30+ products
- API-driven product catalog
- Real-time category filtering
- Product search and display
- Quote request system

### 🎨 **Modern UI/UX**
- Responsive design (mobile-first)
- Smooth scrolling navigation
- Glass morphism effects
- Professional ZIVAH branding
- Interactive hover states

### ⚡ **Performance**
- Next.js 15 App Router optimization
- Image optimization with Next.js Image
- CSS-in-JS with Tailwind
- TypeScript for type safety
- API route optimization

## 🛠️ **Development**

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation
```bash
# Clone repository
git clone https://github.com/iferpaz7/zivah-international.git
cd zivah-international

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
npm run db:reset     # Reset and reseed database
```

## 🗄️ **Database Schema**

### Categories Table
- id, name, slug, description
- icon, color, sort_order
- is_active, timestamps

### Products Table
- id, name, slug, category_id
- description, short_description, sku
- base_price, price_unit, stock_quantity
- image_url, origin, harvest_season
- certifications, nutritional_info
- is_active, is_featured, timestamps

### Quotes Table (Future)
- Quote requests and items
- Customer information
- Product selections

## 🚀 **Production Deployment**

### cPanel Node.js Hosting (InterServer)

#### Prerequisites
- cPanel hosting account with Node.js support
- SSH access (recommended)
- PostgreSQL database created in cPanel

#### Deployment Steps

1. **Prepare Production Build**
```bash
# Build the application
npm run build

# Verify build output
ls -la .next/
```

2. **Upload Files via cPanel File Manager**
```
Upload these directories/files:
├── .next/                 # Build output
├── public/               # Static assets  
├── prisma/               # Database schema
├── src/                  # Source code
├── package.json          # Dependencies
├── next.config.ts        # Next.js config
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config
```

3. **Configure Environment Variables in cPanel**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

4. **Install Dependencies**
```bash
# Via SSH or cPanel Terminal
cd /path/to/your/app
npm install --production
```

5. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

6. **Configure Node.js App in cPanel**
- App Root: `/public_html/your-app` 
- App URL: `your-domain.com`
- App Startup File: `server.js` or `next start`
- Node.js Version: 18+ recommended

7. **Create Startup Script** (if needed)
```javascript
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

8. **Verify Deployment**
- Check application logs in cPanel
- Test website functionality
- Verify database connectivity
- Test API endpoints

### Environment Configuration

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# Next.js
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"

# Optional
ANALYZE="false"
```

### Troubleshooting

#### Common Issues
1. **Build Errors**: Check Node.js version compatibility
2. **Database Connection**: Verify DATABASE_URL format
3. **Static Files**: Ensure public/ directory is uploaded
4. **Permissions**: Check file permissions (755 for directories, 644 for files)

#### Logs Location
- cPanel: `/home/username/logs/`
- Application: Check cPanel Node.js app logs
- Database: PostgreSQL logs in cPanel

### Performance Optimization
- Enable gzip compression in cPanel
- Configure browser caching
- Use CDN for static assets (optional)
- Monitor database performance

## 📊 **Database Management**

### Prisma Commands
```bash
# Generate client after schema changes
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name description

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Backup Strategy
```bash
# Backup database
pg_dump -h localhost -U username dbname > backup.sql

# Restore database  
psql -h localhost -U username dbname < backup.sql
```

## 🔧 **Configuration**

### Tailwind CSS
- Custom theme with ZIVAH brand colors
- Dark mode configuration: `darkMode: 'class'`
- Glass morphism utilities
- Responsive breakpoints

### Next.js
- App Router configuration
- API routes for dynamic content
- Image optimization enabled
- TypeScript strict mode

### Environment Variables
Required for production:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL
- `NODE_ENV`: Set to "production"

## 📝 **License**

Copyright © 2025 ZIVAH International S.A. All rights reserved.

---

**ZIVAH International S.A.**  
Exportadores Premium de Productos Ecuatorianos  
🏢 Sede Principal: Samborondón, Guayas, Ecuador  
🏢 Oficina de Distribución: Miami, Florida, USA  
🌐 Website: [zivahinternational.com](https://zivahinternational.com)