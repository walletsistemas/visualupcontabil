"""O que só a janela do Windows sabe fazer, exposto às telas via pywebview.

As telas chamam `window.pywebview.api.<função>()`. No modo navegador, as mesmas funções
chegam por `/api/janela/...` (ver `api/janela.py`).
"""
import os

from janela import acoes


class Ponte:
    def __init__(self):
        self._janela = None

    def ligar(self, janela):
        self._janela = janela

    def escolher_pasta(self, inicial: str = "") -> str:
        """Abre o seletor de pasta do Windows. Devolve '' se cancelou."""
        import webview
        if not inicial or not os.path.isdir(inicial):
            inicial = acoes.area_de_trabalho()
        r = self._janela.create_file_dialog(webview.FileDialog.FOLDER, directory=inicial)
        return os.path.normpath(r[0]) if r else ""

    def salvar_arquivo(self, nome: str, dados_base64: str) -> str:
        """Pergunta onde salvar (janela «Salvar como» do Windows) e grava o arquivo.
        Devolve o caminho gravado, ou '' se cancelou."""
        import webview
        ext = os.path.splitext(nome)[1]  # ex.: ".pdf"
        tipos = (f"Arquivo {ext[1:].upper()} (*{ext})",) if ext else ()
        r = self._janela.create_file_dialog(webview.FileDialog.SAVE, directory=acoes.pasta_inicial(),
                                            save_filename=nome, file_types=tipos)
        if not r:
            return ""
        caminho = r if isinstance(r, str) else r[0]
        if ext and not caminho.lower().endswith(ext.lower()):
            caminho += ext  # usuário apagou/trocou a extensão: garante o tipo certo
        return acoes.gravar(caminho, dados_base64)

    def abrir_pasta_do_arquivo(self, caminho: str) -> bool:
        """Abre o Explorador na pasta do arquivo, com ele selecionado."""
        return acoes.abrir_pasta_do_arquivo(caminho)

    def abrir_arquivo(self, caminho: str) -> bool:
        """Abre o arquivo no programa padrão do Windows (a planilha no Excel)."""
        return acoes.abrir_arquivo(caminho)

    def abrir_link(self, endereco: str) -> bool:
        """Abre um link da tarefa no navegador padrão do Windows (só http/https)."""
        return acoes.abrir_link(endereco)
