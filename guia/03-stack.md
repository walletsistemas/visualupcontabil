# 03 · Stack: bibliotecas e versões

> **Para a IA.** Esta é a lista fechada de peças, **a mesma do Sistema Contábil Plus**. Todo
> sistema interno da UP Contábil usa estas bibliotecas, nestas versões (ou mais novas e
> compatíveis, quando o Plus subir), e nada além delas sem um motivo forte combinado com o Levi.

Por que fechada: no futuro todos os sistemas serão unidos ao Plus. Biblioteca diferente vira
trabalho dobrado na hora de juntar. A stack **não varia** de sistema para sistema.

As versões abaixo são as que o modelo usa hoje (`modelo/backend/requirements.txt` e
`modelo/frontend/package.json`), iguais às do Plus. Se o Plus subir uma versão, suba aqui também
e confira as telas.

## Python (o programa e a janela)

Arquivo: `modelo/backend/requirements.txt`. Python **3.14**, o mesmo do Plus.

| Biblioteca | Versão | Para que serve | Onde aparece no modelo |
|---|---|---|---|
| `fastapi` | 0.143.3 | As "portas" que as telas chamam (`/api/...`). Valida a entrada e devolve JSON. | `backend/app.py` (`criar_api`), `backend/api/exemplo.py`, `backend/api/janela.py` |
| `uvicorn` | 0.54.0 | O servidor que roda o FastAPI dentro do programa, só em `127.0.0.1`. | `backend/app.py` (`main`, numa thread) |
| `pydantic` | 2.14.1 | Formato dos dados que chegam nas portas. | `backend/esquemas/exemplo.py` (`NovoItem`), `backend/api/janela.py` |
| `pywebview` | 6.2.1 | Abre a **janela própria do Windows** usando o WebView2 (Edge embutido). Liga a ponte `js_api`. | `backend/app.py` (`webview.create_window`), `backend/janela/ponte.py` |
| `pyinstaller` | 6.21.0 | Junta Python + bibliotecas + telas numa pasta com o `.exe`. | `MeuSistema.spec` (na raiz do projeto) |
| `pytest` | 9.0.1 | Testes da casca (senha interna, portas, erro com motivo, base de teste). | `tests/conftest.py`, `tests/api/test_casca.py` |
| `httpx` | 0.28.1 | Necessário para o `TestClient` do FastAPI nos testes. | `tests/api/test_casca.py` (indireto) |

As bibliotecas do **motor** (o que o sistema antigo já usava; no Plus, `pdfplumber`, `pymupdf`,
`openpyxl`...) entram no mesmo `requirements.txt`, acima das da casca, como no Plus.

Da biblioteca padrão do Python, o modelo ainda usa `tkinter` (janelas "Escolher pasta" e
"Salvar como" **só no modo navegador**, em `backend/janela/acoes.py`), `secrets`, `hmac`,
`socket` e `msvcrt`. O `MeuSistema.spec` deixa o `tkinter` fora do `.exe`, porque o modo
navegador só é usado pelo código (ver [11-instalador.md](11-instalador.md)).

Fora do `requirements.txt`:

| Peça | Para que serve |
|---|---|
| `Pillow` | Só para gerar os GIFs das animações (`frontend/scripts/gif.py`). `pip install pillow`. Não vai no programa. |
| Inno Setup 6 | Transforma a pasta do PyInstaller num instalador `.exe` (`installer/instalador.iss`). |
| Node.js (LTS) | Instala e compila as telas (`npm ci`, `npm run build`). Só na máquina de quem gera o instalador. |
| WebView2 Runtime | O "motor" da janela. Já vem no Windows 10/11 atualizados. Ver [11-instalador.md](11-instalador.md). |

## Telas (TypeScript / npm)

Arquivo: `modelo/frontend/package.json`.

### Dependências do programa

