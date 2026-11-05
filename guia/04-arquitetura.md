# 04 · Arquitetura: como as peças se ligam

> **Para a IA.** Leia antes de mover o motor da pessoa. Mostra o que acontece ao abrir o
> programa, onde cada tipo de código mora e como uma tela pede dados e mostra erros.

Resumo: é um **programa de desktop**. O Python roda um servidor só para dentro do próprio
computador, e a janela do Windows (WebView2) mostra as telas React, que conversam com esse
servidor. Nada é site, nada sai da máquina.

## O que acontece ao abrir

Arquivo: `modelo/backend/app.py` (função `main`).

```text
 MeuSistema.exe  (ou: python backend\app.py)
        │
        ▼
 1. TRAVA DE UMA CÓPIA ─────────── já há outra aberta? ──► janelinha "já está aberto" e sai
    programa_aberto.lock na pasta gravável (msvcrt.locking)
        │
        ▼
 2. SENHA SORTEADA  token = secrets.token_urlsafe(24)
    PORTA           porta_livre(): reusa a de porta.txt; ocupada, sorteia outra
        │
        ▼
 3. FASTAPI em 127.0.0.1:<porta>   (uvicorn numa thread "api")
    /api/...     → exige cabeçalho X-Token = senha
    /assets/...  → arquivos das telas compiladas (frontend/dist)
    /qualquer    → index.html
        │
        ▼
 4. PYWEBVIEW abre a janela (WebView2) no endereço:
    http://127.0.0.1:<porta>/#api=http://127.0.0.1:<porta>&t=<senha>
    js_api = Ponte()  (escolher pasta, salvar arquivo, abrir link...)
        │
        ▼
 5. TELAS (React) leem #api e #t  (src/api/cliente.ts)
    e mandam X-Token em toda chamada a /api
        │
        ▼
 Fechou a janela → servidor.should_exit = True → solta a trava
```

Por que depois do `#`: essa parte do endereço **não é enviada** em nenhuma requisição. A senha
fica só na janela.

Por que reusar a porta: o que as telas guardam (`localStorage`: tema, menu recolhido...) fica
preso ao endereço. Mesma porta = preferências preservadas.

### A pasta gravável

`pasta_gravavel()` em `app.py`: a variável de ambiente `MEU_SISTEMA_DADOS`, ou
`%PROGRAMDATA%\MeuSistema` se ela não existir. Guarda `programa_aberto.lock`, `porta.txt` e
`janela\` (dados do WebView2). O `ABRIR.bat` define `MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_TESTE`
para os testes não se misturarem com o uso real. Na cirurgia, renomeie a variável e a pasta
com o nome do programa da pessoa.

## Os 4 jeitos de abrir

| Comando | Janela | Porta / senha | Uso |
|---|---|---|---|
| `python app.py` | Janela própria (pywebview), maximizada, fundo `#F4F0EA` para não piscar branco | porta lembrada ou sorteada / senha sorteada | Igual ao instalado. |
| `python app.py --navegador` | Navegador padrão; a janela preta (console) fica aberta e fechar ela encerra | idem, e acrescenta `&m=navegador` ao endereço | PC sem WebView2, ou depurar no navegador. Liga as portas `/api/janela/*`. |
| `python app.py --sem-janela` | Nenhuma (só servidor). Imprime o endereço de teste | **8765 / `dev`**. Sem trava. Docs em `/api/docs` | Testes automáticos e o Vite (`npm run dev`) com dados reais. |
| `python app.py --dev` | Janela própria abrindo **o Vite** (`http://localhost:5173`), com ferramentas de depuração | 8765 / senha sorteada | Mexer nas telas e ver na hora dentro da janela. Precisa do `npm run dev` rodando. |

`--dev` e `--sem-janela` ligam o modo `DEV` (`/api/docs` aberto e CORS liberado só para
`http://localhost:5173`).

E sem Python nenhum: `ABRIR.bat vitrine` (ou `npm run dev`) abre só as telas no Vite. Sem
`#t=` no endereço, as funções de `src/api/*.ts` devolvem os **dados inventados** de
`src/dados/exemplo.ts` (ver `ABERTO_PELO_SISTEMA` abaixo).

## As camadas

```text
 backend/motor/        regras antigas, banco, leitura de arquivos  (o código da pessoa)
      ▲  importado por
 backend/servicos/     regras que estavam presas nas telas Qt, em funções Python puras
      ▲  chamado por
 backend/api/          portas FastAPI finas: validam a entrada e repassam
      ▲  HTTP + X-Token
 frontend/src/api/*.ts uma função por porta (exemploApi.itens, exemploApi.salvar)
      ▲  useQuery / useMutation
 frontend/src/telas/   as telas: só mostram e pedem
```

