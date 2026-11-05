# 04 · Arquitetura: como as peças se ligam

> **Para a IA.** Leia antes de copiar o motor do sistema. Mostra o que acontece ao abrir o
> programa, onde cada tipo de código mora e como uma tela pede dados e mostra erros. O desenho é
> **o mesmo do Sistema Contábil Plus**: mesmas pastas, mesmo `app.py`, mesmas proteções.

Resumo: é um **programa de desktop**. O Python roda um servidor só para dentro do próprio
computador, e a janela do Windows (WebView2) mostra as telas React, que conversam com esse
servidor. Nada é site, nada sai da máquina.

## As pastas (iguais às do Plus)

```text
<projeto>/
  backend/
    app.py          entrada: trava, servidor, janela (mesmo desenho do backend/app.py do Plus)
    versao.py       a versão do sistema, escrita só aqui
    requirements.txt
    api/            portas FastAPI, uma por assunto (exemplo.py, janela.py)
    servicos/       regras tiradas das telas Qt, em Python puro
    esquemas/       formato dos dados que chegam (Pydantic)
    janela/         acoes.py, instancia.py, ponte.py (o que só o Windows faz)
    motor/          CÓPIA do motor do sistema antigo, mudando o mínimo
  frontend/         telas (src/rotas/<modulo>/, src/componentes/, src/lib/, src/tema/)
  assets/logo.ico   ícone da UP (programa e instalador)
  scripts/          ABRIR_NA_JANELA.bat, ABRIR_NO_NAVEGADOR.bat
  installer/        instalador.iss, GERAR_INSTALADOR.bat
  tests/            conftest.py, api/test_casca.py
  MeuSistema.spec   PyInstaller (na raiz, como o SistemaContabilPlus.spec)
  CLAUDE.md, AGENTS.md   regras do projeto (formato do Plus)
```

O **motor** fica em `backend/motor/`: é uma **cópia** do motor do sistema antigo (regras, banco,
leitura de arquivos), mudando o mínimo, como o Plus fez. O sistema antigo continua intocado na
pasta dele e segue sendo o oficial até a versão nova estar completa e testada na base de teste.

## O que acontece ao abrir

Arquivo: `modelo/backend/app.py` (função `main`).

```text
 MeuSistema.exe  (ou: python backend\app.py)
        │
        ▼
 0. BASE DE TESTE? Pelo código (não instalado), sem a variável MEU_SISTEMA_DADOS e sem --oficial,
    o programa NÃO abre (base_oficial_sem_pedido, regra do Plus): ninguém testa nos dados reais.
        │
        ▼
 1. TRAVA DE UMA CÓPIA (janela/instancia.py) ── já há outra aberta? ──► janelinha "já está aberto" e sai
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
 4. PYWEBVIEW abre a janela (WebView2), maximizada, fundo #2B2A28, no endereço:
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

### Os nomes do topo do `app.py`

| Nome | No modelo | No Plus | O que é |
|---|---|---|---|
| `NOME` | `"Meu Sistema"` | escrito direto: `"UP Contábil · Sistema Contábil"` | Título da janela (pode ter acento). |
| `PASTA` | `"MeuSistema"` | `SistemaContabilPlus` | Nome da pasta gravável em `%PROGRAMDATA%`: **sem acento nem espaço**. |
| `VAR_DADOS` | `"MEU_SISTEMA_DADOS"` | `SISTEMA_CONTABIL_DADOS` | A variável que aponta a base de teste. |
| `MAX_CORPO` | 60 MB | 60 MB | O maior envio aceito. |
| `_SENHA_NO_ENDERECO` | `^/api/arquivos/[^/]+$` | igual | Os únicos endereços que aceitam a senha em `?t=` (só em GET). |

### A pasta gravável e a base de teste

`pasta_gravavel()` em `app.py`: o valor da variável `MEU_SISTEMA_DADOS`, ou
`%PROGRAMDATA%\MeuSistema` se ela não existir. Guarda `programa_aberto.lock`, `porta.txt` e
`usuarios\<usuário do Windows>\janela` (dados do WebView2, por `pasta_do_usuario()` em
`janela/acoes.py`).

**O motor usa a MESMA variável para achar os dados dele**, como no Plus (lá,
`SISTEMA_CONTABIL_DADOS`). Assim a base de teste fica isolada por inteiro: config, trava, janela
e dados. Os atalhos `scripts\ABRIR_*.bat ficticia` definem
`MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_FICTICIO`; é ali (no bloco `:ficticia`) que se
aponta também o motor para a cópia de teste dos dados (no Plus: a pasta `Desktop\BANCO FICTICIO`).
Nunca a base oficial. Na cirurgia, troque `PASTA` e a variável pelo nome do sistema.

Os testes fazem o mesmo: `tests/conftest.py` define a variável para uma pasta temporária antes
de importar o `app`.

## Os jeitos de abrir

| Comando | Janela | Porta / senha | Uso |
|---|---|---|---|
| `python backend\app.py` | Janela própria (pywebview), maximizada, fundo `#2B2A28` para não piscar branco | porta lembrada ou sorteada / senha sorteada | Igual ao instalado. |
| `python backend\app.py --navegador` | Navegador padrão; a janela preta (console) fica aberta e fechar ela encerra | idem, e acrescenta `&m=navegador` ao endereço | PC sem WebView2, ou depurar no navegador. Liga as portas `/api/janela/*`. |
| `python backend\app.py --sem-janela` | Nenhuma (só servidor). Imprime o endereço de teste | **8765 / `dev`**. Sem trava. Docs em `/api/docs` | Testes automáticos e o Vite (`npm run dev`) com dados de teste. |
| `python backend\app.py --dev` | Janela própria abrindo **o Vite** (`http://localhost:5173`), com ferramentas de depuração | 8765 / senha sorteada | Mexer nas telas e ver na hora dentro da janela. Precisa do `npm run dev` rodando. |

