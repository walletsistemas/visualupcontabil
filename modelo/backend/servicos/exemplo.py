"""SERVIÇO de exemplo — como no Plus, `servicos/` guarda as regras que no sistema antigo estavam
presas nas telas Qt (validar, montar a lista, decidir quem pode), com o MESMO comportamento e as
MESMAS mensagens. Sem Qt, sem FastAPI: só Python. Erro de regra = ValueError com o motivo.
"""
import dados_exemplo  # o motor (backend/motor está no sys.path, como no Plus)


def listar() -> list[dict]:
    return dados_exemplo.ler_itens()


def salvar(nome: str, codigo: str) -> None:
    if len(nome.strip()) < 3:
        raise ValueError("Escreva pelo menos 3 letras no nome.")  # o motivo vai para o balão da tela
    dados_exemplo.gravar_item({"nome": nome.strip(), "codigo": codigo})
