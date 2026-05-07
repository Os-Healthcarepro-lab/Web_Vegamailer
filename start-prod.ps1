# Vegamailer Production Server Startup Script
# This script sets up the required environment variables and starts production services with PM2

Write-Host "🚀 Starting Vegamailer Production Server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path "apps\api\.env")) {
    Write-Host "❌ Error: apps\api\.env file not found!" -ForegroundColor Red
    Write-Host "Please copy apps\api\.env.example to apps\api\.env and configure it." -ForegroundColor Yellow
    exit 1
}

# Prompt for production encryption key if not set
if (-not $env:PB_ENCRYPTION_KEY) {
    Write-Host "⚠️  PB_ENCRYPTION_KEY not set in environment" -ForegroundColor Yellow
    Write-Host "Please enter your production encryption key (32 characters):" -ForegroundColor Cyan
    $env:PB_ENCRYPTION_KEY = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText
    
    if ($env:PB_ENCRYPTION_KEY.Length -ne 32) {
        Write-Host "❌ Error: Encryption key must be exactly 32 characters!" -ForegroundColor Red
        exit 1
    }
}

# Prompt for superuser email if not set
if (-not $env:PB_SUPERUSER_EMAIL) {
    Write-Host "Please enter PocketBase superuser email:" -ForegroundColor Cyan
    $env:PB_SUPERUSER_EMAIL = Read-Host
}

# Prompt for superuser password if not set
if (-not $env:PB_SUPERUSER_PASSWORD) {
    Write-Host "Please enter PocketBase superuser password:" -ForegroundColor Cyan
    $env:PB_SUPERUSER_PASSWORD = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText
}

Write-Host ""
Write-Host "✅ Environment configured" -ForegroundColor Green
Write-Host ""

# Check if PM2 is installed
$pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2Installed) {
    Write-Host "❌ PM2 is not installed!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g pm2" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting PM2 services..." -ForegroundColor Cyan
npm run start:pm2

Write-Host ""
Write-Host "✅ Services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "View logs with: npm run logs:pm2" -ForegroundColor Yellow
Write-Host "Stop services with: npm run stop:pm2" -ForegroundColor Yellow
Write-Host "Restart services with: npm run restart:pm2" -ForegroundColor Yellow
