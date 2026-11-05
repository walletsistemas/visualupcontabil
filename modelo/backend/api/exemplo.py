"""PORTA de exemplo — como em backend/api/ do Plus: uma porta por assunto, FINA. Valida o que
chegou (esquemas/) e repassa para servicos/. Erro de regra vira HTTP 400 com o motivo em «detail»,
que a tela mostra num balão. Nada de regra de negócio aqui."""
from fastapi import APIRouter, HTTPException

from esquemas.exemplo import NovoItem
from servicos import exemplo as S

rota = APIRouter(prefix="/api/exemplo", tags=["exemplo"])


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
