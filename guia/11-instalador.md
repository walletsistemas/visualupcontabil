# 11 · Do código ao instalador

> **Para a IA.** Como abrir o programa durante o trabalho, montar as telas, gerar o `.exe` com o
> PyInstaller, gerar o instalador com o Inno Setup e fotografar o resultado. Tudo no mesmo
> formato do Sistema Contábil Plus (`scripts/`, `installer/`, `.spec` na raiz). **Gerar não é
> publicar:** gere o instalador só quando o Levi pedir, e instalar ou publicar atualização só
> com pedido explícito dele, a cada vez.

Os nomes do modelo ("Meu Sistema", `MeuSistema.exe`, `MEU_SISTEMA_DADOS`) são **exemplo**. Na
cirurgia, troque pelo nome do sistema (lista no fim do capítulo). O publicador e o ícone são
sempre os da UP Contábil.

## Abrir durante o trabalho: `scripts/`

Dois atalhos, iguais aos do Plus. Sem argumento (duplo clique), perguntam: **1 = base fictícia
(teste)** ou **2 = base oficial**.

| Comando | O que faz |
|---|---|
| `scripts\ABRIR_NA_JANELA.bat ficticia` | Janela própria, como o instalado, na **base de teste**. |
| `scripts\ABRIR_NA_JANELA.bat oficial` | Janela própria na base oficial (passa `--oficial`). Só com certeza. |
| `scripts\ABRIR_NO_NAVEGADOR.bat ficticia` | As telas no navegador padrão (`--navegador`), base de teste. Fechar a janela preta encerra. |
| `scripts\ABRIR_NO_NAVEGADOR.bat oficial` | Idem, na base oficial. |
| `scripts\ABRIR_NO_NAVEGADOR.bat teste` | **Para a IA testar**: base de teste, servidor fixo na porta **8765** com senha interna **`dev`**, sem abrir navegador (`--sem-janela`). |
| `scripts\ABRIR_NO_NAVEGADOR.bat telas` | As telas no Vite (`http://localhost:5173`), recarregando ao salvar o código, + o Python de teste (`--sem-janela`) numa janela à parte. Só do kit. |

Todos, antes de abrir: conferem Python e Node.js, instalam as bibliotecas na primeira vez
(`pip install -r backend\requirements.txt`, `npm install`) e montam as telas (`npm run build`).

A base de teste é o bloco `:ficticia` dos dois `.bat`: define
`MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_FICTICIO`. O motor usa **a mesma variável** para
achar os dados dele (isolamento total, como no Plus; ver [04-arquitetura.md](04-arquitetura.md)).
Se o motor precisa de mais alguma coisa para apontar a cópia de teste (no Plus, a pasta
`Desktop\BANCO FICTICIO`), acrescente nesse bloco. Nunca a base oficial.

Pelo código, sem essa variável e sem `--oficial`, o `app.py` **se recusa a abrir**
(`base_oficial_sem_pedido`): rodar `python backend\app.py` "solto" não cai nos dados reais.

Rodar à mão (com a variável já definida):

```bat
set MEU_SISTEMA_DADOS=%LOCALAPPDATA%\MeuSistema_FICTICIO
python backend\app.py --sem-janela   :: servidor de teste: porta 8765, senha "dev"
python backend\app.py --dev          :: janela abrindo o Vite (rode "npm run dev" em frontend\ antes)
python -m pytest tests               :: os testes já usam uma pasta temporária sozinhos
```

## Montar as telas: `npm run build`

Em `frontend/`:

```bat
npm run build
```

Roda `tsc -b` (checa os tipos; erro aqui para tudo) e `vite build`, que gera `frontend/dist/`
(o `index.html`, `assets/` com JS, CSS e a fonte Inter). O Python serve essa pasta. Sem `dist`,
o programa responde "As telas não foram montadas (frontend/dist)."

## O `.exe`: PyInstaller com `MeuSistema.spec`

O `.spec` fica **na raiz do projeto**, como o `SistemaContabilPlus.spec`. Rode da raiz:

```bat
python -m PyInstaller MeuSistema.spec --noconfirm
```

O que o `MeuSistema.spec` faz:

| Parte | Valor | Por quê |
|---|---|---|
| Entrada | `backend\app.py` | O programa começa no `app.py`. |
| `pathex` | `backend`, `backend\motor` | A casca e o motor copiado (os mesmos do `sys.path` do `app.py`). |
| `datas` | `('frontend/dist', 'telas')`, `('assets/logo.ico', '.')` | As telas vão junto, em `_internal\telas` (é onde `pasta_telas()` procura no `.exe`), e o ícone. |
| `hiddenimports` | `versao` + `collect_submodules` de `api`, `servicos`, `esquemas`, `janela` | Leva todos os módulos. Acrescente os pacotes do motor (no Plus: `core`, `db`, `parsers`, `engine`). |
| `excludes` | `tkinter`, `pytest`, `PyQt6`, `PySide6`, `qtpy` | `tkinter` só serve ao modo navegador (pelo código); **o Qt saiu na cirurgia**: não leve ~100 MB à toa. Se o motor ainda importa Qt em algum canto, aparece aqui como erro: recorte essa parte antes. |
| `name` | `'MeuSistema'` (no `EXE` e no `COLLECT`) | Nome do `.exe` e da pasta. |
| `console` | `False` | Sem janela preta. |
| `icon` | `assets\logo.ico` | O ícone da UP. |

