# 11 · Do código ao instalador

> **Para a IA.** Como abrir o programa durante o trabalho, montar as telas, gerar o `.exe` com o
> PyInstaller, gerar o instalador com o Inno Setup e fotografar o resultado. Gere e entregue o
> instalador só quando o usuário pedir.

Os nomes do modelo ("Meu Sistema", `MeuSistema.exe`, `MEU_SISTEMA_DADOS`) são **exemplo**. Na
cirurgia, troque pelo nome que saiu da entrevista (lista no fim do capítulo).

## Abrir durante o trabalho: `modelo/ABRIR.bat`

| Comando | O que faz |
|---|---|
| `ABRIR.bat` | Janela própria, como o instalado. Monta as telas (`npm run build`) e roda `python backend\app.py`. |
| `ABRIR.bat navegador` | As telas no navegador padrão (`python backend\app.py --navegador`). |
| `ABRIR.bat vitrine` | As telas no Vite (`npm run dev`, `http://localhost:5173`), recarregando ao salvar o código, e o **Python de teste** (`--sem-janela`, porta 8765, senha `dev`) numa janela à parte. No modelo, as telas de exemplo usam os dados inventados mesmo sem Python. |

Na primeira vez, ele instala sozinho as bibliotecas das telas (`npm install`) e do Python
(`pip install -r backend\requirements.txt`). Sempre define
`MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_TESTE`, para trava, porta e dados da janela de teste
não se misturarem com o programa instalado. ⚠ Essa variável **não** protege os dados do
motor: acrescente no `ABRIR.bat` a variável (ou config) que aponta o motor para uma **cópia**
dos dados, nunca os reais (ver [05](05-migrar-do-pyqt.md), Passo 2).

Outros jeitos (direto pelo Python, ver [04-arquitetura.md](04-arquitetura.md)):

```bat
cd modelo
python backend\app.py --sem-janela   :: servidor de teste: porta 8765, senha "dev"
python backend\app.py --dev          :: janela abrindo o Vite (rode "npm run dev" em frontend\ antes)
python -m pytest backend\teste_api.py
```

## Montar as telas: `npm run build`

Em `modelo/frontend/`:

```bat
npm run build
```

Roda `tsc -b` (checa os tipos; erro aqui para tudo) e `vite build`, que gera `frontend/dist/`
(o `index.html`, `assets/` com JS, CSS e a fonte Inter). O Python serve essa pasta. Sem `dist`,
o programa abre com o aviso "As telas não foram montadas (rode npm run build em frontend/)."

## O `.exe`: PyInstaller com `empacotar/programa.spec`

Rode da pasta `modelo/`:

```bat
python -m PyInstaller empacotar\programa.spec --noconfirm --distpath dist --workpath build
```

O que o `programa.spec` faz:

| Parte | Valor | Por quê |
|---|---|---|
| Entrada | `..\backend\app.py` | O programa começa no `app.py`. |
| `pathex` | `..\backend`, `..` | A casca e a raiz do projeto (onde o motor antigo continua). |
| `datas` | `("..\frontend\dist", "telas")` | As telas vão junto, em `_internal\telas` (é onde `pasta_telas()` procura quando roda como `.exe`). |
| `hiddenimports` | `collect_submodules` de `api`, `servicos`, `janela` (acrescente o pacote do motor antigo, ex.: `"motor"`) | Leva todos os módulos, mesmo os importados de jeito que o PyInstaller não enxerga. |
| `excludes` | `pytest`, `PyQt6`, `PySide6`, `qtpy` | **O Qt saiu na cirurgia**: não leve ~100 MB à toa. Se o motor antigo ainda importa Qt em algum canto, isso aparece aqui como erro: recorte essa parte antes. Não exclua `tkinter` (usado no modo navegador). |
| `name` | `"MeuSistema"` (no `EXE` e no `COLLECT`) | Nome do `.exe` e da pasta. |
| `console` | `False` | Sem janela preta. |
| `icon` | comentado: `# icon=["..\\assets\\logo.ico"]` | Para ter ícone, crie `modelo/assets/logo.ico` e descomente. |

