@echo off
echo ========================================
echo  Instalador - Sistema de Productos
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
node --version
echo Node.js detectado!
echo.

echo [2/4] Instalando dependencias del Backend...
cd backend
if not exist "node_modules" (
    echo Instalando paquetes...
    call npm install
    if errorlevel 1 (
        echo ERROR: Fallo la instalacion del backend
        pause
        exit /b 1
    )
    echo Backend instalado correctamente!
) else (
    echo Backend ya esta instalado
)
cd ..
echo.

echo [3/4] Instalando dependencias del Frontend...
cd frontend
if not exist "node_modules" (
    echo Instalando paquetes...
    call npm install
    if errorlevel 1 (
        echo ERROR: Fallo la instalacion del frontend
        pause
        exit /b 1
    )
    echo Frontend instalado correctamente!
) else (
    echo Frontend ya esta instalado
)
cd ..
echo.

echo [4/4] Verificando archivos de configuracion...
if exist "backend\.env" (
    echo ✓ backend\.env encontrado
) else (
    echo ! backend\.env no encontrado - usando .env.example
    copy "backend\.env.example" "backend\.env" >nul
)

if exist "frontend\.env" (
    echo ✓ frontend\.env encontrado
) else (
    echo ! frontend\.env no encontrado - usando .env.example
    copy "frontend\.env.example" "frontend\.env" >nul
)
echo.

echo ========================================
echo  INSTALACION COMPLETADA!
echo ========================================
echo.
echo IMPORTANTE: MongoDB Local
echo 1. Asegurate de tener MongoDB instalado localmente
echo 2. El servicio de MongoDB debe estar corriendo
echo 3. La URI por defecto es: mongodb://127.0.0.1:27017/productosDB
echo.
echo Para verificar MongoDB:
echo   - Abre 'services.msc' y busca 'MongoDB Server'
echo   - O ejecuta: mongosh --eval "db.version()"
echo.
echo Para iniciar la aplicacion ejecuta:
echo   - iniciar.bat (Windows)
echo.
pause