Resultado: `dist\MeuSistema\MeuSistema.exe` e a pasta `_internal\` (na raiz do projeto). Teste
abrindo esse `.exe` antes de gerar o instalador.

Se o motor tem arquivos de dados (modelos, planilhas-base, OCR), acrescente cada pasta em `datas`
(no Plus: `assets/config.ini`, `assets/ocr_dados`, `assets/fontes`) e leia com o mesmo esquema do
`pasta_telas()` (`sys._MEIPASS` quando congelado).

## O instalador: Inno Setup com `installer/instalador.iss`

Precisa do **Inno Setup 6** (`winget install JRSoftware.InnoSetup`). O `.iss` (mesmo formato do
`installer\instalador.iss` do Plus) transforma a pasta do PyInstaller num instalador em
português, com o ícone da UP.

**Troque antes da primeira entrega:**

| Linha | O que pôr |
|---|---|
| `#define MyAppName "Meu Sistema"` | Nome do sistema (aparece no instalador, no menu Iniciar e no atalho). |
| `#define MyAppPublisher "UP Contábil"` | **Não troque.** Também vira a pasta: `{autopf}\UP Contábil\<sistema>`. |
| `#define MyAppExeName "MeuSistema.exe"` | O `name` do `.spec` + `.exe`. |
| `AppId={{00000000-0000-0000-0000-000000000000}` | **Um GUID novo** (Inno Setup → *Tools → Generate GUID*, ou `[guid]::NewGuid()` no PowerShell). Mantenha a chave dupla `{{` no começo. |
| `OutputBaseFilename=MeuSistema_Setup` | Nome do arquivo do instalador. |
| `Source: "..\dist\MeuSistema\*"` | A pasta gerada pelo PyInstaller. |

`SetupIconFile=..\assets\logo.ico` já aponta o ícone da UP.

**O `AppId` nunca muda depois da primeira instalação.** É por ele que o Windows sabe que a versão
nova é o mesmo programa (atualiza no lugar). Mudou o `AppId` = o Windows acha que é outro
programa e instala dois.

O resto do `.iss` já está pronto:

- Versão: `MyAppVersion` (padrão `"1.0.0"`), pode vir de fora: `ISCC /DMyAppVersion=1.2.0 installer\instalador.iss`.
  A fonte da versão é `backend/versao.py` (regra do Plus); o `.iss` e o texto `v1.0.0` da tela de
  entrada (`rotas/login/TelaLogin.tsx`) precisam bater com ele.
- Instala em `Arquivos de Programas`, pede administrador, 64 bits, compressão `lzma2`.
- Tarefa "Criar um atalho na Área de Trabalho" (marcada na primeira vez).
- `CloseApplications=force`: fecha o programa aberto antes de atualizar.
- `[InstallDelete]` apaga `{app}\_internal` antes de copiar: versão nova não deixa biblioteca velha sobrando.
- No fim, oferece "Abrir o <sistema> agora".

Saída: `installer\Output\MeuSistema_Setup.exe` (a pasta `installer/Output/` está no `.gitignore`).

## Tudo de uma vez: `installer/GERAR_INSTALADOR.bat`

Duplo clique (ou rodar de qualquer pasta: ele vai para a raiz do projeto sozinho). Leva de 3 a
10 minutos.

