@echo off
echo Cleaning build cache...
if exist .next rmdir /s /q .next

echo Building KODI Production Static Export...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Next.js build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Next.js export generated in .\out
echo Packaging desktop app with Tauri...
call npm run tauri build
pause

