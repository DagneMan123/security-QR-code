Write-Host "Cleaning up old dependencies..." -ForegroundColor Yellow

# Remove node_modules
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}

# Remove package-lock.json
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Run 'npm install'" -ForegroundColor Cyan
