#!/bin/bash

# =======================================================
# ZIVAH International - Simple Deployment Script
# =======================================================

echo "🚀 ZIVAH International - Simple Deployment"
echo "==========================================="

# 1. Build the application
echo "📦 Building application..."
npm run build

# 2. Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# 3. Create deployment directory
echo "📁 Preparing deployment files..."
rm -rf deploy 2>/dev/null
mkdir -p deploy

# 4. Copy essential files only
echo "📋 Copying essential files..."

# Core files
cp package.json deploy/
cp server.js deploy/
cp .env.production deploy/.env 2>/dev/null || echo "No .env.production found"
cp next.config.ts deploy/

# Next.js build (essential files only)
cp -r .next deploy/ 2>/dev/null || echo "No .next directory found"
cp -r public deploy/
cp -r src deploy/
cp -r prisma deploy/

# 5. Clean unnecessary files
echo "🧹 Cleaning unnecessary files..."
find ./deploy -name "*.pack*" -delete 2>/dev/null || true
find ./deploy -name "*.gz" -delete 2>/dev/null || true
find ./deploy -name "*.map" -delete 2>/dev/null || true
find ./deploy -name "*tsbuildinfo*" -delete 2>/dev/null || true
find ./deploy -name "*.log" -delete 2>/dev/null || true
find ./deploy -name "*.old" -delete 2>/dev/null || true
rm -rf ./deploy/.next/cache 2>/dev/null || true

# Count final files
FINAL_COUNT=$(find ./deploy -type f | wc -l)
echo "📊 Final file count: $FINAL_COUNT (cleaned)"

# 6. Create archive
echo "📦 Creating deployment archive..."
cd deploy && tar -czf ../zivah-deploy.tar.gz * && cd ..

if [ -f "zivah-deploy.tar.gz" ]; then
    SIZE=$(du -h zivah-deploy.tar.gz | cut -f1)
    echo "✅ Deployment ready: zivah-deploy.tar.gz ($SIZE)"
    echo ""
    echo "📋 Upload Instructions:"
    echo "1. Upload zivah-deploy.tar.gz to cPanel File Manager"
    echo "2. Navigate to /public_html/zivah-app/"
    echo "3. Upload and extract the archive"
    echo "4. Configure Node.js app (startup: server.js)"
    echo "5. Set environment variables in cPanel"
    echo "6. Start your application"
    echo ""
    echo "🎉 Ready for deployment!"
else
    echo "❌ Failed to create archive"
    echo "📁 Manual upload from: ./deploy/"
fi
cp package.json deploy/
cp package-lock.json deploy/
cp next.config.ts deploy/
cp server.js deploy/
cp .env.production deploy/.env
cp middleware.ts deploy/ 2>/dev/null || echo "No middleware.ts found"

# Next.js build output
cp -r .next deploy/
cp -r public deploy/
cp -r src deploy/

# Prisma files
cp -r prisma deploy/
cp -r node_modules/.prisma deploy/node_modules/.prisma 2>/dev/null || echo "No .prisma found"

# 6. Create cPanel-specific package.json
echo "⚙️ Creating cPanel-specific configuration..."
cat > deploy/package.json << EOF
{
  "name": "zivah-international-website",
  "version": "1.0.0",
  "description": "ZIVAH International S.A. - Corporate Website",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.16.1",
    "prisma": "^6.16.1",
    "@auth/prisma-adapter": "^2.10.0",
    "next-auth": "^4.24.11",
    "nodemailer": "^6.9.15",
    "zod": "^3.24.1",
    "@hookform/resolvers": "^5.2.1",
    "react-hook-form": "^7.56.1"
  }
}
EOF

# 7. FTP Upload Function
upload_via_ftp() {
    echo "📡 Starting FTP upload to zivahinternational.com..."

    # Check if FTP config exists
    if [ ! -f ".ftpconfig" ]; then
        echo "❌ FTP config file not found. Creating template..."
        cp .ftpconfig.example .ftpconfig
        echo "📝 Please edit .ftpconfig with your FTP password and run again."
        return 1
    fi

    # Load FTP configuration
    source .ftpconfig

    # Check if lftp is installed
    if ! command -v lftp &> /dev/null; then
        echo "❌ lftp is not installed. Installing..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y lftp
        elif command -v yum &> /dev/null; then
            sudo yum install -y lftp
        elif command -v brew &> /dev/null; then
            brew install lftp
        else
            echo "❌ Please install lftp manually: https://lftp.yandex.ru/"
            return 1
        fi
    fi

    # Create lftp script
    cat > ftp_upload.txt << EOL
set ftp:ssl-allow no
set ftp:ssl-force no
set ssl:verify-certificate no
open -p $FTP_PORT $FTP_HOST
user $FTP_USER $FTP_PASS
cd $FTP_REMOTE_DIR
lcd $FTP_LOCAL_DIR
mirror --reverse --delete --verbose --parallel=3 ./ ./
quit
EOL

    # Execute FTP upload
    echo "🔄 Uploading files..."
    if lftp -f ftp_upload.txt; then
        echo "✅ FTP upload completed successfully!"
        rm ftp_upload.txt
        return 0
    else
        echo "❌ FTP upload failed!"
        rm ftp_upload.txt
        return 1
    fi
}

echo "✅ Deployment preparation completed!"
echo ""
echo "� Choose deployment method:"
echo "1. Manual upload (copy files from ./deploy/)"
echo "2. Automatic FTP upload"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "📋 Manual Upload Steps:"
        echo "1. Upload the 'deploy' folder contents to your cPanel public_html directory"
        echo "2. Configure environment variables in cPanel"
        echo "3. Set up your PostgreSQL database"
        echo "4. Run database migrations"
        echo "5. Start your Node.js application"
        echo ""
        echo "📁 Files ready for upload in: ./deploy/"
        ;;
    2)
        if upload_via_ftp; then
            echo ""
            echo "🎉 Deployment completed! Your site should now be live."
            echo "📋 Post-deployment tasks:"
            echo "1. Configure environment variables in cPanel Node.js app"
            echo "2. Set up your PostgreSQL database"
            echo "3. Run database migrations via SSH or cPanel terminal"
            echo "4. Start your Node.js application in cPanel"
            echo ""
            echo "🔗 Access your site: https://zivahinternational.com"
        else
            echo ""
            echo "❌ FTP upload failed. Please check your configuration."
            echo "📁 Files are ready for manual upload in: ./deploy/"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Files are ready for manual upload in: ./deploy/"
        ;;
esac
