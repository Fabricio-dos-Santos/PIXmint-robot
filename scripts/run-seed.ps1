# Script to safely run database seed
# Stops Node processes and PowerShell jobs before seeding

Write-Host "Preparing to run database seed..." -ForegroundColor Cyan

# Get current PowerShell process ID to avoid killing self
$currentPID = $PID

# Stop Node.js processes (except this script's child processes)
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $currentPID }
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Gray
}

# Stop all PowerShell background jobs
Write-Host "Stopping PowerShell jobs..." -ForegroundColor Yellow
$jobs = Get-Job -ErrorAction SilentlyContinue
if ($jobs) {
    $jobs | Stop-Job -ErrorAction SilentlyContinue
    $jobs | Remove-Job -ErrorAction SilentlyContinue
    Write-Host "Stopped and removed $($jobs.Count) job(s)" -ForegroundColor Green
} else {
    Write-Host "No active jobs found" -ForegroundColor Gray
}

# Wait for processes to fully release file locks
Write-Host "Waiting for file locks to release..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Run the seed
Write-Host "`nRunning database seed..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

try {
    # Execute prisma generate
    Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    
    if ($LASTEXITCODE -ne 0) {
        throw "Prisma generate failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "`nExecuting seed script..." -ForegroundColor Yellow
    npx ts-node prisma/seed.ts
    
    if ($LASTEXITCODE -ne 0) {
        throw "Seed execution failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host "Seed completed successfully!" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
