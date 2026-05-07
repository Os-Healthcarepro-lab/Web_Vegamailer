# Pre-Deployment Test Script
# Tests the production build before deployment

Write-Host "🧪 Running Pre-Deployment Tests..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$errors = 0

# Test 1: Check Node.js version
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
$expectedVersion = Get-Content .nvmrc
if ($nodeVersion -like "*$expectedVersion*") {
    Write-Host "   ✅ Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Expected v$expectedVersion, got $nodeVersion" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check dependencies
Write-Host "2. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Dependencies not installed. Run: npm install" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Test 3: Check environment files
Write-Host "3. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path "apps\api\.env.production") {
    Write-Host "   ✅ Production .env template exists" -ForegroundColor Green
    
    # Check if production settings are configured
    $envContent = Get-Content "apps\api\.env.production" -Raw
    if ($envContent -like "*yourdomain.com*") {
        Write-Host "   ⚠️  Warning: .env.production still has placeholder values" -ForegroundColor Yellow
        Write-Host "      Update CORS_ORIGIN and WEBSITE_DOMAIN before deployment" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Production .env template not found" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Test 4: Run linter
Write-Host "4. Running linter..." -ForegroundColor Yellow
try {
    $lintOutput = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Linter passed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Linter found issues" -ForegroundColor Yellow
        Write-Host "      Fix them with: npm run lint" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Linter failed to run" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Test 5: Check PocketBase executable
Write-Host "5. Checking PocketBase..." -ForegroundColor Yellow
if (Test-Path "apps\pocketbase\pocketbase.exe") {
    $pbSize = (Get-Item "apps\pocketbase\pocketbase.exe").Length / 1MB
    Write-Host "   ✅ PocketBase executable found ($($pbSize.ToString('F2')) MB)" -ForegroundColor Green
} else {
    Write-Host "   ❌ PocketBase executable not found" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Test 6: Build frontend
Write-Host "6. Building frontend..." -ForegroundColor Yellow
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        if (Test-Path "dist\apps\web") {
            $buildFiles = (Get-ChildItem "dist\apps\web" -Recurse -File).Count
            Write-Host "   ✅ Frontend built successfully ($buildFiles files)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Build succeeded but output directory not found" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "   ❌ Build failed" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Gray
        $errors++
    }
} catch {
    Write-Host "   ❌ Build process failed" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Test 7: Check for sensitive data
Write-Host "7. Checking for sensitive data in code..." -ForegroundColor Yellow
$sensitivePatterns = @(
    "console.log",
    "debugger;",
    "TODO:",
    "FIXME:"
)
$foundIssues = 0
foreach ($pattern in $sensitivePatterns) {
    $matches = Select-String -Path "apps\web\src\**\*.jsx","apps\web\src\**\*.js","apps\api\src\**\*.js" -Pattern $pattern -ErrorAction SilentlyContinue
    if ($matches) {
        $foundIssues += $matches.Count
    }
}
if ($foundIssues -eq 0) {
    Write-Host "   ✅ No obvious issues found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Found $foundIssues potential issues (console.log, debugger, etc.)" -ForegroundColor Yellow
    Write-Host "      Review and clean up before production" -ForegroundColor Gray
}
Write-Host ""

# Test 8: Security audit
Write-Host "8. Running security audit..." -ForegroundColor Yellow
try {
    $auditOutput = npm audit --audit-level=high 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ No high-severity vulnerabilities" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Security vulnerabilities found" -ForegroundColor Yellow
        Write-Host "      Run: npm audit fix" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Could not run security audit" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if ($errors -eq 0) {
    Write-Host "✅ Pre-Deployment Tests Passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Review DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
    Write-Host "  2. Update apps/api/.env.production with your settings" -ForegroundColor White
    Write-Host "  3. Generate secure encryption key" -ForegroundColor White
    Write-Host "  4. Deploy to your server" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Pre-Deployment Tests Failed ($errors errors)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Fix the errors above before deploying." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