Todos eles, **pelo código**, exigem a base de teste (`MEU_SISTEMA_DADOS` definida) ou o pedido
explícito `--oficial`. O jeito certo de abrir é pelos atalhos de `scripts/`, que já cuidam disso
(ver [11-instalador.md](11-instalador.md)):

- `scripts\ABRIR_NA_JANELA.bat ficticia` / `oficial`;
- `scripts\ABRIR_NO_NAVEGADOR.bat ficticia` / `oficial` / `teste` (servidor 8765, senha `dev`,
  sem abrir navegador) / `telas` (Vite em 5173 + Python de teste numa janela à parte).

`--dev` e `--sem-janela` ligam o modo `DEV` (`/api/docs` aberto e CORS liberado só para
`http://localhost:5173`).

No **modelo**, sem `#t=` no endereço (Vite ou `vite preview` sem Python), `src/api/exemplo.ts`
devolve os **dados inventados** de `src/dados/exemplo.ts` (ver `ABERTO_PELO_SISTEMA` abaixo).
Depois da cirurgia, as telas chamam o Python de teste direto (`cliente.ts` já aponta o Vite para
`127.0.0.1:8765` com a senha `dev`).

## As camadas

```text
 backend/motor/        regras antigas, banco, leitura de arquivos  (CÓPIA do motor do sistema antigo)
      ▲  importado por
 backend/servicos/     regras que estavam presas nas telas Qt, em funções Python puras
      ▲  chamado por
 backend/api/          portas FastAPI finas: validam a entrada (esquemas/) e repassam
      ▲  HTTP + X-Token
 frontend/src/api/*.ts uma função por porta (exemploApi.itens, exemploApi.salvar)
      ▲  useQuery / useMutation
 frontend/src/rotas/   as telas de cada módulo: só mostram e pedem
```

| Camada | Regra | Exemplo no modelo |
|---|---|---|
| `backend/motor/` | Cópia do motor antigo, mudando o mínimo. `app.py` põe `backend` e `backend/motor` no `sys.path`, então os `import` do motor continuam valendo (`import banco`, como era). Sem FastAPI, sem tela. | `motor/dados_exemplo.py` (faz o papel do motor na vitrine; apague na cirurgia) |
| `backend/servicos/` | As regras que estavam escritas dentro dos `QWidget` (validar, montar lista, decidir quem pode) viram funções aqui, com o **mesmo comportamento e as mesmas mensagens**. Sem Qt, sem FastAPI. Erro de regra = `raise ValueError("motivo para a pessoa ler")`. | `servicos/exemplo.py` (`listar`, `salvar`) |
| `backend/esquemas/` | O formato do que chega nas portas (`class NovoItem(BaseModel)`). | `esquemas/exemplo.py` |
| `backend/api/` | Uma porta por assunto (`APIRouter(prefix="/api/<assunto>")`). Valida com o esquema, chama o serviço, converte `ValueError` em `HTTPException(400, motivo)`. **Nada de regra aqui.** Registre em `criar_api` com `app.include_router(...)`. | `api/exemplo.py` |
| `frontend/src/api/*.ts` | Uma função por porta, usando `api.get/post/put/del` de `cliente.ts`. É o único lugar das telas que conhece endereços `/api/...`. | `src/api/exemplo.ts` |
| `frontend/src/rotas/<modulo>/` | Usam as funções acima com TanStack Query. Não fazem `fetch` direto e não repetem regra do Python (validação de formulário com Zod é só para ajudar a digitar; quem decide é o serviço). | `src/rotas/cadastro/TelaCadastro.tsx` |

