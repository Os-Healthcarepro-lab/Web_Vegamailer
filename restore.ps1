# PocketBase Restore Script
# Restores a PocketBase database backup

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupPath
)

Write-Host "♻️  PocketBase Restore Utility" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Verify backup exists
if (-not (Test-Path $BackupPath)) {
    Write-Host "❌ Error: Backup not found at $BackupPath" -ForegroundColor Red
    exit 1
}

$pbDataPath = "apps\pocketbase\pb_data"

Write-Host "⚠️  WARNING: This will replace the current database!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Current data: $pbDataPath" -ForegroundColor Gray
Write-Host "Restore from: $BackupPath" -ForegroundColor Gray
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "❌ Restore cancelled" -ForegroundColor Yellow
    exit 0
}

# Create backup of current state
Write-Host ""
Write-Host "📦 Creating safety backup of current state..." -ForegroundColor Yellow
$safetyBackup = ".\backups\pre_restore_backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
if (-not (Test-Path ".\backups")) {
    New-Item -ItemType Directory -Path ".\backups" -Force | Out-Null
}
Copy-Item -Path $pbDataPath -Destination $safetyBackup -Recurse -Force
Write-Host "✅ Safety backup created at: $safetyBackup" -ForegroundColor Green
Write-Host ""

# Remove current data
Write-Host "🗑️  Removing current database..." -ForegroundColor Yellow
Remove-Item -Path $pbDataPath -Recurse -Force

# Restore backup
try {
    Write-Host "📋 Restoring backup..." -ForegroundColor Yellow
    
    # Check if backup is a zip file
    if ($BackupPath -like "*.zip") {
        Expand-Archive -Path $BackupPath -DestinationPath $pbDataPath -Force
    } else {
        Copy-Item -Path $BackupPath\* -Destination $pbDataPath -Recurse -Force
    }
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "✅ Restore completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart your PocketBase server" -ForegroundColor Gray
    Write-Host "  2. Verify data integrity" -ForegroundColor Gray
    Write-Host "  3. Test application functionality" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Safety backup saved at:" -ForegroundColor Cyan
    Write-Host "  $safetyBackup" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Restore failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Restoring from safety backup..." -ForegroundColor Yellow
    
    Remove-Item -Path $pbDataPath -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path $safetyBackup\* -Destination $pbDataPath -Recurse -Force
    
    Write-Host "✅ Reverted to previous state" -ForegroundColor Green
    exit 1
}
