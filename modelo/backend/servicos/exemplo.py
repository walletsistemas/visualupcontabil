"""SERVIÇO de exemplo: aqui moram as regras. Sem Qt, sem FastAPI — só Python.

Na cirurgia de um sistema PyQt:
- o motor antigo (cálculos, banco, leitura de arquivos) continua na raiz do projeto e é
  IMPORTADO aqui (ex.: `from motor import banco`), sem mudar de lugar;
- o que estava escrito dentro das telas Qt (validar, montar a lista, decidir quem pode)
  é recortado para funções aqui, com o MESMO comportamento e as MESMAS mensagens.

Este arquivo é só exemplo: os dados abaixo fazem o papel do motor. Apague na cirurgia.
"""

_PESSOAS = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes"]
_SITUACOES = ["concluido", "andamento", "atrasado", "pendente"]
_NOMES = ["Projeto Alfa", "Horizonte Azul", "Vale Verde", "Aurora Norte", "Pedra Branca", "Rio Claro"]

_ITENS = [
    {
        "id": i + 1,
        "nome": nome,
        "codigo": f"{1000 + i * 37:04d}-{(i * 7) % 10}",
        "categoria": f"Categoria {'ABC'[i % 3]}",
        "responsavel": _PESSOAS[i % 6],
        "equipe": [_PESSOAS[(i + 1) % 6], _PESSOAS[(i + 3) % 6]],
        "situacao": _SITUACOES[(i * 5) % 4],
        "progresso": {"concluido": 100, "pendente": 0}.get(_SITUACOES[(i * 5) % 4], 50),
        "prazo": f"2026-{(i % 11) + 1:02d}-{((i * 3) % 27) + 1:02d}",
        "valor": 1200 + (i * 7919) % 48000,
        "cidade": ["Curitiba", "Recife", "Belém", "Goiânia", "Natal", "Vitória"][i % 6],
        "contato": f"contato{i + 1}@exemplo.com",
        "observacao": "",
    }
    for i, nome in enumerate(_NOMES)
]


def listar() -> list[dict]:
    return list(_ITENS)


def salvar(nome: str, codigo: str) -> None:
    if len(nome.strip()) < 3:
        raise ValueError("Escreva pelo menos 3 letras no nome.")  # o motivo vai para o balão da tela
    _ITENS.append({**_ITENS[0], "nome": nome.strip(), "codigo": codigo, "id": len(_ITENS) + 1})
