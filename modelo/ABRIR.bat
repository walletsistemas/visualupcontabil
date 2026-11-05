@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
REM  ABRIR.bat            -> janela própria (como o instalado)
REM  ABRIR.bat navegador  -> as telas no navegador padrão
REM  ABRIR.bat vitrine    -> telas que recarregam na hora (http://localhost:5173) + Python de teste
REM  Os dados deste computador ficam numa pasta de teste, separada do uso real.
set "MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_TESTE"

if not exist frontend\node_modules (
  echo Instalando as bibliotecas das telas ^(so na primeira vez^)...
  pushd frontend & call npm install & popd
)

if /i "%~1"=="vitrine" (
  REM telas com recarga na hora + o Python de teste (porta 8765, senha "dev") numa janela à parte
  start "Python de teste" python backendpp.py --sem-janela
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
