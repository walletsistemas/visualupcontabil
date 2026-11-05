"""Confere a casca: senha interna, rota de exemplo, erro com motivo e proteção de endereço.
Rode: python -m pytest modelo/backend/teste_api.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient  # noqa: E402

import app  # noqa: E402

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
