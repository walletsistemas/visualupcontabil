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

for /f "delims=" %%v in ('python -c "import sys; sys.path.insert(0,'backend'); import versao; print(versao.VERSAO)"') do set "VERSAO=%%v"
echo   Versao: %VERSAO%  (de backend\versao.py)
echo [1/5] Bibliotecas...
python -m pip install -r backend\requirements.txt || goto parar
pushd frontend
call npm ci || (popd & goto parar)

popd
echo [2/5] Testes (base temporaria, nada real e tocado)...
python -m pytest tests -q || goto parar
pushd frontend
echo [3/5] Telas...
call npm run build || (popd & goto parar)
popd

echo [4/5] Programa (.exe)...
python -m PyInstaller MeuSistema.spec --noconfirm || goto parar

echo [5/5] Instalador...
"%ISCC%" /DMyAppVersion=%VERSAO% installer\instalador.iss || goto parar

echo.
echo   PRONTO: installer\Output\MeuSistema_Setup.exe
echo   Gerar nao e publicar: instalar nas maquinas do escritorio so com pedido explicito.
pause
exit /b 0

:parar
echo.
echo   Parou com erro (veja a mensagem acima). Nada foi publicado.
pause
exit /b 1
