"""SERVIÇO de exemplo: aqui moram as regras. Sem Qt, sem FastAPI — só Python.

Na cirurgia de um sistema PyQt:
- o que já era motor (cálculos, banco, leitura de arquivos) fica em `motor/` e é IMPORTADO aqui;
- o que estava escrito dentro das telas Qt (validar, montar a lista, decidir quem pode)
  é recortado para funções aqui, com o MESMO comportamento.
"""
from motor import dados_exemplo


def listar() -> list[dict]:
    return dados_exemplo.ler_itens()


def salvar(nome: str, codigo: str) -> None:
    if len(nome.strip()) < 3:
        raise ValueError("Escreva pelo menos 3 letras no nome.")  # o motivo vai para o balão da tela
    dados_exemplo.gravar_item({"nome": nome.strip(), "codigo": codigo})
