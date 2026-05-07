# PocketBase Backup Script
# Creates a backup of the PocketBase database

param(
    [string]$BackupPath = ".\backups",
    [switch]$Compress = $false
)

Write-Host "💾 PocketBase Backup Utility" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupPath)) {
    Write-Host "Creating backup directory: $BackupPath" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
}

# Generate timestamp for backup filename
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "pocketbase_backup_$timestamp"

# Check if PocketBase data exists
$pbDataPath = "apps\pocketbase\pb_data"
if (-not (Test-Path $pbDataPath)) {
    Write-Host "❌ Error: PocketBase data directory not found at $pbDataPath" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Source: $pbDataPath" -ForegroundColor Gray
Write-Host "📂 Destination: $BackupPath\$backupName" -ForegroundColor Gray
Write-Host ""

# Create backup
try {
    if ($Compress) {
        # Create compressed archive
        Write-Host "🗜️  Creating compressed backup..." -ForegroundColor Yellow
        $zipPath = Join-Path $BackupPath "$backupName.zip"
        
        Compress-Archive -Path $pbDataPath\* -DestinationPath $zipPath -Force
        
        $size = (Get-Item $zipPath).Length / 1MB
        Write-Host "✅ Backup created: $backupName.zip ($($size.ToString('F2')) MB)" -ForegroundColor Green
    } else {
        # Create folder copy
        Write-Host "📋 Creating backup..." -ForegroundColor Yellow
        $backupFullPath = Join-Path $BackupPath $backupName
        
        Copy-Item -Path $pbDataPath -Destination $backupFullPath -Recurse -Force
        
        $size = (Get-ChildItem $backupFullPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "✅ Backup created: $backupName ($($size.ToString('F2')) MB)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "💡 Backup Tips:" -ForegroundColor Cyan
    Write-Host "  • Store backups in a secure location" -ForegroundColor Gray
    Write-Host "  • Test restore procedure regularly" -ForegroundColor Gray
    Write-Host "  • Keep multiple backup versions" -ForegroundColor Gray
    Write-Host "  • Automate backups for production" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Show backup location
Write-Host "📍 Backup location:" -ForegroundColor Cyan
Write-Host "   $BackupPath" -ForegroundColor White
Write-Host ""

# List recent backups
Write-Host "📊 Recent backups:" -ForegroundColor Cyan
Get-ChildItem $BackupPath -Directory | 
    Where-Object { $_.Name -like "pocketbase_backup_*" } |
    Sort-Object CreationTime -Descending |
    Select-Object -First 5 |
    ForEach-Object {
        $age = (Get-Date) - $_.CreationTime
        $ageStr = if ($age.Days -gt 0) { "$($age.Days)d ago" } 
                  elseif ($age.Hours -gt 0) { "$($age.Hours)h ago" }
                  else { "$($age.Minutes)m ago" }
        Write-Host "   • $($_.Name) - $ageStr" -ForegroundColor Gray
    }

Get-ChildItem $BackupPath -File -Filter "*.zip" |
    Where-Object { $_.Name -like "pocketbase_backup_*.zip" } |
    Sort-Object CreationTime -Descending |
    Select-Object -First 5 |
    ForEach-Object {
        $age = (Get-Date) - $_.CreationTime
        $ageStr = if ($age.Days -gt 0) { "$($age.Days)d ago" } 
                  elseif ($age.Hours -gt 0) { "$($age.Hours)h ago" }
                  else { "$($age.Minutes)m ago" }
        Write-Host "   • $($_.Name) - $ageStr" -ForegroundColor Gray
    }

Write-Host ""
Write-Host "✅ Backup complete!" -ForegroundColor Green
Write-Host ""
