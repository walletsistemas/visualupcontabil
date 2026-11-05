@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
REM  ABRIR.bat            -> janela própria (como o instalado)
REM  ABRIR.bat navegador  -> as telas no navegador padrão
REM  ABRIR.bat vitrine    -> só as telas, sem Python (http://localhost:5173)
REM  Os dados deste computador ficam numa pasta de teste, separada do uso real.
set "MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_TESTE"

if not exist frontend\node_modules (
  echo Instalando as bibliotecas das telas ^(so na primeira vez^)...
  pushd frontend & call npm install & popd
)

if /i "%~1"=="vitrine" (
  pushd frontend & call npm run dev & popd
  exit /b
)

python -c "import fastapi, uvicorn, webview" 2>nul || (
  echo Instalando as bibliotecas do Python ^(so na primeira vez^)...
  python -m pip install -r backend\requirements.txt
)
echo Montando as telas...
pushd frontend & call npm run build >nul & popd

if /i "%~1"=="navegador" (
  python backend\app.py --navegador
) else (
  python backend\app.py
)
if errorlevel 1 pause
