"""PORTA de exemplo. Uma porta por assunto; cada uma é FINA: valida o que chegou (Pydantic)
e repassa para `servicos/`. Erro de regra vira HTTP 400 com o motivo em «detail» — a tela
mostra esse texto num balão. Nada de regra de negócio aqui."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from servicos import exemplo as S

rota = APIRouter(prefix="/api/exemplo", tags=["exemplo"])


class NovoItem(BaseModel):
    nome: str
    codigo: str = ""


@rota.get("/itens")
def itens():
    return S.listar()


@rota.post("/itens")
def salvar(d: NovoItem):
    try:
        S.salvar(d.nome, d.codigo)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}
