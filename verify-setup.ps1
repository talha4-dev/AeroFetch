# verify-setup.ps1
Write-Host "========================================"
Write-Host "  AeroFetch -- Verification"
Write-Host "========================================"
Write-Host ""

# Check Python
$pythonCmd = (Get-Command "python" -ErrorAction SilentlyContinue)
$pyVer = ""
if ($pythonCmd) {
    try {
        $pyVer = (python --version 2>&1)
    } catch {
        $pyVer = ""
    }
}

if ($pythonCmd -and $pyVer -notlike "*Python was not found*" -and $pyVer -ne "") {
    Write-Host " [OK] Python: $pyVer" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Python: Functional installation NOT FOUND" -ForegroundColor Red
}

# Check FFmpeg (Local)
if (Test-Path "bin\ffmpeg.exe") {
    Write-Host " [OK] FFmpeg: Found in project bin/" -ForegroundColor Green
} else {
    Write-Host " [FAIL] FFmpeg: NOT FOUND in project bin/" -ForegroundColor Red
}

# Check Virtual Env
if (Test-Path "venv\Scripts\python.exe") {
    Write-Host " [OK] Virtual Environment: Found" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Virtual Environment: NOT FOUND" -ForegroundColor Red
}

# Check Backend Deps
if (Test-Path "venv\Lib\site-packages\waitress") {
    Write-Host " [OK] Backend Dependencies: Waitress found" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Backend Dependencies: Missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "To fix [FAIL] items, please run: .\setup-windows.ps1"
Write-Host ""
