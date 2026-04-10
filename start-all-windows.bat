@echo off
:: start-all-windows.bat
:: AeroFetch — Full Stack Startup for Windows

echo ========================================
echo   ⚡ AeroFetch Windows Launcher
echo ========================================
echo.

:: Check for virtual environment
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment 'venv' not found.
    echo Please run setup-windows.ps1 first.
    pause
    exit /b
)

:: Start backend in a new window
echo [✓] Starting Backend (Waitress/Flask)...
start "AeroFetch Backend" cmd /k "call venv\Scripts\activate && python backend\run_windows.py"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo [✓] Starting Frontend (Vite/React)...
cd frontend
start "AeroFetch Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   ✅ Both servers are starting!
echo   --------------------------------------
echo   Backend  : http://localhost:5000
echo   Frontend : http://localhost:5173
echo ========================================
echo.
echo You can close this launcher. The servers will keep running in their own windows.
echo.
pause