| Pacote | Versão | Para que serve | Onde aparece no modelo |
|---|---|---|---|
| `react`, `react-dom` | ^19.3.1 | Base das telas. | tudo em `src/` |
| `@tanstack/react-query` | ^5.104.3 | Busca dados no Python, guarda em cache, mostra "carregando" e transforma erro em balão. | `src/main.tsx` (`QueryClient`, `QueryCache`), `src/rotas/cadastro/TelaCadastro.tsx` (`useQuery`) |
| `@tanstack/react-router` | ^1.170.45 | Navegação entre módulos, com histórico **na memória** (o endereço da janela não muda). | `src/main.tsx` (`createMemoryHistory`, rotas `/` e `/app/$modulo`) |
| `@tanstack/react-virtual` | ^3.14.21 | Tabela com milhares de linhas: só desenha as que aparecem. | `src/rotas/tabela/TelaTabela.tsx` (`useVirtualizer`) |
| `react-hook-form` | ^7.90.0 | Formulários: guarda os valores, valida e marca os erros. | `src/rotas/formulario/TelaFormulario.tsx` (`useForm`, `Controller`) |
| `zod` | ^4.6.7 | As regras de cada campo do formulário, com a mensagem de erro em português. | `TelaFormulario.tsx` (`esquema`) |
| `@hookform/resolvers` | ^5.9.2 | Liga o Zod ao React Hook Form (`zodResolver`). | `TelaFormulario.tsx` |
| `@radix-ui/react-dialog` | ^1.3.1 | Janelas por cima da tela (foco preso, Esc, acessibilidade). | `componentes/ui/dialogo.tsx` (`Dialogo`) |
| `@radix-ui/react-popover` | ^1.3.1 | Caixas flutuantes: listas suspensas, calendário, competência, menu «…», menu da conta. | `ui/lista.tsx`, `ui/seletor-data.tsx`, `ui/seletor-competencia.tsx`, `ui/pecas.tsx` (`MenuSuspenso`), `layout/MenuLateral.tsx` |
| `@radix-ui/react-tooltip` | ^1.4.1 | Dicas ao passar o mouse. | `ui/pecas.tsx` (`Dica`), `layout/MenuLateral.tsx`, `src/main.tsx` (`Tooltip.Provider`) |
| `@radix-ui/react-checkbox` | ^1.4.1 | Caixa de marcar acessível. | `ui/caixa-selecao.tsx` (`CaixaSelecao`) |
| `@radix-ui/react-slot` | ^1.5.0 | `asChild` do botão (o `Botao` veste outro elemento). | `ui/botao.tsx` |
| `motion` | ^14.3.0 | Animações com mola (menu, janelas, segmentado, cascata, entrada). Import: `motion/react`. | `src/tema/movimento.ts` e quase todos os componentes |
| `vaul` | ^1.1.2 | Gaveta lateral (ficha) que desliza e fecha arrastando. | `ui/gaveta.tsx` (`Gaveta`) |
| `cmdk` | ^1.1.1 | Busca rápida Ctrl+K (lista filtrável com teclado). | `layout/BuscaRapida.tsx` |
| `sonner` | ^2.0.8 | Balões de aviso (sucesso, erro, motivo). | `src/main.tsx` (`Toaster`), `src/lib/avisos.ts` |
| `lucide-react` | ^1.59.0 | Ícones de traço fino. | todos os componentes e `layout/modulos.ts` |
| `class-variance-authority` | ^0.7.1 | Variantes e tamanhos do botão (`cva`). | `ui/botao.tsx` |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^3.7.0 | Função `cn()`: junta classes sem conflito (padrão do shadcn/ui). | `src/lib/utils.ts` |
| `@fontsource-variable/inter` | ^5.3.0 | A fonte Inter (variável, pesos 100–900) **dentro do programa**, sem internet. Licença SIL OFL dentro do pacote. | `src/main.tsx` (`import "@fontsource-variable/inter";`) |

O Plus ainda tem `dompurify` (limpa o HTML dos e-mails, um módulo só de lá). Entra num sistema
só se ele também mostrar HTML vindo de fora.

### Ferramentas (devDependencies)

| Pacote | Versão | Para que serve | Onde aparece |
|---|---|---|---|
| `vite` | ^8.3.4 | Monta as telas (`npm run build` → `frontend/dist`) e serve no modo de desenvolvimento (porta 5173). | `vite.config.ts` |
| `@vitejs/plugin-react` | ^6.1.2 | React no Vite. | `vite.config.ts` |
| `tailwindcss` + `@tailwindcss/vite` | ^4.3.3 | Classes de estilo. Os tokens de cor viram classes (`bg-superficie`, `text-verde-texto`...). | `src/index.css` |
| `typescript` | ^7.0.2 | Checagem de tipos (`tsc -b` antes do build). | `tsconfig.json` |
| `@types/react`, `@types/react-dom`, `@types/node` | ^19.3.0 / ^26.6.5 | Tipos. | — |
| `playwright-core` | ^1.58.0 | Fotos e GIFs automáticos usando o Edge já instalado (não baixa navegador). Só do kit. | `scripts/fotografar.mjs` |

O Plus também tem `vitest` (testes das telas). Previstos no Plus e ainda não instalados lá: AG
Grid, Recharts e Playwright de telas. Quando entrarem no Plus, entram nos outros sistemas do
mesmo jeito.

### Fonte

A fonte é a **Inter**, em todos os sistemas. No modelo ela vem do pacote npm
`@fontsource-variable/inter`, importado uma vez em `src/main.tsx` (no Plus vem de
`public/fontes/Inter.ttf`; é a mesma fonte e o mesmo visual). O Vite copia os arquivos para
`dist/`, então ela vai dentro do programa e não depende de internet. A família fica em
`src/index.css`, no bloco `@theme inline`:

```css
--font-sans: "Inter Variable", "Inter", -apple-system, "Segoe UI", system-ui, sans-serif;
```

Não troque a fonte e não use Google Fonts por link (o programa precisa abrir sem internet).

## O que NÃO usar

| Não use | Por quê |
|---|---|
| Electron, Tauri | Decisão tomada no Plus: a janela é o WebView2 do Windows via pywebview, com o motor em Python. |
| Django | Feito para site com banco e usuários na internet. Aqui o servidor é interno e mínimo: FastAPI basta. |
| pandas | Pesado no `.exe` e fora da stack do Plus. Se o motor antigo já usa, converse com o Levi antes de levar. |
| CSS-in-JS (styled-components, Emotion) | Duplica o sistema de estilo. Tudo é classe Tailwind + os tokens do `index.css`. |
| MUI, Ant Design, Bootstrap, Chakra | Outra cara, outras peças: quebraria a casca igual à do Plus. As peças do kit (as mesmas do Plus) cobrem o necessário. |
| Biblioteca de gráficos para o básico | Os gráficos do kit são CSS puro (`componentes/graficos/graficos.tsx`): leves e seguem o tema sozinhos. Recharts só quando o Plus adotar. |
| `<select>`, `<input type="date">`, `window.confirm`, `alert` | Visual do Windows, fora do padrão. Use `Escolha`/`Lista`, `SeletorData`, `confirmar()` e balões. |
| PyQt6/PySide6 dentro do programa novo | O Qt sai na cirurgia. O `MeuSistema.spec` exclui `PyQt6`, `PySide6` e `qtpy`. |
