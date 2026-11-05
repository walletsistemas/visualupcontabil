"""O que só o Windows sabe fazer, pedido pelas telas.

Na janela própria, as telas chamam `window.pywebview.api.<função>()` (esta classe).
No modo navegador, as mesmas funções chegam por `/api/janela/...` (ver `api/janela.py`).
O lado das telas é `frontend/src/api/janela.ts`, que escolhe sozinho o caminho certo.
"""
import base64
import os
import subprocess
import webbrowser

#: só documentos abrem pelo programa (lista BRANCA: nada que rode código)
DOCUMENTOS = {".pdf", ".xlsx", ".xls", ".csv", ".docx", ".doc", ".txt", ".xml", ".png", ".jpg", ".jpeg", ".zip"}


def area_de_trabalho() -> str:
    return os.path.join(os.path.expanduser("~"), "Desktop")


def gravar(caminho: str, dados_base64: str) -> str:
    with open(caminho, "wb") as f:
        f.write(base64.b64decode(dados_base64))
    return caminho


def abrir_pasta_do_arquivo(caminho: str) -> bool:
    """Abre o Explorador na pasta do arquivo, com ele selecionado."""
    if not caminho or not os.path.exists(caminho):
        return False
    subprocess.Popen(["explorer", "/select,", os.path.normpath(caminho)])
    return True


def abrir_arquivo(caminho: str) -> bool:
    """Abre o arquivo no programa padrão do Windows (a planilha no Excel)."""
    if not caminho or not os.path.isfile(caminho) or os.path.splitext(caminho)[1].lower() not in DOCUMENTOS:
        return False
    os.startfile(os.path.normpath(caminho))
    return True


def abrir_link(endereco: str) -> bool:
    """Abre um link no navegador padrão (só http/https: nunca javascript:, file:...)."""
    e = (endereco or "").strip()
    if e.lower().startswith("www."):
        e = "https://" + e
    return e.lower().startswith(("http://", "https://")) and webbrowser.open(e)


class Ponte:
    def __init__(self):
        self._janela = None

    def ligar(self, janela):
        self._janela = janela

    def escolher_pasta(self, inicial: str = "") -> str:
        """Seletor de pasta do Windows. '' = cancelou."""
        import webview
        if not inicial or not os.path.isdir(inicial):
            inicial = area_de_trabalho()
        r = self._janela.create_file_dialog(webview.FileDialog.FOLDER, directory=inicial)
        return os.path.normpath(r[0]) if r else ""

    def salvar_arquivo(self, nome: str, dados_base64: str) -> str:
        """Janela «Salvar como» do Windows e grava. Devolve o caminho, ou '' se cancelou."""
        import webview
        ext = os.path.splitext(nome)[1]
        tipos = (f"Arquivo {ext[1:].upper()} (*{ext})",) if ext else ()
        r = self._janela.create_file_dialog(webview.FileDialog.SAVE, directory=area_de_trabalho(),
                                            save_filename=nome, file_types=tipos)
        if not r:
            return ""
        caminho = r if isinstance(r, str) else r[0]
        if ext and not caminho.lower().endswith(ext.lower()):
            caminho += ext
        return gravar(caminho, dados_base64)

    def abrir_pasta_do_arquivo(self, caminho: str) -> bool:
        return abrir_pasta_do_arquivo(caminho)

    def abrir_arquivo(self, caminho: str) -> bool:
        return abrir_arquivo(caminho)

    def abrir_link(self, endereco: str) -> bool:
        return abrir_link(endereco)
