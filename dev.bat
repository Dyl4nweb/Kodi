@echo off
echo Cleaning Next.js build cache...
if exist .next rmdir /s /q .next

echo Starting KODI in Development Mode...
call npm run dev
pause

