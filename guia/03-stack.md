# 03 · Stack: bibliotecas e versões

> **Para a IA.** Esta é a lista fechada de peças da cirurgia. Use estas bibliotecas, nestas
> versões (ou mais novas e compatíveis), e nada além delas sem um motivo forte.

As versões abaixo são as que o modelo usa hoje (`modelo/backend/requirements.txt` e
`modelo/frontend/package.json`). **Versões mais novas compatíveis são aceitáveis** (mesma versão
principal, ou uma nova que não quebre a API usada). Se subir uma versão, rode o modelo e
confira as telas.

## Python (o programa e a janela)

Arquivo: `modelo/backend/requirements.txt`. Python 3.12 ou mais novo.

| Biblioteca | Versão | Para que serve | Onde aparece no modelo |
|---|---|---|---|
| `fastapi` | 0.143.3 | As "portas" que as telas chamam (`/api/...`). Valida a entrada e devolve JSON. | `backend/app.py` (`criar_api`), `backend/api/exemplo.py`, `backend/api/janela.py` |
| `uvicorn` | 0.54.0 | O servidor que roda o FastAPI dentro do programa, só em `127.0.0.1`. | `backend/app.py` (`main`, numa thread) |
| `pydantic` | 2.14.1 | Formato dos dados que chegam nas portas (`class NovoItem(BaseModel)`). | `backend/api/exemplo.py`, `backend/api/janela.py` |
| `pywebview` | 6.2.1 | Abre a **janela própria do Windows** usando o WebView2 (Edge embutido). Liga a ponte `js_api`. | `backend/app.py` (`webview.create_window`), `backend/janela/ponte.py` |
| `pyinstaller` | 6.21.0 | Junta Python + bibliotecas + telas numa pasta com o `.exe`. | `empacotar/programa.spec` |
| `pytest` | 9.0.1 | Testes da casca (senha interna, portas, erro com motivo). | `backend/teste_api.py` |
| `httpx` | 0.28.1 | Necessário para o `TestClient` do FastAPI nos testes. | `backend/teste_api.py` (indireto) |

Da biblioteca padrão do Python, o modelo ainda usa `tkinter` (janelas de escolher pasta e
"Salvar como" **só no modo navegador**, em `backend/api/janela.py`), `secrets`, `hmac`,
`socket` e `msvcrt`. Não exclua o `tkinter` do PyInstaller.

Fora do `requirements.txt`:

| Peça | Para que serve |
|---|---|
| `Pillow` | Só para gerar os GIFs das animações (`frontend/scripts/gif.py`). `pip install pillow`. Não vai no programa. |
| Inno Setup 6 | Transforma a pasta do PyInstaller num instalador `.exe` (`empacotar/instalador.iss`). |
| Node.js (LTS) | Instala e compila as telas (`npm ci`, `npm run build`). Só na máquina de quem gera o instalador. |
| WebView2 Runtime | O "motor" da janela. Já vem no Windows 10/11 atualizados. Ver [11-instalador.md](11-instalador.md). |

## Telas (TypeScript / npm)

Arquivo: `modelo/frontend/package.json`.

### Dependências do programa

| Pacote | Versão | Para que serve | Onde aparece no modelo |
|---|---|---|---|
| `react`, `react-dom` | ^19.3.1 | Base das telas. | tudo em `src/` |
| `@tanstack/react-query` | ^5.104.3 | Busca dados no Python, guarda em cache, mostra "carregando" e transforma erro em balão. | `src/main.tsx` (`QueryClient`, `QueryCache`), `src/telas/Lista.tsx` (`useQuery`) |
| `@tanstack/react-router` | ^1.170.45 | Navegação entre telas, com histórico **na memória** (o endereço da janela não muda). | `src/main.tsx` (`createMemoryHistory`, rotas `/` e `/app/$tela`) |
| `@tanstack/react-virtual` | ^3.14.21 | Tabela com milhares de linhas: só desenha as que aparecem. | `src/telas/Tabela.tsx` (`useVirtualizer`) |
| `react-hook-form` | ^7.90.0 | Formulários: guarda os valores, valida e marca os erros. | `src/telas/Formulario.tsx` (`useForm`, `Controller`) |
| `zod` | ^4.6.7 | As regras de cada campo do formulário, com a mensagem de erro em português. | `src/telas/Formulario.tsx` (`esquema`) |
| `@hookform/resolvers` | ^5.9.2 | Liga o Zod ao React Hook Form (`zodResolver`). | `src/telas/Formulario.tsx` |
| `@radix-ui/react-dialog` | ^1.3.1 | Janelas por cima da tela (foco preso, Esc, acessibilidade). | `src/componentes/ui/dialogo.tsx` (`Dialogo`) |
| `@radix-ui/react-popover` | ^1.3.1 | Caixas flutuantes: listas suspensas, calendário, menu «…», menu da conta. | `ui/lista.tsx`, `ui/seletor-data.tsx`, `ui/seletor-mes.tsx`, `ui/pecas.tsx` (`MenuSuspenso`), `layout/MenuLateral.tsx` |
| `@radix-ui/react-tooltip` | ^1.4.1 | Dicas ao passar o mouse. | `ui/pecas.tsx` (`Dica`), `layout/MenuLateral.tsx`, `src/main.tsx` (`Tooltip.Provider`) |
| `@radix-ui/react-checkbox` | ^1.4.1 | Caixa de marcar acessível. | `ui/marcadores.tsx` (`CaixaSelecao`) |
| `@radix-ui/react-slot` | ^1.5.0 | `asChild` do botão (o `Botao` veste outro elemento). | `ui/botao.tsx` |
| `motion` | ^14.3.0 | Animações com mola (menu, janelas, segmentado, cascata, entrada). Import: `motion/react`. | `src/tema/movimento.ts` e quase todos os componentes |
| `vaul` | ^1.1.2 | Gaveta lateral (ficha) que desliza e fecha arrastando. | `ui/dialogo.tsx` (`Gaveta`) |
| `cmdk` | ^1.1.1 | Busca rápida Ctrl+K (lista filtrável com teclado). | `layout/BuscaRapida.tsx` |
| `sonner` | ^2.0.8 | Balões de aviso (sucesso, erro, motivo). | `src/main.tsx` (`Toaster`), `src/lib/avisos.ts` |
| `lucide-react` | ^1.59.0 | Ícones de traço fino. | todos os componentes e `layout/telas.ts` |
| `class-variance-authority` | ^0.7.1 | Variantes e tamanhos do botão (`cva`). | `ui/botao.tsx` |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^3.7.0 | Função `cn()`: junta classes sem conflito (padrão do shadcn/ui). | `src/lib/utils.ts` |
| `@fontsource-variable/inter` | ^5.3.0 | A fonte Inter (variável, pesos 100–900) **dentro do programa**, sem internet. Licença SIL OFL dentro do pacote. | `src/main.tsx` (`import "@fontsource-variable/inter";`) |

