"""Confere a casca: senha interna, rota de exemplo, erro com motivo e proteção de endereço.
Rode na pasta do projeto: python -m pytest tests"""
from fastapi.testclient import TestClient

import app

cliente = TestClient(app.criar_api("segredo"))
SENHA = {"X-Token": "segredo"}


def test_sem_senha_nao_entra():
    assert cliente.get("/api/exemplo/itens").status_code == 401


def test_lista_com_senha():
    r = cliente.get("/api/exemplo/itens", headers=SENHA)
    assert r.status_code == 200 and r.json()[0]["nome"] == "Projeto Alfa"


def test_regra_devolve_motivo():
    r = cliente.post("/api/exemplo/itens", json={"nome": "ab"}, headers=SENHA)
    assert r.status_code == 400 and "3 letras" in r.json()["detail"]


def test_endereco_estranho_barrado():
    assert cliente.get("/api/exemplo/itens", headers={**SENHA, "host": "site-malicioso.com"}).status_code == 400


def test_imagem_com_senha_no_endereco():
    # <img src> não manda cabeçalho: só /api/arquivos/... aceita ?t=, e só em GET
    assert cliente.get("/api/exemplo/itens?t=segredo").status_code == 401
    assert cliente.get("/api/arquivos/x?t=errada").status_code == 401


def test_pelo_codigo_so_abre_base_de_teste(monkeypatch):
    monkeypatch.delenv(app.VAR_DADOS, raising=False)
    assert app.base_oficial_sem_pedido()
    monkeypatch.setenv(app.VAR_DADOS, "C:/teste")
    assert not app.base_oficial_sem_pedido()