| Camada | Regra | Exemplo no modelo |
|---|---|---|
| `backend/motor/` | Entra o código do sistema antigo **mudando o mínimo** (só imports, se precisar). Sem FastAPI, sem tela. `app.py` põe esta pasta no `sys.path`, então imports antigos do tipo `import banco` continuam funcionando. | `motor/dados_exemplo.py` (`ler_itens`, `gravar_item`) |
| `backend/servicos/` | As regras que estavam escritas dentro dos `QWidget` (validar, montar lista, decidir quem pode) viram funções aqui, com o **mesmo comportamento**. Sem Qt, sem FastAPI. Erro de regra = `raise ValueError("motivo para a pessoa ler")`. | `servicos/exemplo.py` (`listar`, `salvar`) |
| `backend/api/` | Uma porta por assunto (`APIRouter(prefix="/api/<assunto>")`). Valida com Pydantic, chama o serviço, converte `ValueError` em `HTTPException(400, motivo)`. **Nada de regra aqui.** Registre em `criar_api` com `app.include_router(...)`. | `api/exemplo.py` |
| `frontend/src/api/*.ts` | Uma função por porta, usando `api.get/post/put/del` de `cliente.ts`. É o único lugar das telas que conhece endereços `/api/...`. | `src/api/exemplo.ts` |
| `frontend/src/telas/` | Usam as funções acima com TanStack Query. Não fazem `fetch` direto e não repetem regra do Python (validação de formulário com Zod é só para ajudar a digitar; quem decide é o serviço). | `src/telas/Lista.tsx` |

Porta e serviço reais do modelo:

```python
# backend/api/exemplo.py
rota = APIRouter(prefix="/api/exemplo", tags=["exemplo"])

@rota.post("/itens")
def salvar(d: NovoItem):
    try:
        S.salvar(d.nome, d.codigo)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}
```

```python
# backend/servicos/exemplo.py
def salvar(nome: str, codigo: str) -> None:
    if len(nome.strip()) < 3:
        raise ValueError("Escreva pelo menos 3 letras no nome.")  # o motivo vai para o balão da tela
    dados_exemplo.gravar_item({"nome": nome.strip(), "codigo": codigo})
```

## Ponte com o Windows

Algumas coisas só o Windows faz: escolher pasta, "Salvar como", abrir o Explorador, abrir um
arquivo no programa padrão, abrir link no navegador. São dois caminhos, e as telas não precisam
saber qual está valendo:

| Aberto como | Quem faz | Arquivo Python |
|---|---|---|
| Janela própria | `window.pywebview.api.<função>()` (classe `Ponte`, passada em `js_api`) | `backend/janela/ponte.py` |
| `--navegador` | `POST /api/janela/escolher-pasta`, `/salvar-arquivo`, `/abrir-pasta`, `/abrir-arquivo`, `/abrir-link` (usa `tkinter` para as janelas) | `backend/api/janela.py` (só responde se `LIGADA["sim"]`; senão 404 "Só no modo navegador.") |
| Vite / navegador de teste | Nenhum: cai num substituto (`window.prompt`, download direto, `window.open`) | — |

As telas chamam só `src/api/janela.ts`, que escolhe o caminho sozinho:

```ts
import { escolherPasta, salvarArquivo, abrirPastaDoArquivo, abrirArquivo, abrirLink, temJanela } from "@/api/janela";

const pasta = await escolherPasta();                       // '' = cancelou
const onde = await salvarArquivo("relatorio.xlsx", base64, "application/vnd.ms-excel");
if (onde && temJanela()) await abrirPastaDoArquivo(onde);  // «Abrir pasta» só quando há Windows por trás
```

Na janela própria o pywebview liga a ponte um instante depois de a tela abrir; `janela.ts`
espera o evento `pywebviewready` (até 5 s) antes de chamar. Na cirurgia, cada `QFileDialog`,
`QDesktopServices.openUrl` ou `os.startfile` das telas antigas vira uma dessas funções. Função
nova do Windows: acrescente o método na `Ponte`, a porta equivalente em `api/janela.py` e a
função em `janela.ts`.

## Proteções (não remova)

