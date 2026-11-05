"""Modo navegador: o que a janela própria faz pelo pywebview, aqui pelo Python.

Só funciona quando o sistema foi aberto com `--navegador` (scripts\\ABRIR_NO_NAVEGADOR.bat):
o navegador roda neste mesmo computador, então as janelas do Windows aparecem para quem usa.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from janela import acoes

rota = APIRouter(prefix="/api/janela", tags=["janela"])

#: ligado pelo `app.py` só no modo navegador
LIGADA = {"sim": False}


class Caminho(BaseModel):
    caminho: str = ""


class Arquivo(BaseModel):
    nome: str
    dados: str


class Link(BaseModel):
    endereco: str


def _exigir(logado=True):
    if not LIGADA["sim"]:
        raise HTTPException(404, "Só no modo navegador.")
    # no Plus: se `logado` e ninguém entrou (servicos.sessao.usuario_logado()), recusa com 403


@rota.post("/escolher-pasta")
def escolher_pasta(d: Caminho):
    _exigir(logado=False)   # a tela de entrada usa para escolher a pasta da base
    return {"caminho": acoes.escolher_pasta(d.caminho)}


@rota.post("/salvar-arquivo")
def salvar_arquivo(d: Arquivo):
    _exigir()
    return {"caminho": acoes.salvar_arquivo(d.nome, d.dados)}


@rota.post("/abrir-pasta")
def abrir_pasta(d: Caminho):
    _exigir()
    return {"ok": acoes.abrir_pasta_do_arquivo(d.caminho)}


@rota.post("/abrir-arquivo")
def abrir_arquivo(d: Caminho):
    _exigir()
    return {"ok": acoes.abrir_arquivo(d.caminho)}


@rota.post("/abrir-link")
def abrir_link(d: Link):
    _exigir()
    return {"ok": acoes.abrir_link(d.endereco)}
