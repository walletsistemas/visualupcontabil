"""MOTOR de exemplo. Como no Plus, `backend/motor/` recebe a CÓPIA do motor do sistema antigo
(regras, banco, leitura de arquivos), mudando o mínimo. O sistema antigo continua na pasta dele,
intocado, sendo o oficial até a versão nova estar completa e testada na base de teste.

Este arquivo só faz o papel do motor na vitrine: uma lista em memória. Apague na cirurgia.
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


def ler_itens() -> list[dict]:
    return list(_ITENS)


def gravar_item(item: dict) -> None:
    _ITENS.append({**_ITENS[0], **item, "id": len(_ITENS) + 1})
