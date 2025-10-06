# 🚀 ZIVAH International - Complete cPanel Deployment Guide

## 📋 Overview

This guide will help you deploy your Next.js application with PostgreSQL database to cPanel hosting.

## ⚡ Quick Deployment Options

### Option 1: Automated FTP Deployment (Recommended)

**Windows:**

```bash
.\deploy.bat
# Choose 'y' for automatic FTP upload when prompted
```

**Linux/Mac:**

```bash
./deploy.sh
# Choose 'y' for automatic FTP upload when prompted
```

### Option 2: Manual Upload

**Windows:**

```bash
.\deploy.bat
# Choose 'N' for manual upload
# Then upload zivah-deploy.zip via cPanel File Manager
```

**Linux/Mac:**

```bash
./deploy.sh
# Choose 'N' for manual upload
# Then upload zivah-deploy.tar.gz via cPanel File Manager
```

## 🔧 FTP Configuration

Your FTP settings are pre-configured:

- **FTP Server**: `ftp.zivahinternational.com`
- **Username**: `zivahint`
- **Port**: `21` (FTP/Explicit FTPS)
- **Upload Path**: `/public_html/zivah-app/`

## 📦 What Gets Deployed

The deployment package includes:

- ✅ Compiled Next.js application (`.next/` folder)
- ✅ Static assets (`public/` folder)
- ✅ Source code (`src/` folder)
- ✅ Database schema (`prisma/` folder)
- ✅ Production configuration files
- ✅ Custom `server.js` for cPanel compatibility
- ✅ Environment variables (`.env`)

## 🚀 Step-by-Step Deployment

### Step 1: Run Deployment Script

Choose your platform and run the deployment script:

**Windows:** `.\deploy.bat`
**Linux/Mac:** `./deploy.sh`

The script will:

1. 📦 Build your Next.js application
2. 🗄️ Generate Prisma client
3. 📁 Prepare deployment files
4. 📦 Create compressed archive
5. 🌐 Offer FTP upload option

### Step 2: Upload to cPanel

#### Automatic FTP Upload

- Enter 'y' when prompted
- Provide your FTP password
- Files upload directly to `/public_html/zivah-app/`

#### Manual Upload

- Enter 'N' when prompted
- Upload the archive to cPanel File Manager
- Navigate to `/public_html/zivah-app/`
- Extract the archive

### Step 3: Configure cPanel Database

#### 3.1 Create PostgreSQL Database

1. **cPanel Dashboard** → **PostgreSQL Databases**
2. **Create Database**: `zivah_production`
3. **Create User**: Create a database user with full privileges
4. **Note Connection Details**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `cpanel_username_zivah_production`
   - Username: `cpanel_username_dbuser`
   - Password: [your chosen password]

#### 3.2 Set File Permissions

```bash
# If you have SSH access
chmod 755 server.js
chmod 644 package.json
chmod 644 .env
```

### Step 4: Configure Node.js in cPanel

#### 4.1 Create Node.js Application

1. **cPanel** → **Node.js Apps**
2. **Create Application**:
   - **Node.js Version**: 18.x or 20.x
   - **Application Mode**: Production
   - **Application Root**: `/public_html/zivah-app`
   - **Application URL**: `zivahinternational.com`
   - **Application Startup File**: `server.js`

#### 4.2 Set Environment Variables

In cPanel Node.js App → Environment Variables, add:

```env
DATABASE_URL="postgresql://cpanel_username_dbuser:your_password@localhost:5432/cpanel_username_zivah_production"
NEXTAUTH_URL="https://zivahinternational.com"
NEXTAUTH_SECRET="your-64-character-random-string"
NODE_ENV="production"
```

#### 4.3 Install Dependencies

1. In the Node.js app interface, click **"Run NPM Install"**
2. Or via SSH terminal:

```bash
cd /home/username/public_html/zivah-app
npm install --production
```

### Step 5: Database Migration

#### 5.1 Run Prisma Migrations

```bash
# Via SSH or cPanel Terminal
cd /home/username/public_html
npx prisma migrate deploy
npx prisma generate
```

#### 5.2 Populate Database (Optional)

```bash
# If you have seed data
npx prisma db seed
```

### Step 6: Environment Configuration

#### 6.1 Set Environment Variables in cPanel

**Method 1: Node.js App Interface**

1. Go to your Node.js app in cPanel
2. Click **"Environment Variables"**
3. Add each variable from your `.env` file

**Method 2: Via Terminal**

```bash
export DATABASE_URL="your-database-url"
export NEXTAUTH_SECRET="your-secret"
export NEXTAUTH_URL="https://zivahinternational.com"
```

