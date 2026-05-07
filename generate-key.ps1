# Generate Secure Encryption Key
# Creates a cryptographically secure 32-character key for PocketBase

Write-Host "🔐 Secure Encryption Key Generator" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Generate random 32-character key
$key = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "Your secure encryption key (32 characters):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  $key" -ForegroundColor Green
Write-Host ""

# Save to file option
$save = Read-Host "Save to file? (yes/no)"
if ($save -eq "yes") {
    $filename = "encryption-key-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').txt"
    $key | Out-File -FilePath $filename -NoNewline
    Write-Host ""
    Write-Host "✅ Saved to: $filename" -ForegroundColor Green
    Write-Host "⚠️  Keep this file secure and delete it after use!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "💡 Usage:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Windows PowerShell:" -ForegroundColor Yellow
Write-Host "  `$env:PB_ENCRYPTION_KEY = `"$key`"" -ForegroundColor White
Write-Host ""
Write-Host "Linux/Mac Bash:" -ForegroundColor Yellow
Write-Host "  export PB_ENCRYPTION_KEY=`"$key`"" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important:" -ForegroundColor Yellow
Write-Host "  • This key encrypts your PocketBase database" -ForegroundColor Gray
Write-Host "  • Store it securely (password manager, environment variable)" -ForegroundColor Gray
Write-Host "  • Never commit it to version control" -ForegroundColor Gray
Write-Host "  • Losing this key means losing access to your database" -ForegroundColor Gray
Write-Host "  • Use different keys for dev/staging/production" -ForegroundColor Gray
Write-Host ""
