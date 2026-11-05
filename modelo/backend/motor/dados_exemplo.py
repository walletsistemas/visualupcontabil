"""MOTOR de exemplo — no lugar disto entra o código do sistema antigo, mudando o mínimo.
Aqui, só uma lista em memória com os mesmos dados inventados da vitrine."""

_PESSOAS = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes"]
_SITUACOES = ["concluido", "andamento", "atrasado", "pendente"]

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
    for i, nome in enumerate(["Projeto Alfa", "Horizonte Azul", "Vale Verde", "Aurora Norte", "Pedra Branca", "Rio Claro"])
]


def ler_itens() -> list[dict]:
    return list(_ITENS)


def gravar_item(item: dict) -> None:
    _ITENS.append({**_ITENS[0], **item, "id": len(_ITENS) + 1})