Porta, esquema e serviço reais do modelo:

```python
# backend/api/exemplo.py
from esquemas.exemplo import NovoItem
from servicos import exemplo as S

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
import dados_exemplo  # o motor (backend/motor está no sys.path, como no Plus)

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
| Janela própria | `window.pywebview.api.<função>()` (classe `Ponte`, passada em `js_api`) | `backend/janela/ponte.py` (cópia do Plus) |
| `--navegador` | `POST /api/janela/escolher-pasta`, `/salvar-arquivo`, `/abrir-pasta`, `/abrir-arquivo`, `/abrir-link` (usa `tkinter` para as janelas) | `backend/api/janela.py` (só responde se `LIGADA["sim"]`; senão 404 "Só no modo navegador.") |
| Vite / navegador de teste | Nenhum: cai num substituto (`window.prompt`, download direto, `window.open`) | — |

O trabalho de verdade (abrir o Explorador, gravar o arquivo, lembrar a última pasta) fica em
`backend/janela/acoes.py`, usado pelos dois caminhos.

As telas chamam só `src/api/janela.ts` (cópia do Plus), que escolhe o caminho sozinho:

```ts
import { escolherPasta, salvarArquivo, abrirPastaDoArquivo, abrirArquivo, abrirLink, temJanela } from "@/api/janela";

const pasta = await escolherPasta();                       // '' = cancelou
const onde = await salvarArquivo("relatorio.xlsx", base64, "application/vnd.ms-excel");
if (onde && temJanela()) await abrirPastaDoArquivo(onde);  // «Abrir pasta» só quando há Windows por trás
```

Na janela própria o pywebview liga a ponte um instante depois de a tela abrir; `janela.ts`
espera o evento `pywebviewready` (até 5 s) antes de chamar. Na cirurgia, cada `QFileDialog`,
`QDesktopServices.openUrl` ou `os.startfile` das telas antigas vira uma dessas funções. Função
nova do Windows: só se o Plus também precisar (combine com o Levi); aí entra nos dois, no mesmo
formato (`Ponte`, `api/janela.py`, `janela.ts`).

## Proteções (não remova)

| Proteção | Onde | O que impede |
|---|---|---|
| Base oficial só com pedido | `app.py` (`base_oficial_sem_pedido`) | Pelo código, abrir os dados reais sem querer. Instalado (`.exe`) abre normal. |
| Servidor só em `127.0.0.1` | `app.py` (`uvicorn ... host="127.0.0.1"`) | Outro computador da rede usar a API. |
| Senha interna no cabeçalho `X-Token`, comparada com `hmac.compare_digest` | `app.py` (`exigir_token`) | Outro programa ou site aberto no mesmo PC chamar `/api`. Sem senha: 401 `{"detail": "sem permissão"}`. |
| Senha no endereço (`?t=`) só para `/api/arquivos/...` em GET | `app.py` (`_SENHA_NO_ENDERECO`) | `<img src>` não manda cabeçalho; nenhuma outra porta aceita senha no endereço. |
| `TrustedHostMiddleware` (`127.0.0.1`, `localhost`; `testserver` só durante o pytest) | `app.py` | Site malicioso que aponta o próprio nome para 127.0.0.1 (DNS rebinding). Responde 400. |
| Limite de 60 MB por envio (`MAX_CORPO`) | `app.py` | Travar o programa com envio gigante. Responde 413 com o motivo. |
| `Cache-Control: no-store` em toda resposta `/api` (e `cache: "no-store"` no `fetch`) | `app.py`, `cliente.ts` | Dado velho aparecer no lugar do novo. |
| Só arquivos de **dentro** de `dist` (`realpath` + `commonpath`) | `app.py` (`telas`) | Pedir `../../` ou `C:/...` e ler arquivos do PC. |
| `/api/docs` e `/api/openapi.json` só no modo `DEV` | `app.py` | Expor a lista de portas no programa instalado. |
| CORS só no modo `DEV` e só para o Vite | `app.py` | Outra origem chamar a API. |
| Lista branca de documentos para abrir (`DOCUMENTOS`: pdf, planilhas, textos, imagens, compactados...) | `janela/acoes.py` | Abrir pelo programa algo que roda código (`.exe`, `.bat`, `.url`...). |
| Explorador nunca nas pastas técnicas (`_pastas_tecnicas`: Windows, Arquivos de Programas, a pasta gravável...) | `janela/acoes.py` | A "última pasta" apontar para dentro do sistema. Acrescente ali a pasta da base do motor. |
| Links só `http://` e `https://` (`www.` vira `https://`) | `janela/acoes.py` e `src/api/janela.ts` | `javascript:`, `file:` e afins. |
| Portas `/api/janela/*` só no modo navegador | `api/janela.py` (`_exigir`) | Abrir diálogos do Windows a partir de chamada indevida. No Plus, `_exigir` também recusa quem não entrou (403). |

