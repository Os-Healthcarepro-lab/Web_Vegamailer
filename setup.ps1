# Vegamailer Project Setup Script
# This script helps you set up the project for the first time

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║          🚀 Vegamailer Project Setup Wizard 🚀          ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan
Write-Host ""

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js v20.19.1 or higher from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version 2>$null
Write-Host "✅ npm version: v$npmVersion" -ForegroundColor Green

# Check Git
$gitVersion = git --version 2>$null
if ($gitVersion) {
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git is not installed (optional)" -ForegroundColor Yellow
}

Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Set up environment files
Write-Host "⚙️  Step 2: Setting up environment configuration..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "apps\api\.env")) {
    Write-Host "Creating apps\api\.env from template..." -ForegroundColor Yellow
    Copy-Item "apps\api\.env.example" "apps\api\.env"
    Write-Host "✅ Created apps\api\.env" -ForegroundColor Green
} else {
    Write-Host "✅ apps\api\.env already exists" -ForegroundColor Green
}

Write-Host ""

# Step 3: Configuration
Write-Host "🔧 Step 3: Optional Configuration" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can configure the following later:" -ForegroundColor Gray
Write-Host "  • Email service API keys (Plunk/Resend) in apps\api\.env" -ForegroundColor Gray
Write-Host "  • Production encryption key for PocketBase" -ForegroundColor Gray
Write-Host "  • Custom domain settings" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║              ✅ Setup Complete! ✅                       ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 You're ready to start developing!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "   .\dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or manually:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see README.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default login credentials:" -ForegroundColor Magenta
Write-Host "  Email: admin@vegamailer.local" -ForegroundColor Gray
Write-Host "  Password: admin123456" -ForegroundColor Gray
Write-Host ""
