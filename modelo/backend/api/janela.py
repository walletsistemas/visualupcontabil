"""Modo navegador: o que a janela própria faz pelo pywebview, aqui pelo Python.
Só vale quando o programa abriu com `--navegador` (o navegador roda neste mesmo PC)."""
import tkinter
from tkinter import filedialog

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from janela import ponte

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


def _exigir():
    if not LIGADA["sim"]:
        raise HTTPException(404, "Só no modo navegador.")


def _tk():
    raiz = tkinter.Tk()
    raiz.withdraw()
    raiz.attributes("-topmost", True)  # a janela do Windows aparece na frente do navegador
    return raiz


@rota.post("/escolher-pasta")
def escolher_pasta(d: Caminho):
    _exigir()
    raiz = _tk()
    try:
        return {"caminho": filedialog.askdirectory(initialdir=d.caminho or ponte.area_de_trabalho()) or ""}
    finally:
        raiz.destroy()


@rota.post("/salvar-arquivo")
def salvar_arquivo(d: Arquivo):
    _exigir()
    raiz = _tk()
    try:
        caminho = filedialog.asksaveasfilename(initialdir=ponte.area_de_trabalho(), initialfile=d.nome)
    finally:
        raiz.destroy()
    return {"caminho": ponte.gravar(caminho, d.dados) if caminho else ""}


@rota.post("/abrir-pasta")
def abrir_pasta(d: Caminho):
    _exigir()
    return {"ok": ponte.abrir_pasta_do_arquivo(d.caminho)}


@rota.post("/abrir-arquivo")
def abrir_arquivo(d: Caminho):
    _exigir()
    return {"ok": ponte.abrir_arquivo(d.caminho)}


@rota.post("/abrir-link")
def abrir_link(d: Link):
    _exigir()
    return {"ok": ponte.abrir_link(d.endereco)}
