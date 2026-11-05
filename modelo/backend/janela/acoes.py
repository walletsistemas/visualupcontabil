"""O que o sistema faz no Windows a pedido das telas: abrir o Explorador, abrir um arquivo,
abrir um link. Serve à janela (`ponte.py`) e ao modo navegador (`api/janela.py`).

No modo navegador também ficam aqui as janelas «Escolher pasta» e «Salvar como» do Windows,
que na janela própria vêm do pywebview.
"""
import base64
import os
import sys
import subprocess
import threading
import webbrowser

#: só documentos abrem por aqui (lista BRANCA): nada que rode código (.exe, .bat, .chm, .url...).
DOCUMENTOS = {".pdf", ".xlsx", ".xls", ".csv", ".ods", ".docx", ".doc", ".odt", ".pptx", ".ppt",
              ".txt", ".ofx", ".xml", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp",
              ".mp4", ".mp3", ".zip", ".rar", ".7z"}


def e_documento(nome: str) -> bool:
    return os.path.splitext(nome or "")[1].lower() in DOCUMENTOS

_um_dialogo_por_vez = threading.Lock()


def area_de_trabalho() -> str:
    return os.path.join(os.path.expanduser("~"), "Desktop")


def pasta_do_usuario() -> str:
    """Pasta própria deste usuário do Windows, dentro da pasta gravável do sistema
    (respeita a variável de teste: a base de teste fica isolada)."""
    import getpass
    from app import pasta_gravavel
    base = pasta_gravavel()
    pasta = os.path.join(base, "usuarios", getpass.getuser() or "usuario")
    os.makedirs(pasta, exist_ok=True)
    return pasta


def _pastas_tecnicas() -> list[str]:
    """Onde o Explorador nunca deve abrir: Windows, programas, dados do sistema e a base."""
    env = os.environ.get
    pastas = [env("WINDIR"), env("PROGRAMFILES"), env("PROGRAMFILES(X86)"), env("PROGRAMDATA"),
              env("APPDATA"), env("LOCALAPPDATA"), env("TEMP"),
              os.path.dirname(os.path.abspath(__file__ + "/..")),  # o próprio programa
              os.path.dirname(os.path.abspath(sys.executable))]
    try:
        from app import pasta_gravavel
        pastas.append(pasta_gravavel())
        # acrescente aqui a pasta da base de dados do motor (no Plus: db.banco.obter_servidor_path())
    except Exception:
        pass
    return [os.path.normcase(os.path.abspath(p)) for p in pastas if p]


def pasta_permitida(pasta: str) -> bool:
    if not pasta or not os.path.isdir(pasta):
        return False
    alvo = os.path.normcase(os.path.abspath(pasta))
    for t in _pastas_tecnicas():
        try:
            if os.path.commonpath([alvo, t]) == t:
                return False
        except ValueError:          # discos diferentes
            pass
    return True


def _arquivo_ultima() -> str:
    return os.path.join(pasta_do_usuario(), "ultima_pasta.txt")


def pasta_inicial() -> str:
    """Última pasta usada pelo usuário; se sumiu ou é técnica, a Área de Trabalho."""
    try:
        with open(_arquivo_ultima(), encoding="utf-8") as f:
            pasta = f.read().strip()
    except OSError:
        pasta = ""
    return pasta if pasta_permitida(pasta) else area_de_trabalho()


def lembrar_pasta(pasta: str) -> None:
    if pasta_permitida(pasta):
        try:
            with open(_arquivo_ultima(), "w", encoding="utf-8") as f:
                f.write(os.path.normpath(pasta))
        except OSError:
            pass                    # só perde a lembrança; o arquivo foi salvo


def abrir_pasta_do_arquivo(caminho: str) -> bool:
    """Abre o Explorador na pasta do arquivo, com ele selecionado."""
    if not caminho or not os.path.exists(caminho):
        return False
    subprocess.Popen(["explorer", "/select,", os.path.normpath(caminho)])
    return True


def abrir_arquivo(caminho: str) -> bool:
    """Abre o arquivo no programa padrão do Windows (a planilha no Excel)."""
    if not caminho or not os.path.isfile(caminho):
        return False
    if not e_documento(caminho):
        return False
    os.startfile(os.path.normpath(caminho))
    return True


def abrir_link(endereco: str) -> bool:
    """Abre um link no navegador padrão do Windows (só http/https)."""
    e = (endereco or "").strip()
    if e.lower().startswith("www."):
        e = "https://" + e
    if not e.lower().startswith(("http://", "https://")):
        return False
    return webbrowser.open(e)


def gravar(caminho: str, dados_base64: str) -> str:
    with open(caminho, "wb") as f:
        f.write(base64.b64decode(dados_base64))
    lembrar_pasta(os.path.dirname(caminho))
    return os.path.normpath(caminho)


# --- só no modo navegador: as janelas do Windows sem o pywebview ---------------------------

def _raiz_tk():
    import tkinter
    raiz = tkinter.Tk()
    raiz.withdraw()
    raiz.attributes("-topmost", True)  # aparece na frente do navegador
    raiz.update()
    return raiz


def escolher_pasta(inicial: str = "") -> str:
    """Janela «Escolher pasta» do Windows. Devolve '' se cancelou."""
    from tkinter import filedialog
    if not inicial or not os.path.isdir(inicial):
        inicial = area_de_trabalho()
    with _um_dialogo_por_vez:
        raiz = _raiz_tk()
        try:
            r = filedialog.askdirectory(parent=raiz, initialdir=inicial, title="Escolher pasta")
        finally:
            raiz.destroy()
    return os.path.normpath(r) if r else ""


def salvar_arquivo(nome: str, dados_base64: str) -> str:
    """Janela «Salvar como» do Windows e grava o arquivo. Devolve o caminho, ou '' se cancelou."""
    from tkinter import filedialog
    ext = os.path.splitext(nome)[1]
    with _um_dialogo_por_vez:
        raiz = _raiz_tk()
        try:
            r = filedialog.asksaveasfilename(
                parent=raiz, initialdir=pasta_inicial(), initialfile=nome, title="Salvar como",
                defaultextension=ext, filetypes=[(f"Arquivo {ext}", f"*{ext}"), ("Todos", "*.*")] if ext else [])
        finally:
            raiz.destroy()
    return gravar(r, dados_base64) if r else ""
