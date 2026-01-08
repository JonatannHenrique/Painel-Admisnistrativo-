@echo off
echo.
echo 🍕 Painel Administrativo - Pizzaria
echo ====================================
echo.

REM Verifica se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Instale em https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
echo.

REM Instala dependências se não existirem
if not exist node_modules (
    echo 📦 Instalando dependências...
    call npm install
    echo.
)

REM Inicia o servidor
echo 🚀 Iniciando servidor...
echo.
echo 📱 Acesse em: http://localhost:3000
echo 🔗 API: https://localhost:7020
echo.
echo Pressione CTRL+C para parar o servidor
echo.

node server.js
