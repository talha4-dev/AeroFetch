@echo off
setlocal
echo ========================================
echo   AeroFetch FORCE RESET
echo ========================================
echo.

echo Terminating orphaned backend processes...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
echo   [OK] Cleaned active processes.

echo.
echo Purging caches...
if exist "backend\__pycache__" (
    rmdir /s /q "backend\__pycache__"
)
if exist "frontend\node_modules\.vite" (
    rmdir /s /q "frontend\node_modules\.vite"
)
echo   [OK] Caches purged.

echo.
echo Launching Fresh AeroFetch Instance...
start cmd /k "echo AeroFetch Backend... && .\venv\Scripts\python.exe backend/run_windows.py"
start cmd /k "echo AeroFetch Frontend... && cd frontend && npm run dev"

echo.
echo ========================================
echo   RESET COMPLETE! 
echo ========================================
echo Check your browser for the new AeroFetch tab.
pause
