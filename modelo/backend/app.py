#!/usr/bin/env python3
"""PONTO DE ENTRADA — o mesmo desenho do Sistema Contábil Plus (backend/app.py).

O que acontece ao abrir:
1. Trava de «uma cópia por computador» (janela/instancia.py).
2. Liga o FastAPI SÓ dentro deste computador (127.0.0.1, porta lembrada ou sorteada) e com uma
   senha interna sorteada: nenhum outro programa nem site consegue usar a API.
3. Abre a janela do Windows (pywebview + WebView2) com as telas (frontend/dist).

Jeitos de abrir (os atalhos ficam em `scripts/`):
- sem nada: janela própria, igual ao instalado;
- `--navegador`: as telas no navegador padrão (a janela preta fica aberta);
- `--sem-janela`: servidor de TESTE fixo (porta 8765, senha «dev»), sem abrir nada;
- `--dev`: a janela abre as telas do Vite (http://localhost:5173), que recarregam na hora.

O motor (regras, banco, leitura de arquivos) mora em `motor/` — a cópia do sistema antigo,
mudando o mínimo, como no Plus. Esta pasta entra no sys.path: `import banco` continua valendo.
"""
import hmac
import os
import re
import secrets
import socket
import sys
import threading

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [AQUI, os.path.join(AQUI, "motor")]

NOME = "Meu Sistema"            # aparece na janela (pode ter acento)
PASTA = "MeuSistema"            # nome da pasta gravável: sem acento nem espaço
VAR_DADOS = "MEU_SISTEMA_DADOS"  # no Plus: SISTEMA_CONTABIL_DADOS
DEV = "--dev" in sys.argv or "--sem-janela" in sys.argv
NAVEGADOR = "--navegador" in sys.argv
URL_VITE = "http://localhost:5173"
MAX_CORPO = 60 * 1024 * 1024    # o maior pedido aceito (anexos, extratos, planilhas)

#: só os arquivos que a tela abre por endereço (<img src>, anexo em nova aba) aceitam ?t=
_SENHA_NO_ENDERECO = re.compile(r"^/api/arquivos/[^/]+$")


def pasta_telas() -> str:
    """As telas compiladas (`frontend/dist`). No .exe vão junto, em `_internal/telas`."""
    if getattr(sys, "_MEIPASS", None):
        return os.path.join(sys._MEIPASS, "telas")
    return os.path.join(os.path.dirname(AQUI), "frontend", "dist")


def pasta_gravavel() -> str:
    """Config, trava, porta e dados da janela deste computador: `%PROGRAMDATA%\\<PASTA>`, ou a
    variável VAR_DADOS (base de teste). O motor usa a MESMA variável para achar os dados dele,
    como no Plus — assim a base de teste fica isolada por inteiro."""
    pasta = (os.environ.get(VAR_DADOS) or "").strip() or os.path.join(os.environ.get("PROGRAMDATA", r"C:\ProgramData"), PASTA)
    os.makedirs(pasta, exist_ok=True)
    return pasta


def criar_api(token: str):
    from fastapi import FastAPI, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import FileResponse, JSONResponse
    from fastapi.staticfiles import StaticFiles
    from starlette.middleware.trustedhost import TrustedHostMiddleware

    from api import exemplo, janela

    app = FastAPI(title=NOME, docs_url="/api/docs" if DEV else None, redoc_url=None,
                  openapi_url="/api/openapi.json" if DEV else None)

    @app.middleware("http")
    async def exigir_token(request: Request, chamar):
        # Só as portas /api pedem a senha interna; as telas (arquivos) não.
        livre = request.url.path in ("/api/docs", "/api/openapi.json")
        if (request.url.path.startswith("/api") and not livre
                and request.method != "OPTIONS"
                and not hmac.compare_digest(request.headers.get("x-token") or "", token)
                # imagens (<img src>) não mandam cabeçalho: a senha vai no endereço, só em GET
                and not (request.method == "GET" and _SENHA_NO_ENDERECO.match(request.url.path)
                         and hmac.compare_digest(request.query_params.get("t") or "", token))):
            return JSONResponse({"detail": "sem permissão"}, status_code=401)
        try:
            grande = int(request.headers.get("content-length") or 0) > MAX_CORPO
        except ValueError:
            grande = True
        if grande:
            return JSONResponse({"detail": "Arquivo grande demais: o limite é de 60 MB por envio."}, status_code=413)
        resposta = await chamar(request)
        if request.url.path.startswith("/api"):
            # dado nunca fica guardado no navegador: uma resposta velha não aparece no lugar da nova
            resposta.headers["Cache-Control"] = "no-store"
        return resposta

    # só atende quem chama por 127.0.0.1/localhost (barra páginas que trocam o nome do endereço);
    # «testserver» é o nome que o cliente de teste (pytest) usa: só vale nos testes
    em_teste = "pytest" in sys.modules
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost"] + (["testserver"] if em_teste else []))
    if DEV:
        app.add_middleware(CORSMiddleware, allow_origins=[URL_VITE], allow_methods=["*"], allow_headers=["*"])

    app.include_router(exemplo.rota)
    app.include_router(janela.rota)
    janela.LIGADA["sim"] = NAVEGADOR

    dist = pasta_telas()
    if os.path.isdir(os.path.join(dist, "assets")):
        app.mount("/assets", StaticFiles(directory=os.path.join(dist, "assets")), name="assets")

    @app.get("/{caminho:path}", include_in_schema=False)
    def telas(caminho: str):
        if caminho.startswith("api/"):
            return JSONResponse({"detail": "Esta função não existe nesta versão do sistema."}, status_code=404)
        # só arquivos de DENTRO da pasta das telas (nunca «../» nem «C:/...»)
        raiz = os.path.realpath(dist)
        alvo = os.path.realpath(os.path.join(raiz, caminho))
        if caminho and os.path.isfile(alvo) and os.path.commonpath([alvo, raiz]) == raiz:
            return FileResponse(alvo)
        indice = os.path.join(raiz, "index.html")
        if not os.path.isfile(indice):
            return JSONResponse({"detail": "As telas não foram montadas (frontend/dist)."}, status_code=503)
        return FileResponse(indice)

    return app


