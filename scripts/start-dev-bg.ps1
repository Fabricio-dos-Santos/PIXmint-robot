param(
    [string]$ApiUrl = 'http://localhost:3000'
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$logsDir = Join-Path $repoRoot 'logs'

if (-Not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

$backendLog = Join-Path $logsDir 'backend.log'
$frontendLog = Join-Path $logsDir 'frontend.log'

# clean old logs
Remove-Item -Path $backendLog -ErrorAction SilentlyContinue
Remove-Item -Path $frontendLog -ErrorAction SilentlyContinue

# ensure logs exist to allow Get-Content to open them
New-Item -Path $backendLog -ItemType File -Force | Out-Null
New-Item -Path $frontendLog -ItemType File -Force | Out-Null

Write-Host "Starting backend as a background job (output -> $backendLog)"
$backendJob = Start-Job -Name pixmint-backend -ScriptBlock {
    param($root, $log)
    Set-Location -Path $root
    # Redirect stdout+stderr to log file
    npm run dev *> $log
} -ArgumentList $repoRoot, $backendLog

Start-Sleep -Milliseconds 300

Write-Host "Starting frontend as a background job (output -> $frontendLog)"
$frontendJob = Start-Job -Name pixmint-frontend -ScriptBlock {
    param($root, $log, $api)
    Set-Location -Path (Join-Path $root 'frontend')
    # Ensure env var is set for this process
    $env:VITE_API_BASE_URL = $api
    npm run dev *> $log
} -ArgumentList $repoRoot, $frontendLog, $ApiUrl

Write-Host "Both jobs started. Streaming logs (press Ctrl+C to stop)..."

# Tail both logs in same stream
# Get-Content supports multiple paths; it will stream appended lines as they appear
Get-Content -Path $backendLog, $frontendLog -Wait -Tail 10 | ForEach-Object {
    # prefix lines with file origin for clarity
    $line = $_
    if ($line -ne '') {
        # Attempt to detect which file produced the line is not available directly from Get-Content output,
        # so prefix with a generic marker and let the logs include their own identifiers if needed.
        Write-Host $line
    }
}

# Note: jobs keep running in background after this script exits; to stop them use:
# Get-Job -Name pixmint-backend,pixmint-frontend | Stop-Job
