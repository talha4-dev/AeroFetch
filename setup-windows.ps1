# setup-windows.ps1
Write-Host "========================================"
Write-Host "  AeroFetch -- Windows Setup"
Write-Host "========================================"
Write-Host ""

# Check if Python is installed and functional
$pythonCmd = (Get-Command "python" -ErrorAction SilentlyContinue)
$pyVer = ""
if ($pythonCmd) {
    try {
        $pyVer = (python --version 2>&1)
    } catch {
        $pyVer = ""
    }
}

if (-not $pythonCmd -or $pyVer -like "*Python was not found*" -or $pyVer -eq "") {
    Write-Host "[FAIL] Functional Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/downloads/"
    Write-Host "IMPORTANT: Check 'Add Python to PATH' during installation."
    exit 1
}
Write-Host "[OK] Python found: $pyVer" -ForegroundColor Green

# Ensure directories exist
if (-not (Test-Path "bin")) { New-Item -ItemType Directory -Path "bin" -Force }
if (-not (Test-Path "backend\logs")) { New-Item -ItemType Directory -Path "backend\logs" -Force }

# Setup FFmpeg
$ffmpegLocal = "bin\ffmpeg.exe"
if (-not (Test-Path $ffmpegLocal)) {
    Write-Host "[WAIT] Setting up FFmpeg in project folder..." -ForegroundColor Yellow
    
    # Check if we can find it in Temp first (if previously downloaded)
    $ffTemp = Get-ChildItem -Path $env:TEMP -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($ffTemp) {
        Write-Host "   Found FFmpeg in Temp, relocating to bin/..."
        Copy-Item $ffTemp.FullName $ffmpegLocal -Force
    } else {
        Write-Host "   Downloading FFmpeg..."
        $ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
        $zipPath = "$env:TEMP\ffmpeg.zip"
        $extractPath = "$env:TEMP\ffmpeg_setup"
        
        Invoke-WebRequest -Uri $ffmpegUrl -OutFile $zipPath
        if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        
        $ffDownloaded = Get-ChildItem -Path $extractPath -Filter ffmpeg.exe -Recurse | Select-Object -First 1
        Copy-Item $ffDownloaded.FullName $ffmpegLocal -Force
    }
}
Write-Host "[OK] FFmpeg is ready in the bin/ folder." -ForegroundColor Green

# Create virtual environment
Write-Host ""
Write-Host "Step 1/3: Creating virtual environment..."
if (-not (Test-Path "venv")) {
    python -m venv venv
}
Write-Host "   [OK] venv ready."

# Install Python dependencies
Write-Host ""
Write-Host "Step 2/3: Installing dependencies..."
& ".\venv\Scripts\python.exe" -m pip install --upgrade pip -q
& ".\venv\Scripts\python.exe" -m pip install -r backend/requirements.txt
Write-Host "   [OK] Python dependencies installed."

# Force update yt-dlp
Write-Host "Updating yt-dlp..."
& ".\venv\Scripts\python.exe" -m pip install --upgrade yt-dlp
Write-Host "   [OK] yt-dlp updated."

Write-Host ""
Write-Host "========================================"
Write-Host "  Setup Completed Successfully!"
Write-Host "========================================"
Write-Host "Run .\start-all-windows.bat to launch."
Write-Host ""
