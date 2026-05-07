# Health Check Script
# Verifies all services are running properly

Write-Host "🏥 Vegamailer Health Check" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$allHealthy = $true

# Check Frontend (Port 3000)
Write-Host "Checking Frontend (http://localhost:3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is healthy" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend returned status: $($response.StatusCode)" -ForegroundColor Yellow
        $allHealthy = $false
    }
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
    $allHealthy = $false
}
Write-Host ""

# Check API Server (Port 3001)
Write-Host "Checking API Server (http://localhost:3001)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ API Server is healthy" -ForegroundColor Green
} catch {
    Write-Host "❌ API Server is not responding" -ForegroundColor Red
    $allHealthy = $false
}
Write-Host ""

# Check PocketBase (Port 8090)
Write-Host "Checking PocketBase (http://localhost:8090/api/health)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/health" -Method HEAD -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PocketBase is healthy" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PocketBase returned status: $($response.StatusCode)" -ForegroundColor Yellow
        $allHealthy = $false
    }
} catch {
    Write-Host "❌ PocketBase is not responding" -ForegroundColor Red
    $allHealthy = $false
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if ($allHealthy) {
    Write-Host "✅ All services are healthy!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some services are not responding" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure you've started the development server:" -ForegroundColor Cyan
    Write-Host "  .\dev.ps1" -ForegroundColor White
}
Write-Host ""