| Passo | Comando | Para com erro se... |
|---|---|---|
| Checagem | `python --version`, `node --version`, procura o `ISCC.exe` do Inno Setup 6 em `Program Files (x86)`, `Program Files` e `%LOCALAPPDATA%\Programs` | falta Python, Node.js ou Inno Setup (mostra onde baixar). |
| [1/5] Bibliotecas | `python -m pip install -r backend\requirements.txt` e, em `frontend\`, `npm ci` | a instalação falha. |
| [2/5] Testes | `python -m pytest tests -q` (base temporária, nada real é tocado) | algum teste falha. |
| [3/5] Telas | `npm run build` | erro de tipo ou de build. |
| [4/5] Programa (.exe) | `python -m PyInstaller MeuSistema.spec --noconfirm` | falta módulo, Qt ainda importado... |
| [5/5] Instalador | `"%ISCC%" installer\instalador.iss` | erro no `.iss`. |

No fim: `PRONTO: installer\Output\MeuSistema_Setup.exe` e o lembrete "Gerar nao e publicar:
instalar nas maquinas do escritorio so com pedido explicito." Qualquer erro: "Parou com erro
(veja a mensagem acima). Nada foi publicado."

Antes de rodar, **feche** o Vite (`npm run dev`, inclusive o do `ABRIR_NO_NAVEGADOR.bat telas`),
o `vite preview` e o programa aberto: o `npm ci` apaga e recria `node_modules` e falha se algum
arquivo estiver em uso.

### Gerar não é publicar

Gerar o instalador não instala nada em lugar nenhum: o arquivo só fica em `installer\Output\`.
Instalar nas máquinas do escritório ou colocar numa pasta de atualização (no Plus,
`<base>\atualizacao`) é **publicar**, e publicar só acontece com **pedido explícito do Levi, a
cada vez**. Um "pode gerar" não é um "pode publicar".

## WebView2

A janela usa o **Microsoft Edge WebView2 Runtime**. Ele já vem no Windows 11 e no Windows 10
atualizado, e se atualiza sozinho com o Windows Update. Em máquina antiga ou sem atualização, a
janela não abre direito: instale o "WebView2 Runtime" (versão *Evergreen*) do site da Microsoft,
ou use `scripts\ABRIR_NO_NAVEGADOR.bat` enquanto isso.

O programa grava os dados da janela (`localStorage`: tema, menu, preferências) em
`<pasta gravável>\usuarios\<usuário do Windows>\janela` (`storage_path` em `app.py`), não no
perfil do Edge.

## Fotografar o próprio sistema: `npm run fotos`

O script `frontend/scripts/fotografar.mjs` tira as fotos (claro e escuro) e os GIFs, usando o
**Edge já instalado** (`playwright-core` com `channel: "msedge"`; não baixa navegador).

```bat
cd frontend
npm run build
npx vite preview --port 4173      :: deixe rodando neste terminal
```

Em outro terminal, em `frontend\`:

```bat
npm run fotos                     :: tudo
set SO=fotos&& npm run fotos      :: só as fotos (cmd)
```

```powershell
$env:SO = "animacoes"; npm run fotos   # só os GIFs (PowerShell)
```

| `SO` | Gera | Em |
|---|---|---|
| (vazio) | tudo abaixo | |
| `fotos` | cada tela e peça, claro e escuro (1440 × 900) | `imagens/claro/`, `imagens/escuro/` |
| `animacoes` | 4 GIFs (fotografa sem parar enquanto um roteiro clica e junta com `scripts/gif.py`) | `imagens/animacoes/` |

Precisa: Edge, o `vite preview` na porta 4173 (ou outro endereço em `VITRINE`), e, para os GIFs,
Python com **Pillow** (`pip install pillow`). Feche o `vite preview` ao terminar.

**Para fotografar o sistema depois da cirurgia:**

1. Troque a lista `TELAS` (chave do módulo → nome do arquivo) e os roteiros pelos passos das
   telas novas. O script acha as coisas por textos e rótulos (`placeholder="Usuário"`,
   `aria-label^="Conta de"`, botões "Abrir janela"...): ajuste para os rótulos novos.
2. Se as telas precisam do Python para ter dados, rode `scripts\ABRIR_NO_NAVEGADOR.bat teste`
   (base de teste) e use `VITRINE=http://127.0.0.1:8765`: sem senha no endereço, as telas usam a
   senha `dev` desse modo.
3. As fotos abrem cada módulo com `?tela=<chave>` e guardam o tema em `localStorage` antes de abrir.

## Nomes para trocar na cirurgia

| Arquivo | O quê |
|---|---|
| `backend/app.py` | `NOME = "Meu Sistema"` (pode ter acento), `PASTA = "MeuSistema"` (**sem acento nem espaço**), `VAR_DADOS = "MEU_SISTEMA_DADOS"`. O `background_color="#2B2A28"` fica (é o do Plus). |
| `backend/versao.py` | `VERSAO` (a fonte da versão). |
| `scripts/ABRIR_NA_JANELA.bat`, `scripts/ABRIR_NO_NAVEGADOR.bat` | `title`, a variável `MEU_SISTEMA_DADOS` e a pasta `MeuSistema_FICTICIO`. |
| `tests/conftest.py`, `tests/api/test_casca.py` | A variável `MEU_SISTEMA_DADOS` (e o prefixo da pasta temporária). |
| `frontend/index.html` | `<title>Meu Sistema</title>` |
| `frontend/src/componentes/layout/MenuLateral.tsx` | `NOME_SISTEMA` (o nome embaixo do logo da UP, no menu e na entrada). O logo não muda. |
| `frontend/src/rotas/login/TelaLogin.tsx` | A versão `v1.0.0` (igual ao `versao.py`). |
| `MeuSistema.spec` | O nome do arquivo e `name='MeuSistema'` (duas vezes); os pacotes do motor em `hiddenimports`. |
| `installer/instalador.iss` | `MyAppName`, `MyAppExeName`, `AppId`, `OutputBaseFilename`, `Source`. `MyAppPublisher` e o ícone ficam. |
| `installer/GERAR_INSTALADOR.bat` | O nome do `.spec` no passo 4 e a mensagem final com o nome do instalador. |
| `CLAUDE.md` e `AGENTS.md` | As regras do projeto (formato do Plus), com o nome do sistema e a variável da base de teste. |
