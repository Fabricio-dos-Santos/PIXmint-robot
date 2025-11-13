param(
    [string]$ApiUrl = 'http://localhost:3000'
)

# Resolve repository root (one level up from scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

Write-Host "Repository root: $repoRoot"

# Start backend in a new PowerShell window
Write-Host "Starting backend..."
$backendCmd = "Set-Location -Path '$repoRoot'; npm run dev"
$backendEncoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($backendCmd))
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-EncodedCommand",
    $backendEncoded
)

Start-Sleep -Milliseconds 500

# Start frontend in a new PowerShell window with VITE_API_BASE_URL set
Write-Host "Starting frontend (VITE_API_BASE_URL=$ApiUrl)..."
$frontendCmd = "Set-Location -Path '$repoRoot\\frontend'; `$env:VITE_API_BASE_URL='$ApiUrl'; npm run dev"
$frontendEncoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($frontendCmd))
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-EncodedCommand",
    $frontendEncoded
)

Write-Host "Launched backend and frontend in separate PowerShell windows."

# Print clickable links (OSC 8) and fallback URLs
$esc = [char]27
function Write-Hyperlink([string]$url, [string]$text = $null) {
    if (-not $text) { $text = $url }
    $link = $esc + ']8;;' + $url + $esc + '\' + $text + $esc + ']8;;' + $esc + '\'
    Write-Host $link
    Write-Host "(link: $url)"
}

$frontendUrl = 'http://localhost:5173'
$backendUrl = 'http://localhost:3000'

Write-Host "Application URLs:"
Write-Host "Frontend: " -NoNewline; Write-Hyperlink $frontendUrl 'Open Frontend'
Write-Host "Backend API: " -NoNewline; Write-Hyperlink $backendUrl 'Open API'
