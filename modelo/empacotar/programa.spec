# -*- mode: python ; coding: utf-8 -*-
# PyInstaller: junta Python + bibliotecas + telas compiladas numa pasta com o .exe.
# Rode da pasta `modelo/`:  python -m PyInstaller empacotar\programa.spec --noconfirm
from PyInstaller.utils.hooks import collect_submodules

hiddenimports = []
for pacote in ("api", "servicos", "janela", "motor"):
    hiddenimports += collect_submodules(pacote)

a = Analysis(
    ["..\\backend\\app.py"],
    pathex=["..\\backend", "..\\backend\\motor"],
    datas=[("..\\frontend\\dist", "telas")],   # as telas React vão junto, em _internal\telas
    hiddenimports=hiddenimports,
    excludes=["pytest", "PyQt6", "PySide6", "qtpy"],   # o Qt saiu na cirurgia: não leve 100 MB à toa
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="MeuSistema",
    console=False,          # sem janela preta
    upx=True,
    # icon=["..\\assets\\logo.ico"],
)
coll = COLLECT(exe, a.binaries, a.datas, upx=True, name="MeuSistema")
