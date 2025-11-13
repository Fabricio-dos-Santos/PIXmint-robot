param(
    [string]$ApiUrl = 'http://localhost:3000'
)

# Resolve repository root (one level up from scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

Write-Host "Repository root: $repoRoot"

# Start backend in a new PowerShell window
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -Path '$repoRoot'; npm run dev"
)

Start-Sleep -Milliseconds 500

# Start frontend in a new PowerShell window with VITE_API_BASE_URL set
Write-Host "Starting frontend (VITE_API_BASE_URL=$ApiUrl)..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -Path \"$repoRoot\\frontend\"; `$env:VITE_API_BASE_URL='$ApiUrl'; npm run dev"
)

Write-Host "Launched backend and frontend in separate PowerShell windows."