Resultado: `modelo/dist/MeuSistema/MeuSistema.exe` e a pasta `_internal/`. Teste abrindo esse
`.exe` antes de gerar o instalador.

Se o motor tem arquivos de dados (modelos, planilhas-base, OCR), acrescente cada pasta em `datas`
e leia com o mesmo esquema do `pasta_telas()` (`sys._MEIPASS` quando congelado).

## O instalador: Inno Setup com `empacotar/instalador.iss`

Precisa do **Inno Setup 6** (`winget install JRSoftware.InnoSetup`). O `.iss` transforma a pasta
do PyInstaller num instalador em português.

**Troque antes da primeira entrega:**

| Linha | O que pôr |
|---|---|
| `#define MyAppName "Meu Sistema"` | Nome do programa (aparece no instalador, no menu Iniciar e no atalho). |
| `#define MyAppPublisher ...` | Quem publica (também vira a pasta: `{autopf}\<publicador>\<programa>`). |
| `#define MyAppExeName "MeuSistema.exe"` | O nome do `.exe` do `programa.spec` + `.exe`. |
| `AppId={{00000000-0000-0000-0000-000000000000}` | **Um GUID novo** (Inno Setup → *Tools → Generate GUID*, ou `[guid]::NewGuid()` no PowerShell). Mantenha a chave dupla `{{` no começo. |
| `OutputBaseFilename=MeuSistema_Setup` | Nome do arquivo do instalador. |
| `Source: "..\dist\MeuSistema\*"` | A pasta gerada pelo PyInstaller. |

**O `AppId` nunca muda depois da primeira instalação.** É por ele que o Windows sabe que a versão
nova é o mesmo programa (atualiza no lugar). Mudou o `AppId` = o Windows acha que é outro
programa e instala dois.

O resto do `.iss` já está pronto:

- Versão: `MyAppVersion` (padrão `"1.0.0"`), pode vir de fora: `ISCC /DMyAppVersion=1.2.0 empacotar\instalador.iss`.
  Mantenha igual à versão mostrada na tela de entrada (no modelo, o texto `v1.0.0` em `telas/Entrada.tsx`).
- Instala em `Arquivos de Programas`, pede administrador, 64 bits, compressão `lzma2`.
- Tarefa "Criar um atalho na Área de Trabalho" (marcada na primeira vez).
- `CloseApplications=force`: fecha o programa aberto antes de atualizar.
- `[InstallDelete]` apaga `{app}\_internal` antes de copiar: versão nova não deixa biblioteca velha sobrando.
- No fim, oferece "Abrir o <programa> agora".

Saída: `modelo/empacotar/Output/MeuSistema_Setup.exe` (a pasta `Output/` está no `.gitignore`).

## Tudo de uma vez: `empacotar/GERAR_INSTALADOR.bat`

Duplo clique (ou rodar de qualquer pasta: ele vai para `modelo/` sozinho). Leva de 3 a 10 minutos.