### Step 7: Start Your Application

#### 7.1 Start the App

1. **cPanel** → **Node.js Apps** → Your App
2. Click **"Start App"**
3. Monitor the startup logs

#### 7.2 Verify Deployment

1. Visit `https://zivahinternational.com`
2. Check that all pages load correctly
3. Test contact forms and quote requests
4. Verify database connectivity

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Database Connection Failed

**Solution:**

```bash
# Check database credentials
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

#### Issue 2: Application Won't Start

**Solution:**

1. Check Node.js version (must be 18+)
2. Verify `server.js` is in the root directory
3. Check application logs in cPanel

#### Issue 3: Build Errors

**Solution:**

```bash
# Rebuild the application
npm run build
npx prisma generate
```

#### Issue 4: Permission Errors

**Solution:**

```bash
# Fix file permissions
find /home/username/public_html -type f -exec chmod 644 {} \;
find /home/username/public_html -type d -exec chmod 755 {} \;
chmod 755 server.js
```

---

## 📊 Performance Optimization

### Enable Compression

Add to your `server.js` or use cPanel compression settings.

### Cache Configuration

Your app already includes proper cache headers in `next.config.ts`.

### Database Connection Pooling

Consider using connection pooling for better performance:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"
```

---

## 🔒 Security Checklist

- ✅ Environment variables are properly set
- ✅ Database credentials are secure
- ✅ HTTPS is enabled
- ✅ Security headers are configured
- ✅ Rate limiting is active
- ✅ Input validation is implemented

---

## 📈 Monitoring

### Log Files

- Application logs: Check cPanel Node.js app logs
- Error tracking: Built-in error handling
- Performance: Web Vitals monitoring included

### Health Checks

- Database connectivity: `/api/health` (you may need to create this)
- API endpoints: Test all `/api/*` routes
- Email functionality: Test contact forms

---

## 🆘 Support

### If You Need Help

1. Check cPanel error logs
2. Review Node.js application logs
3. Verify all environment variables
4. Ensure database is accessible
5. Contact your hosting provider for Node.js specific issues

### Useful Commands

```bash
# Check app status
pm2 status  # If PM2 is available

# View logs
tail -f logs/app.log

# Restart application
# Use cPanel Node.js interface to restart
```

---

## 📱 Post-Deployment Tasks

1. **Test All Functionality**:
   - Homepage loading
   - Product pages
   - Contact forms
   - Quote requests
   - Admin authentication (if applicable)

2. **SEO Configuration**:
   - Submit sitemap to Google Search Console
   - Verify Google Analytics is working
   - Check structured data

3. **Performance Testing**:
   - Run PageSpeed Insights
   - Test Core Web Vitals
   - Verify image optimization

4. **Backup Setup**:
   - Schedule database backups
   - Backup application files
   - Document recovery procedures

---

## 🔄 Update Deployment

For future updates, simply run the deployment script again:

**Windows:** `.\deploy.bat`
**Linux/Mac:** `./deploy.sh`

Choose FTP upload to automatically sync changes to your server.

## 🛠️ Troubleshooting

### FTP Connection Issues

**Test FTP connection manually:**

```bash
ftp ftp.zivahinternational.com
# Username: zivahint
# Password: [your password]
```

**Common solutions:**

- Check username/password
- Verify firewall settings
- Ensure FTP user has write access to `/public_html/zivah-app/`

### Application Issues

**File permissions (if using SSH):**

```bash
chmod 755 server.js
chmod 644 package.json .env
```

**Clear cache and restart:**

- cPanel → Node.js Apps → Restart App
- Clear browser cache

### Alternative Upload Methods

If FTP fails:

1. **File Manager**: Upload archive via cPanel File Manager
2. **SFTP**: Use FileZilla with SFTP protocol
3. **Git Deploy**: Set up Git-based deployment (advanced)

## 📊 Deployment Features

### Security

- ✅ Secure FTP password input (hidden)
- ✅ Environment variables properly configured
- ✅ No credentials stored in repository

### Performance

- ✅ Optimized production build
- ✅ Compressed file transfer
- ✅ Only essential files included

### Reliability

- ✅ Connection testing before upload
- ✅ Comprehensive error reporting
- ✅ Progress monitoring

## 🎉 Deployment Complete!

Your ZIVAH International website should now be live at:

**🔗 https://zivahinternational.com**

### Final Checklist

- ✅ Application deployed and running
- ✅ Database connected and migrated
- ✅ Environment variables configured
- ✅ SSL certificate installed
- ✅ Domain pointing to correct directory

---

_Monitor your application through cPanel Node.js Apps interface and check logs for any issues._