def porta_livre() -> int:
    """Reusa a porta da última abertura: o que as telas guardam (filtros, colunas...) fica
    preso ao endereço, e porta nova = endereço novo = tudo esquecido. Ocupada: sorteia outra."""
    arq = os.path.join(pasta_gravavel(), "porta.txt")
    try:
        with open(arq, encoding="utf-8") as f:
            lembrada = int(f.read().strip())
    except (OSError, ValueError):
        lembrada = 0
    for p in ((lembrada, 0) if lembrada else (0,)):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
            except OSError:
                continue
            porta = s.getsockname()[1]
        if porta != lembrada:
            try:
                with open(arq, "w", encoding="utf-8") as f:
                    f.write(str(porta))
            except OSError:
                pass
        return porta
    raise OSError("sem porta livre")


def base_oficial_sem_pedido() -> bool:
    """Regra do Plus: rodando pelo código (não instalado), a base OFICIAL só abre com `--oficial`.
    Sem a variável de teste definida, para — ninguém testa nos dados reais por engano."""
    if getattr(sys, "frozen", False) or "--oficial" in sys.argv:
        return False
    return not (os.environ.get(VAR_DADOS) or "").strip()


def main():
    if base_oficial_sem_pedido():
        sys.exit(f"Pelo código, o sistema só abre numa base de teste: defina {VAR_DADOS} "
                 "(ou use scripts\\ABRIR_*.bat ficticia). Para a base oficial, use --oficial.")

    import uvicorn

    if "--sem-janela" in sys.argv:
        print("Telas em http://127.0.0.1:8765/#api=http://127.0.0.1:8765&t=dev")
        uvicorn.run(criar_api("dev"), host="127.0.0.1", port=8765, log_level="warning")
        return

    import webview

    from janela import instancia
    from janela.ponte import Ponte

    trava = instancia.travar(pasta_gravavel())
    if trava is None:
        webview.create_window(NOME, html=(
            "<body style='font-family:Segoe UI;padding:32px'>"
            f"<h3>O {NOME} já está aberto neste computador.</h3>"
            "<p>Procure a janela dele na barra de tarefas.</p></body>"),
            width=460, height=220, resizable=False)
        webview.start()
        return

    token = secrets.token_urlsafe(24)
    porta = 8765 if DEV else porta_livre()
    servidor = uvicorn.Server(uvicorn.Config(criar_api(token), host="127.0.0.1", port=porta, log_level="warning"))
    threading.Thread(target=servidor.run, name="api", daemon=True).start()

    # A porta e a senha vão no endereço (depois do #, que não sai do computador).
    base = URL_VITE if DEV else f"http://127.0.0.1:{porta}"
    url = f"{base}/#api=http://127.0.0.1:{porta}&t={token}"

    if NAVEGADOR:
        import time
        import webbrowser
        time.sleep(0.5)  # dá tempo de o servidor ligar
        webbrowser.open(url + "&m=navegador")
        print(f"O {NOME} abriu no navegador. Para fechar o sistema, feche esta janela preta.")
        print("Se a aba fechar, abra de novo por este endereço:\n  " + url + "&m=navegador")
        try:
            while not servidor.should_exit:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        servidor.should_exit = True
        trava.close()
        return

    ponte = Ponte()
    # background_color = o fundo do tema escuro do Plus (#2B2A28): a janela não pisca branco
    janela = webview.create_window(NOME, url, js_api=ponte, width=1280, height=820, min_size=(640, 480),
                                   maximized=True, background_color="#2B2A28")
    ponte.ligar(janela)
    from janela.acoes import pasta_do_usuario
    webview.start(debug=DEV, private_mode=False, storage_path=os.path.join(pasta_do_usuario(), "janela"))
    servidor.should_exit = True
    trava.close()


if __name__ == "__main__":
    # ⚠ PRIMEIRO de tudo: no .exe, processos filhos abrem este mesmo programa; sem isto,
    # cada um tentaria abrir a janela do sistema.
    import multiprocessing
    multiprocessing.freeze_support()
    main()
