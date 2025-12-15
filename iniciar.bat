@echo off
echo ========================================
echo  Sistema de Gestion de Productos
echo  Lorebel
echo ========================================
echo.
echo Iniciando Backend y Frontend...
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener ambos servidores
echo.

start "Backend - Puerto 3001" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend - Puerto 3000" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados en ventanas separadas
echo Cierra esta ventana para detener todo
echo.
pause