Os testes da casca ficam em `tests/api/test_casca.py` e conferem: sem senha não entra, lista com
senha, erro com motivo, endereço estranho barrado, senha no endereço só onde pode, e que pelo
código só abre a base de teste. Rode na pasta do projeto: `python -m pytest tests`.

## Como uma tela busca dados

`src/api/cliente.ts` (cópia do Plus) lê o endereço e a senha do `#` e oferece `api.get/post/put/del`:

```ts
const parametros = new URLSearchParams(window.location.hash.slice(1));
const API = parametros.get("api") ?? (window.location.port === "5173" ? "http://127.0.0.1:8765" : window.location.origin);
const TOKEN = parametros.get("t") ?? "dev";
export const MODO_NAVEGADOR = parametros.get("m") === "navegador";
export const ABERTO_PELO_SISTEMA = parametros.has("t");
```

Para imagem e anexo por endereço (`<img src>`), use `enderecoArquivo("/api/arquivos/...")`, que
acrescenta `?t=`.

`src/api/exemplo.ts` é o padrão de toda tela (com dado inventado quando não há Python):

```ts
export const exemploApi = {
  itens: () => (ABERTO_PELO_SISTEMA ? api.get<Item[]>("/api/exemplo/itens") : Promise.resolve(ITENS)),
  salvar: (item: Partial<Item>) =>
    ABERTO_PELO_SISTEMA ? api.post<{ ok: boolean }>("/api/exemplo/itens", item) : Promise.resolve({ ok: true }),
};
```

Na tela, com TanStack Query (`src/rotas/cadastro/TelaCadastro.tsx`):

```tsx
const q = useQuery({ queryKey: ["itens"], queryFn: exemploApi.itens });
// q.isLoading → <Esqueleto />   ·   lista vazia → <Vazio ... />   ·   senão, os cartões
```

Para gravar, use `useMutation` e, no sucesso, `queryClient.invalidateQueries({ queryKey: ["itens"] })`
para a lista recarregar. Configuração global em `src/main.tsx`: `retry: 1` e
`refetchOnWindowFocus: false`.

Na cirurgia, quando a tela já usa dados reais, o ramo `Promise.resolve(...)` com dado inventado
sai. Quem testa sem janela usa `scripts\ABRIR_NO_NAVEGADOR.bat teste` (porta 8765, senha `dev`,
base de teste).

## Como um erro vira balão

Regra do Plus: **nada falha calado**. O caminho é sempre o mesmo:

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
            unhandledrejection    → toast.error("Algo deu errado: <motivo>")
```

O `id: motivo` faz a mesma falha não empilhar vários balões iguais. Escreva o texto do
`ValueError` para a pessoa ler: o que aconteceu e o que fazer (as mesmas mensagens do sistema
antigo). Para "não pode" sem chamar o Python (botão de ação proibida, por exemplo), use
`avisar("motivo")` de `src/lib/avisos.ts`. Lista que falhou ao carregar pode usar
`useAvisoDeErro(q, "as empresas")`, do mesmo arquivo.
