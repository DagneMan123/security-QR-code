@echo off
echo Cleaning up old dependencies...
rmdir /s /q node_modules
del package-lock.json
echo Cleaned!
echo.
echo Now run: npm install
pause
