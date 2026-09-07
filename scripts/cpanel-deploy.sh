#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# cPanel Deployment Script for ZIVAH International Website
# Compatible with cPanel Git Version Control & CloudLinux Node.js Selector
# ==============================================================================

echo "=================================================="
echo "🚀 Starting cPanel Deployment for ZIVAH Website"
echo "📅 Date: $(date -u +"%Y-%m-%d %H:%M:%SZ")"
echo "👤 User: ${USER:-$(whoami)}"
echo "🏠 Home: ${HOME:-/home/$(whoami)}"
echo "=================================================="

# 1. Determine Target Deployment Directory
# Can be overridden by setting CPANEL_DEPLOY_PATH or via .cpanel-target file
DEPLOY_PATH="${CPANEL_DEPLOY_PATH:-}"

if [ -z "$DEPLOY_PATH" ]; then
  if [ -f "$HOME/.cpanel-target" ]; then
    DEPLOY_PATH=$(cat "$HOME/.cpanel-target" | tr -d '[:space:]')
  elif [ -f "./.cpanel-target" ]; then
    DEPLOY_PATH=$(cat "./.cpanel-target" | tr -d '[:space:]')
  else
    # Default cPanel Node.js application directory
    DEPLOY_PATH="$HOME/zivah-app"
  fi
fi

echo "📁 Target Deployment Path: $DEPLOY_PATH"
mkdir -p "$DEPLOY_PATH"

# 2. Setup Node.js & Package Manager Environment
echo "🔍 Checking Node.js environment..."

# Look for CloudLinux Node.js virtual environments or ea-nodejs if node is not found
if ! command -v node &> /dev/null; then
  for venv in "$HOME"/nodevenv/*/*/bin/activate; do
    if [ -f "$venv" ]; then
      echo "⚡ Sourcing cPanel nodevenv: $venv"
      # shellcheck disable=SC1090
      source "$venv"
      break
    fi
  done
fi

# Fallback check in /opt/cpanel/ea-nodejs*
if ! command -v node &> /dev/null; then
  for ea_node in /opt/cpanel/ea-nodejs24/bin /opt/cpanel/ea-nodejs22/bin /opt/cpanel/ea-nodejs20/bin; do
    if [ -d "$ea_node" ]; then
      echo "⚡ Adding to PATH: $ea_node"
      export PATH="$ea_node:$PATH"
      break
    fi
  done
fi

echo "✅ Using Node.js: $(command -v node) ($(node -v))"
echo "✅ Using NPM: $(command -v npm) ($(npm -v))"

# Detect or install pnpm
PKG_MANAGER="npm"
if command -v pnpm &> /dev/null; then
  PKG_MANAGER="pnpm"
elif command -v corepack &> /dev/null; then
  echo "⚡ Enabling corepack pnpm..."
  corepack enable pnpm || true
  if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
  fi
fi

echo "📦 Package Manager: $PKG_MANAGER"

# 3. Install Dependencies
echo "📥 Installing dependencies..."
if [ "$PKG_MANAGER" = "pnpm" ]; then
  pnpm install --frozen-lockfile
else
  npm ci || npm install
fi

# 4. Compile Next.js Application (Standalone Output)
echo "🏗️ Compiling Next.js application (next build --webpack)..."
export NODE_ENV=production
if [ "$PKG_MANAGER" = "pnpm" ]; then
  pnpm build
else
  npm run build
fi

# 5. Sync Build Artifacts to Target Deployment Directory
echo "🚚 Deploying files to $DEPLOY_PATH..."

# Ensure target directories exist
mkdir -p "$DEPLOY_PATH/.next"
mkdir -p "$DEPLOY_PATH/public"
mkdir -p "$DEPLOY_PATH/prisma"

# Copy standalone output
if [ -d ".next/standalone" ]; then
  /bin/cp -rf .next/standalone/* "$DEPLOY_PATH/"
fi

# Copy static assets (mandatory for Next.js standalone mode)
if [ -d ".next/static" ]; then
  mkdir -p "$DEPLOY_PATH/.next/static"
  /bin/cp -rf .next/static/* "$DEPLOY_PATH/.next/static/"
fi

# Copy public directory
if [ -d "public" ]; then
  /bin/cp -rf public/* "$DEPLOY_PATH/public/"
fi

# Copy startup files and configs
/bin/cp -f server.cjs "$DEPLOY_PATH/server.cjs"
/bin/cp -f package.json "$DEPLOY_PATH/package.json"
/bin/cp -f prisma/schema.prisma "$DEPLOY_PATH/prisma/schema.prisma" 2>/dev/null || true

# 6. Trigger Phusion Passenger App Restart
echo "🔄 Triggering Phusion Passenger application reload..."
mkdir -p "$DEPLOY_PATH/tmp"
touch "$DEPLOYPATH/tmp/restart.txt" 2>/dev/null || touch "$DEPLOY_PATH/tmp/restart.txt"

echo "=================================================="
echo "✅ Deployment completed successfully!"
echo "📌 Deployed Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
echo "=================================================="