### Ferramentas (devDependencies)

| Pacote | Versão | Para que serve | Onde aparece |
|---|---|---|---|
| `vite` | ^8.3.4 | Monta as telas (`npm run build` → `frontend/dist`) e serve no modo de desenvolvimento (porta 5173). | `vite.config.ts` |
| `@vitejs/plugin-react` | ^6.1.2 | React no Vite. | `vite.config.ts` |
| `tailwindcss` + `@tailwindcss/vite` | ^4.3.3 | Classes de estilo. Os tokens viram classes (`bg-superficie`, `rounded-cartao`...). | `src/index.css`, `src/tema/tokens.css` |
| `typescript` | ^7.0.2 | Checagem de tipos (`tsc -b` antes do build). | `tsconfig.json` |
| `@types/react`, `@types/react-dom`, `@types/node` | ^19.3.0 / ^26.6.5 | Tipos. | — |
| `playwright-core` | ^1.58.0 | Fotos e GIFs automáticos usando o Edge já instalado (não baixa navegador). | `scripts/fotografar.mjs` |

### Fonte

A fonte **Inter** vem do pacote npm `@fontsource-variable/inter`, importado uma vez em
`src/main.tsx`. O Vite copia os arquivos da fonte para `dist/` no build, então ela vai dentro do
programa e não depende de internet. O nome da família é `"Inter Variable"`, e o token
`--fonte` (em `src/tema/tokens.css`) é:

```css
--fonte: "Inter Variable", "Inter", -apple-system, "Segoe UI", system-ui, sans-serif;
```

Para trocar de fonte: instale outro pacote `@fontsource-variable/<nome>` (ou `@fontsource/<nome>`),
troque o `import` no `main.tsx` e o primeiro nome do `--fonte`. Não use Google Fonts por link
(o programa precisa abrir sem internet).

## O que NÃO usar

| Não use | Por quê |
|---|---|
| Electron, Tauri | Pesados e de outra stack. A janela já é o WebView2 do Windows via pywebview, com o motor em Python. |
| Django | Feito para site com banco e usuários na internet. Aqui o servidor é interno e mínimo: FastAPI basta. |
| pandas | Pesado no `.exe` e desnecessário para a casca. Se o motor antigo já usa, ele continua lá dentro; não traga para as telas nem para as portas. |
| CSS-in-JS (styled-components, Emotion) | Duplica o sistema de estilo e foge dos tokens. Tudo é classe Tailwind + tokens. |
| MUI, Ant Design, Bootstrap, Chakra | Dão "cara de template" e brigam com os tokens (cores, raios e sombras próprios). As peças do kit já cobrem o necessário. |
| Biblioteca de gráficos (Recharts, Chart.js...) para o básico | Os gráficos do kit são CSS puro (`componentes/graficos/graficos.tsx`): leves e seguem o tema sozinhos. Só considere uma biblioteca para algo que eles não fazem (ex.: linha do tempo com zoom). |
| `<select>`, `<input type="date">`, `window.confirm`, `alert` | Visual do Windows, fora do tema. Use `Escolha`/`Lista`, `SeletorData`, `confirmar()` e balões. |
| PyQt6/PySide6 dentro do programa novo | Depois da cirurgia o Qt sai. O `programa.spec` exclui `PyQt6`, `PySide6` e `qtpy`. |
