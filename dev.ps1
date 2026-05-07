# Vegamailer Development Server Startup Script
# This script sets up the required environment variables and starts all services

Write-Host "🚀 Starting Vegamailer Development Server..." -ForegroundColor Cyan
Write-Host ""

# Set PocketBase encryption key (must be exactly 32 characters)
$env:PB_ENCRYPTION_KEY = "12345678901234567890123456789012"

# Set PocketBase admin credentials
$env:PB_SUPERUSER_EMAIL = "admin@vegamailer.local"
$env:PB_SUPERUSER_PASSWORD = "admin123456"

Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   - PB_ENCRYPTION_KEY: ****" -ForegroundColor Gray
Write-Host "   - PB_SUPERUSER_EMAIL: $env:PB_SUPERUSER_EMAIL" -ForegroundColor Gray
Write-Host "   - PB_SUPERUSER_PASSWORD: ****" -ForegroundColor Gray
Write-Host ""

Write-Host "📦 Starting services..." -ForegroundColor Cyan
Write-Host "   - Frontend (Vite): http://localhost:3000" -ForegroundColor Yellow
Write-Host "   - API Server: http://localhost:3001" -ForegroundColor Yellow
Write-Host "   - PocketBase Admin: http://localhost:8090/_/" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔐 Default Admin Login:" -ForegroundColor Magenta
Write-Host "   Email: admin@vegamailer.local" -ForegroundColor Gray
Write-Host "   Password: admin123456" -ForegroundColor Gray
Write-Host ""

Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
