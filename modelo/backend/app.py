#!/usr/bin/env python3
"""PONTO DE ENTRADA do programa (o .exe começa aqui).

O que acontece ao abrir:
1. Trava de «uma cópia por computador».
2. Liga o FastAPI SÓ dentro deste computador (127.0.0.1, porta sorteada) e com uma senha
   interna sorteada: nenhum outro programa nem site consegue usar a API.
3. Abre a janela do Windows (pywebview + WebView2) com as telas React (frontend/dist).

Jeitos de abrir:
  python app.py                 -> janela própria (igual ao instalado)
  python app.py --navegador     -> as telas no navegador padrão (a janela preta fica aberta)
  python app.py --sem-janela    -> servidor de TESTE: porta 8765, senha «dev» (Vite e testes)
  python app.py --dev           -> janela abrindo as telas do Vite (recarregam na hora)

NA CIRURGIA: o motor antigo (regras, banco, leitura de arquivos) entra em `motor/` mudando o
mínimo; o que estava preso nas telas Qt vira funções em `servicos/`; `api/` só repassa.
"""
import hmac
import os
import secrets
import socket
import sys
import threading

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [AQUI, os.path.join(AQUI, "motor")]

NOME = "Meu Sistema"
DEV = "--dev" in sys.argv or "--sem-janela" in sys.argv
NAVEGADOR = "--navegador" in sys.argv
URL_VITE = "http://localhost:5173"
MAX_CORPO = 60 * 1024 * 1024  # maior envio aceito (anexos, planilhas)


def pasta_telas() -> str:
    """As telas compiladas. No .exe vão junto, em `_internal/telas`."""
    if getattr(sys, "_MEIPASS", None):
        return os.path.join(sys._MEIPASS, "telas")
    return os.path.join(os.path.dirname(AQUI), "frontend", "dist")


def pasta_gravavel() -> str:
    """Onde o programa guarda o que é deste computador (config, trava, porta).
    `MEU_SISTEMA_DADOS` troca a pasta (testes ficam isolados do uso real)."""
    pasta = (os.environ.get("MEU_SISTEMA_DADOS") or "").strip() or os.path.join(
        os.environ.get("PROGRAMDATA", os.path.expanduser("~")), NOME.replace(" ", ""))
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
    async def exigir_senha(request: Request, chamar):
        # só /api pede a senha interna (cabeçalho X-Token); as telas (arquivos) não
        livre = request.url.path in ("/api/docs", "/api/openapi.json")
        if (request.url.path.startswith("/api") and not livre and request.method != "OPTIONS"
                and not hmac.compare_digest(request.headers.get("x-token") or "", token)):
            return JSONResponse({"detail": "sem permissão"}, status_code=401)
        try:
            grande = int(request.headers.get("content-length") or 0) > MAX_CORPO
        except ValueError:
            grande = True
        if grande:
            return JSONResponse({"detail": "Arquivo grande demais: o limite é de 60 MB."}, status_code=413)
        resposta = await chamar(request)
        if request.url.path.startswith("/api"):
            resposta.headers["Cache-Control"] = "no-store"  # dado velho nunca aparece no lugar do novo
        return resposta

    # só atende quem chama por 127.0.0.1/localhost (barra sites que trocam o nome do endereço)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost", "testserver"])
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
            return JSONResponse({"detail": "Esta função não existe nesta versão."}, status_code=404)
        # só arquivos de DENTRO da pasta das telas (nunca «../» nem «C:/...»)
        raiz = os.path.realpath(dist)
        alvo = os.path.realpath(os.path.join(raiz, caminho))
        if caminho and os.path.isfile(alvo) and os.path.commonpath([alvo, raiz]) == raiz:
            return FileResponse(alvo)
        indice = os.path.join(raiz, "index.html")
        if not os.path.isfile(indice):
            return JSONResponse({"detail": "As telas não foram montadas (rode npm run build em frontend/)."}, status_code=503)
        return FileResponse(indice)

    return app


def travar_uma_copia():
    """Arquivo travado pelo Windows enquanto o programa vive. None = já há outra cópia aberta."""
    f = open(os.path.join(pasta_gravavel(), "programa_aberto.lock"), "a+")
    try:
        if os.name == "nt":
            import msvcrt
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        f.close()
        return None
    return f


def porta_livre() -> int:
    """Reusa a porta da última abertura (o que as telas guardam fica preso ao endereço);
    ocupada, sorteia outra."""
    arq = os.path.join(pasta_gravavel(), "porta.txt")
    try:
        lembrada = int(open(arq, encoding="utf-8").read().strip())
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
                open(arq, "w", encoding="utf-8").write(str(porta))
            except OSError:
                pass
        return porta
    raise OSError("sem porta livre")


def main():
    import uvicorn

    if "--sem-janela" in sys.argv:
        print("Telas de teste: http://127.0.0.1:8765/#api=http://127.0.0.1:8765&t=dev")
        uvicorn.run(criar_api("dev"), host="127.0.0.1", port=8765, log_level="warning")
        return

    import webview

    trava = travar_uma_copia()
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

    # a porta e a senha vão depois do # (essa parte do endereço não sai do computador)
    base = URL_VITE if DEV else f"http://127.0.0.1:{porta}"
    url = f"{base}/#api=http://127.0.0.1:{porta}&t={token}"

    if NAVEGADOR:
        import time
        import webbrowser
        time.sleep(0.5)
        webbrowser.open(url + "&m=navegador")
        print(f"O {NOME} abriu no navegador. Para fechar, feche esta janela preta.")
        try:
            while not servidor.should_exit:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        servidor.should_exit = True
        trava.close()
        return

    from janela.ponte import Ponte
    ponte = Ponte()
    # background_color = a cor de fundo do tema: a janela não pisca branco ao abrir
    janela = webview.create_window(NOME, url, js_api=ponte, width=1280, height=820, min_size=(640, 480),
                                   maximized=True, background_color="#F4F0EA")
    ponte.ligar(janela)
    webview.start(debug=DEV, private_mode=False, storage_path=os.path.join(pasta_gravavel(), "janela"))
    servidor.should_exit = True
    trava.close()


if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()  # no .exe, processos filhos não abrem outra janela
    main()
