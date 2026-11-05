@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."
title Meu Sistema - navegador

REM  ===================================================================
REM   Mesmo formato do scripts\ABRIR_NO_NAVEGADOR.bat do Plus.
REM   ABRE O SISTEMA NO NAVEGADOR PADRAO, funcionando como o instalado.
REM   Para fechar o sistema, feche esta janela preta.
REM
REM   ABRIR_NO_NAVEGADOR.bat ficticia -> base de TESTE (pasta propria)
REM   ABRIR_NO_NAVEGADOR.bat oficial  -> base oficial (so com certeza!)
REM   ABRIR_NO_NAVEGADOR.bat teste    -> para a IA testar as telas: base de teste, porta fixa
REM                                      8765 e senha interna "dev", sem abrir o navegador
REM   ABRIR_NO_NAVEGADOR.bat telas    -> as telas no Vite (http://localhost:5173), recarregando
REM                                      ao salvar o codigo, + o Python de teste numa janela a parte
REM  ===================================================================

set "MODO=%~1"
if defined MODO set "MODO=%MODO: =%"
if not defined MODO (
  echo   1 - Base FICTICIA ^(teste^)
  echo   2 - Base OFICIAL
  choice /c 12 /n /m "Qual base abrir? [1/2] "
  if errorlevel 2 (set "MODO=oficial") else set "MODO=ficticia"
)
if /i "%MODO%"=="teste" (
  call :ficticia || goto erro
  call :preparar || goto erro
  python -u backend\app.py --sem-janela
  exit /b
)
if /i "%MODO%"=="telas" (
  call :ficticia || goto erro
  call :preparar || goto erro
  start "Python de teste" python -u backend\app.py --sem-janela
  pushd frontend & call npm run dev & popd
  exit /b
)
if /i "%MODO%"=="ficticia" (
  call :ficticia || goto erro
) else if /i not "%MODO%"=="oficial" (
  echo Uso: ABRIR_NO_NAVEGADOR.bat ficticia ^| oficial ^| teste ^| telas
  pause
  exit /b 1
)

call :preparar || goto erro
set "PEDIDO="
if /i "%MODO%"=="oficial" set "PEDIDO=--oficial"
python backend\app.py --navegador %PEDIDO%
if errorlevel 1 goto erro
exit /b 0

:ficticia
title Meu Sistema - BASE FICTICIA
set "MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_FICTICIO"
if not exist "%MEU_SISTEMA_DADOS%" mkdir "%MEU_SISTEMA_DADOS%"
REM  Aponte aqui o MOTOR para a copia de teste dos dados (no Plus: banco.definir_servidor_path
REM  com a pasta Desktop\BANCO FICTICIO). Nunca a base oficial.
echo   BASE FICTICIA: %MEU_SISTEMA_DADOS%
exit /b 0

:preparar
python --version >nul 2>&1 || (echo [ERRO] Python nao encontrado. Instale em https://www.python.org/downloads/ & exit /b 1)
node --version >nul 2>&1 || (echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org/ & exit /b 1)
python -c "import webview, fastapi, uvicorn" >nul 2>&1
if errorlevel 1 (
  echo Primeira vez: instalando as bibliotecas do Python...
  python -m pip install -r backend\requirements.txt || exit /b 1
)
if not exist frontend\node_modules (
  echo Primeira vez: instalando as bibliotecas das telas...
  pushd frontend & call npm install & popd
)
echo Montando as telas...
pushd frontend
call npm run build >nul || (popd & echo [ERRO] As telas nao foram montadas. & exit /b 1)
popd
exit /b 0

:erro
echo.
echo   Algo deu errado (veja a mensagem acima).
pause
exit /b 1
