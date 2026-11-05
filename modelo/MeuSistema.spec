# -*- mode: python ; coding: utf-8 -*-
# PyInstaller — mesmo formato do SistemaContabilPlus.spec (na raiz do projeto).
# Rode da raiz:  python -m PyInstaller MeuSistema.spec --noconfirm   (o installer\GERAR_INSTALADOR.bat já faz)
from PyInstaller.utils.hooks import collect_submodules

hiddenimports = ['versao']
hiddenimports += collect_submodules('api')
hiddenimports += collect_submodules('servicos')
hiddenimports += collect_submodules('esquemas')
hiddenimports += collect_submodules('janela')
# + os pacotes do motor copiado (no Plus: core, db, parsers, engine)


a = Analysis(
    ['backend\\app.py'],
    pathex=['backend', 'backend\\motor'],
    binaries=[],
    datas=[('frontend/dist', 'telas'), ('assets/logo.ico', '.')],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    # tkinter só serve ao modo navegador (pelo código); PyQt saiu na cirurgia: não leve ~100 MB à toa
    excludes=['tkinter', 'pytest', 'PyQt6', 'PySide6', 'qtpy'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='MeuSistema',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['assets\\logo.ico'],
)
coll = COLLECT(exe, a.binaries, a.datas, strip=False, upx=True, upx_exclude=[], name='MeuSistema')
