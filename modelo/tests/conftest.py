"""Prepara os testes: isolamento total, como no Plus (tests/conftest.py) — pasta de dados própria
e temporária; nenhum teste toca a base oficial."""
import os
import sys
import tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(RAIZ, "backend"), os.path.join(RAIZ, "backend", "motor")]
os.environ["MEU_SISTEMA_DADOS"] = tempfile.mkdtemp(prefix="meusistema_teste_")
