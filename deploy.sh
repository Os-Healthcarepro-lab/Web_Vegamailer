#!/bin/bash
# Production Deployment Script for Linux/Mac
# This script prepares and deploys the Vegamailer application

set -e

echo "🚀 Vegamailer Production Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Do not run this script as root${NC}"
    exit 1
fi

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
echo ""

# Check PM2
echo -e "${YELLOW}Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 is installed${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci --production
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check environment file
echo -e "${YELLOW}Checking environment configuration...${NC}"
if [ ! -f "apps/api/.env" ]; then
    echo -e "${RED}❌ apps/api/.env not found${NC}"
    echo -e "${YELLOW}Copying from .env.production...${NC}"
    cp apps/api/.env.production apps/api/.env
    echo -e "${YELLOW}⚠️  Please edit apps/api/.env with your settings${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environment file exists${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm run build
if [ ! -d "dist/apps/web" ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Make PocketBase executable
echo -e "${YELLOW}Setting up PocketBase...${NC}"
chmod +x apps/pocketbase/pocketbase
echo -e "${GREEN}✅ PocketBase is executable${NC}"
echo ""

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"
echo ""

# Check environment variables
echo -e "${YELLOW}Checking PocketBase environment variables...${NC}"
if [ -z "$PB_ENCRYPTION_KEY" ]; then
    echo -e "${RED}❌ PB_ENCRYPTION_KEY is not set${NC}"
    echo ""
    echo "Set it with:"
    echo "  export PB_ENCRYPTION_KEY=\"your-32-character-key\""
    echo ""
    echo "Generate a secure key:"
    echo "  openssl rand -hex 16"
    echo ""
    exit 1
fi

if [ ${#PB_ENCRYPTION_KEY} -ne 32 ]; then
    echo -e "${RED}❌ PB_ENCRYPTION_KEY must be exactly 32 characters${NC}"
    echo "Current length: ${#PB_ENCRYPTION_KEY}"
    exit 1
fi

if [ -z "$PB_SUPERUSER_EMAIL" ] || [ -z "$PB_SUPERUSER_PASSWORD" ]; then
    echo -e "${RED}❌ PB_SUPERUSER_EMAIL or PB_SUPERUSER_PASSWORD not set${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables are set${NC}"
echo ""

# Stop existing PM2 processes
echo -e "${YELLOW}Stopping existing services...${NC}"
pm2 stop ecosystem.config.js || true
pm2 delete ecosystem.config.js || true
echo ""

# Start services
echo -e "${YELLOW}Starting services with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Set PM2 to start on boot
echo -e "${YELLOW}Configuring PM2 startup...${NC}"
pm2 startup || echo -e "${YELLOW}⚠️  Run the command above to enable PM2 on boot${NC}"
echo ""

# Show status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Service status:"
pm2 status
echo ""
echo "View logs:"
echo "  pm2 logs"
echo ""
echo "Management commands:"
echo "  pm2 restart all  - Restart services"
echo "  pm2 stop all     - Stop services"
echo "  pm2 delete all   - Remove services"
echo ""
echo "Frontend build: dist/apps/web/"
echo "API: http://localhost:3001"
echo "PocketBase: http://localhost:8090"
echo ""