| Passo | Comando | Para com erro se... |
|---|---|---|
| Checagem | `python --version`, `node --version`, procura o `ISCC.exe` do Inno Setup 6 em `Program Files (x86)`, `Program Files` e `%LOCALAPPDATA%\Programs` | falta Python, Node.js ou Inno Setup (mostra onde baixar). |
| [1/4] Bibliotecas | `python -m pip install -r backend\requirements.txt` e, em `frontend\`, `npm ci` | a instalação falha. |
| [2/4] Telas | `npm run build` | erro de tipo ou de build. |
| [3/4] Programa (.exe) | `python -m PyInstaller empacotar\programa.spec --noconfirm --distpath dist --workpath build` | falta módulo, Qt ainda importado... |
| [4/4] Instalador | `"%ISCC%" empacotar\instalador.iss` | erro no `.iss`. |

No fim: `PRONTO: empacotar\Output\MeuSistema_Setup.exe`. Qualquer erro: "Parou com erro (veja a
mensagem acima). Nada foi publicado."

Antes de rodar, **feche** o Vite (`npm run dev`), o `vite preview` e o programa aberto: o `npm ci`
apaga e recria `node_modules` e falha se algum arquivo estiver em uso.

Gerar o instalador não publica nada: o arquivo fica na pasta. Instalar nas máquinas de outras
pessoas ou colocar numa pasta de atualização é decisão do usuário, a cada vez.

## WebView2

A janela usa o **Microsoft Edge WebView2 Runtime**. Ele já vem no Windows 11 e no Windows 10
atualizado, e se atualiza sozinho com o Windows Update. Em máquina antiga ou sem atualização, a
janela não abre direito: instale o "WebView2 Runtime" (versão *Evergreen*) do site da Microsoft,
ou use `python app.py --navegador` / o atalho de navegador enquanto isso.

O programa grava os dados da janela (`localStorage`: tema, menu, preferências) em
`<pasta gravável>\janela` (`storage_path` em `app.py`), não no perfil do Edge.

## Fotografar o próprio sistema: `npm run fotos`

O script `modelo/frontend/scripts/fotografar.mjs` tira as fotos (claro e escuro), as fotos dos
estilos prontos e os GIFs, usando o **Edge já instalado** (`playwright-core` com
`channel: "msedge"`; não baixa navegador).

```bat
cd modelo\frontend
npm run build
npx vite preview --port 4173      :: deixe rodando neste terminal
```

Em outro terminal, em `modelo\frontend`:

```bat
npm run fotos                     :: tudo
set SO=fotos&& npm run fotos      :: só as fotos (cmd)
```

```powershell
$env:SO = "estilos"; npm run fotos   # só os estilos prontos (PowerShell)
```

| `SO` | Gera | Em |
|---|---|---|
| (vazio) | tudo abaixo | |
| `fotos` | cada tela e peça, claro e escuro (1440 × 900) | `imagens/claro/`, `imagens/escuro/` |
| `estilos` | cada arquivo de `estilos-prontos/` aplicado no painel e no cadastro, claro e escuro | `imagens/estilos/` |
| `animacoes` | 4 GIFs (fotografa sem parar enquanto um roteiro clica e junta com `scripts/gif.py`) | `imagens/animacoes/` |

Precisa: Edge, o `vite preview` na porta 4173 (ou outro endereço em `VITRINE`), e, para os GIFs,
Python com **Pillow** (`pip install pillow`).

**Para fotografar o sistema da pessoa depois da cirurgia:**

1. Troque a lista `TELAS` (chave da tela → nome do arquivo) e os roteiros (`fotos`, `videos`)
   pelos passos das telas novas. O script acha as coisas por textos e rótulos (`placeholder="Usuário"`,
   `aria-label^="Conta de"`, botões "Abrir janela"...): ajuste para os rótulos novos.
2. Se as telas precisam do Python para ter dados, rode `python backend\app.py --sem-janela`
   (apontado para dados de teste) e use `VITRINE=http://127.0.0.1:8765`: sem senha no endereço, as
   telas usam a senha `dev` desse modo.
3. As fotos abrem cada tela com `?tela=<chave>` e guardam o tema em `localStorage` antes de abrir.

## Nomes para trocar na cirurgia

| Arquivo | O quê |
|---|---|
| `backend/app.py` | `NOME = "Meu Sistema"` (pode ter acento), `PASTA = "MeuSistema"` (nome da pasta: **sem acento nem espaço**), a variável `MEU_SISTEMA_DADOS`, `background_color="#F4F0EA"` (= `--fundo` claro) |
| `ABRIR.bat` | `MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_TESTE` |
| `frontend/index.html` | `<title>Meu Sistema</title>` |
| `frontend/src/componentes/layout/MenuLateral.tsx` | Nome e subtítulo da marca; `Marca` pelo logo |
| `frontend/src/telas/Entrada.tsx` | Nome em caixa alta e a versão `v1.0.0` |
| `empacotar/programa.spec` | `name="MeuSistema"` (duas vezes), ícone |
| `empacotar/instalador.iss` | `MyAppName`, `MyAppPublisher`, `MyAppExeName`, `AppId`, `OutputBaseFilename`, `Source` |
| `empacotar/GERAR_INSTALADOR.bat` | A mensagem final com o nome do instalador |
