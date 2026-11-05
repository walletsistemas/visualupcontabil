@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."
title Meu Sistema - janela

REM  ===================================================================
REM   Mesmo formato do scripts\ABRIR_NA_JANELA.bat do Plus.
REM   ABRE O SISTEMA NA JANELA PROPRIA DO WINDOWS, como o instalado.
REM
REM   ABRIR_NA_JANELA.bat ficticia  -> base de TESTE (pasta propria). A base real nao e tocada.
REM   ABRIR_NA_JANELA.bat oficial   -> base oficial (so com certeza!)
REM   Sem argumento (duplo clique): pergunta 1 = ficticia ou 2 = oficial.
REM  ===================================================================

set "MODO=%~1"
if defined MODO set "MODO=%MODO: =%"
if not defined MODO (
  echo   1 - Base FICTICIA ^(teste^)
  echo   2 - Base OFICIAL
  choice /c 12 /n /m "Qual base abrir? [1/2] "
  if errorlevel 2 (set "MODO=oficial") else set "MODO=ficticia"
)
if /i "%MODO%"=="ficticia" (
  call :ficticia || goto erro
) else if /i not "%MODO%"=="oficial" (
  echo Uso: ABRIR_NA_JANELA.bat ficticia  ^|  ABRIR_NA_JANELA.bat oficial
  pause
  exit /b 1
)

call :preparar || goto erro
echo Abrindo o sistema...
set "PEDIDO="
if /i "%MODO%"=="oficial" set "PEDIDO=--oficial"
python backend\app.py %PEDIDO%
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