| Proteção | Onde | O que impede |
|---|---|---|
| Servidor só em `127.0.0.1` | `app.py` (`uvicorn ... host="127.0.0.1"`) | Outro computador da rede usar a API. |
| Senha interna no cabeçalho `X-Token`, comparada com `hmac.compare_digest` | `app.py` (`exigir_senha`) | Outro programa ou site aberto no mesmo PC chamar `/api`. Sem senha: 401 `{"detail": "sem permissão"}`. |
| `TrustedHostMiddleware` (`127.0.0.1`, `localhost`, `testserver`) | `app.py` | Site malicioso que aponta o próprio nome para 127.0.0.1 (DNS rebinding). Responde 400. |
| Limite de 60 MB por envio (`MAX_CORPO`) | `app.py` | Travar o programa com envio gigante. Responde 413 com o motivo. |
| `Cache-Control: no-store` em toda resposta `/api` (e `cache: "no-store"` no `fetch`) | `app.py`, `cliente.ts` | Dado velho aparecer no lugar do novo. |
| Só arquivos de **dentro** de `dist` (`realpath` + `commonpath`) | `app.py` (`telas`) | Pedir `../../` ou `C:/...` e ler arquivos do PC. |
| `/api/docs` e `/api/openapi.json` só no modo `DEV` | `app.py` | Expor a lista de portas no programa instalado. |
| CORS só no modo `DEV` e só para o Vite | `app.py` | Outra origem chamar a API. |
| Lista branca de documentos para abrir (`DOCUMENTOS`: `.pdf .xlsx .xls .csv .docx .doc .txt .xml .png .jpg .jpeg .zip`) | `janela/ponte.py` | Abrir pelo programa algo que roda código (`.exe`, `.bat`...). |
| Links só `http://` e `https://` (`www.` vira `https://`) | `janela/ponte.py` e `src/api/janela.ts` | `javascript:`, `file:` e afins. |
| Portas `/api/janela/*` só no modo navegador | `api/janela.py` (`_exigir`) | Abrir diálogos do Windows a partir de chamada indevida. |

O teste `backend/teste_api.py` confere senha, porta de exemplo, erro com motivo e endereço
estranho barrado: `python -m pytest modelo/backend/teste_api.py`.

## Como uma tela busca dados

`src/api/cliente.ts` lê o endereço e a senha do `#` e oferece `api.get/post/put/del`:

```ts
const parametros = new URLSearchParams(window.location.hash.slice(1));
const API = parametros.get("api") ?? (window.location.port === "5173" ? "http://127.0.0.1:8765" : window.location.origin);
const TOKEN = parametros.get("t") ?? "dev";
export const MODO_NAVEGADOR = parametros.get("m") === "navegador";
export const ABERTO_PELO_SISTEMA = parametros.has("t");
```

`src/api/exemplo.ts` é o padrão de toda tela (com dado inventado quando não há Python):

```ts
export const exemploApi = {
  itens: () => (ABERTO_PELO_SISTEMA ? api.get<Item[]>("/api/exemplo/itens") : Promise.resolve(ITENS)),
  salvar: (item: Partial<Item>) =>
    ABERTO_PELO_SISTEMA ? api.post<{ ok: boolean }>("/api/exemplo/itens", item) : Promise.resolve({ ok: true }),
};
```

Na tela, com TanStack Query (`src/telas/Lista.tsx`):

```tsx
const q = useQuery({ queryKey: ["itens"], queryFn: exemploApi.itens });
// q.isLoading → <Esqueleto />   ·   lista vazia → <Vazio ... />   ·   senão, os cartões
```

Para gravar, use `useMutation` e, no sucesso, `queryClient.invalidateQueries({ queryKey: ["itens"] })`
para a lista recarregar. Configuração global em `src/main.tsx`: `retry: 1` e
`refetchOnWindowFocus: false`.

Na cirurgia, quando a tela já usa dados reais, o ramo `Promise.resolve(...)` com dado inventado
pode sair. Quem testa sem janela usa `python app.py --sem-janela` (porta 8765, senha `dev`).

## Como um erro vira balão

Regra do kit: **nada falha calado**. O caminho é sempre o mesmo:

```text
 servicos/: raise ValueError("Escreva pelo menos 3 letras no nome.")
     ▼
 api/:      raise HTTPException(400, str(e))   →  {"detail": "Escreva pelo menos 3 letras no nome."}
     ▼
 cliente.ts: resposta não ok → lê "detail" → throw new ErroDaApi(detail)
            (sem resposta → "O sistema não respondeu. Feche e abra o programa de novo.")
            (sem detail → "Erro <status> ao falar com o sistema.")
     ▼
 main.tsx:  QueryCache.onError    → toast.error("Não foi possível carregar: <motivo>", { id: motivo })
            MutationCache.onError → toast.error("Não foi possível concluir: <motivo>", { id: motivo })
                                    (só quando a mutation não tem onError próprio)
```

O `id: motivo` faz a mesma falha não empilhar vários balões iguais. Escreva o texto do
`ValueError` para a pessoa ler: o que aconteceu e o que fazer. Para "não pode" sem chamar o
Python (botão de ação proibida, por exemplo), use `avisar("motivo")` de `src/lib/avisos.ts`.
