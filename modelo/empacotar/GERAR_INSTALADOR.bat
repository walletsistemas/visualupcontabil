@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."
title Gerar instalador

echo ==========================================================
echo   GERAR O INSTALADOR (programa + Python + telas, tudo junto)
echo   Leva de 3 a 10 minutos.
echo ==========================================================

python --version >nul 2>&1 || (echo [ERRO] Python nao encontrado: https://www.python.org/downloads/ & goto parar)
node --version >nul 2>&1 || (echo [ERRO] Node.js nao encontrado: https://nodejs.org/ & goto parar)
set "ISCC="
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set "ISCC=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" set "ISCC=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if exist "%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe" set "ISCC=%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"
if not defined ISCC (echo [ERRO] Inno Setup 6 nao encontrado: winget install JRSoftware.InnoSetup & goto parar)

echo [1/4] Bibliotecas...
python -m pip install -r backend\requirements.txt || goto parar
pushd frontend
call npm ci || (popd & goto parar)

echo [2/4] Telas...
call npm run build || (popd & goto parar)
popd

echo [3/4] Programa (.exe)...
python -m PyInstaller empacotar\programa.spec --noconfirm --distpath dist --workpath build || goto parar

echo [4/4] Instalador...
"%ISCC%" empacotar\instalador.iss || goto parar

echo.
echo   PRONTO: empacotar\Output\MeuSistema_Setup.exe
pause
exit /b 0

:parar
echo.
echo   Parou com erro (veja a mensagem acima). Nada foi publicado.
pause
exit /b 1
