# 05 · Migrar do PyQt (ou PySide, Tkinter) passo a passo

> **Para a IA.** É o caminho que o próprio Plus fez: versão nova numa pasta própria, motor
> copiado mudando o mínimo, um módulo por vez, cada um conferido contra o antigo. Este capítulo
> mostra **onde cada coisa do Qt vai parar** no formato do Plus.

## O desenho da troca

```
SISTEMA ANTIGO (fica intocado, oficial)       VERSÃO NOVA (pasta própria, formato do Plus)
──────────────────────────────────────────    ─────────────────────────────────────────────
main.py → QApplication + QMainWindow          backend/app.py → FastAPI + pywebview (janela)
telas/*.py (QWidget com regra dentro)    ─┬─► frontend/src/rotas/<modulo>/Tela*.tsx (mostram e pedem)
                                          └─► backend/servicos/*.py   (a regra recortada)
motor (cálculo, banco, leitura de arquivo) ─► backend/motor/   (CÓPIA, mudando o mínimo)
sinais/slots, QTimer, QThread              ─► chamadas /api + TanStack Query + lib/pedidoTela
QSS / setStyleSheet                        ─► nada: a aparência é a do Plus (index.css + peças)
```

Foi assim no Plus: o sistema antigo ficou em `..\Sistema-Contabil` (100% Python/Qt), a versão
nova nasceu em `..\sistema-contabil-plus`, e o antigo continuou sendo o oficial até a nova estar
completa e testada na base de teste. Faça igual: **`<pasta do antigo>` → `<pasta do antigo>-plus`**
(ou o nome que o usuário escolher), repositório próprio.

A pergunta para cada linha de código Qt é sempre: **isto é regra ou é tela?**
- Regra (decide, calcula, valida, grava) → Python: `backend/servicos/` (ou já está no motor).
- Tela (mostra, organiza, pergunta) → React, com as peças do kit.

## Passo 1 · Esqueleto rodando (primeiras horas)

1. Crie a pasta nova e copie **todo** o `modelo/` para ela (`backend/`, `frontend/`, `scripts/`,
   `installer/`, `tests/`, `assets/`, `.gitignore`, `CLAUDE.md`, `AGENTS.md`, `MeuSistema.spec`).
   `git init` e primeiro commit.
2. Troque os nomes (lista completa em [11-instalador.md](11-instalador.md)): `NOME`, `PASTA` e
   `VAR_DADOS` em `backend/app.py`; `NOME_SISTEMA` em `MenuLateral.tsx`; `<title>` em
   `frontend/index.html`; `MeuSistema` no `.spec` (renomeie o arquivo) e no `installer/`;
   `MEU_SISTEMA_DADOS` nos `scripts/` e em `tests/conftest.py`. Preencha o `CLAUDE.md`
   (e copie para `AGENTS.md`).
3. Se a entrevista aprovou um ajuste de paleta, aplique só os valores em `frontend/src/index.css`.
4. `scripts\ABRIR_NO_NAVEGADOR.bat telas` (telas no Vite) e `scripts\ABRIR_NA_JANELA.bat ficticia`
   (janela de verdade, base de teste). Mostre ao usuário.
5. Commit: `feat: esqueleto na casca do Plus`.
6. **Não apague os módulos de exemplo agora.** Os do sistema entram ao lado; os exemplos saem
   juntos no fim (`rotas/painel|cadastro|tabela|formulario|pecas/`, `dados/exemplo.ts`,
   `api/exemplo.ts`, `backend/api/exemplo.py`, `servicos/exemplo.py`, `esquemas/exemplo.py`,
   `motor/dados_exemplo.py` e as linhas deles em `main.tsx`, `modulos.ts`, `BuscaRapida.tsx` e
   `app.py`). Assim cada módulo novo tem o seu commit.

## Passo 2 · Motor para dentro

- **Copie** o motor (o que não é tela) para `backend/motor/`, mudando o mínimo: só imports, se
  precisar. `app.py` põe `backend/motor` no `sys.path`, então `import banco` ou `from db import x`
  continuam valendo — como no Plus (`core`, `db`, `parsers`, `engine`).
- **Base de teste isolada por inteiro**: o motor deve achar os dados pela **mesma** variável da
  casca (`VAR_DADOS`), como no Plus (`SISTEMA_CONTABIL_DADOS`). Se o motor monta o caminho com
  `__file__` ou lê de um config, a mudança mínima é:
  `pasta = os.environ.get("<VAR_DADOS>") or <caminho de hoje>`. O `:ficticia` dos `scripts/` e o
  `tests/conftest.py` já definem a variável; acrescente lá o que o motor precisar para apontar a
  cópia de teste (no Plus: `banco.definir_servidor_path(...)` com o `BANCO FICTICIO`).
- **No `.exe`**, `__file__` aponta para dentro de `_internal`: dados ao lado do código deixam de
  ser achados. Por isso o caminho dos dados vem da variável/config, nunca do `__file__`.
- `QSettings` → arquivo `config.ini`/`json` na pasta gravável (`pasta_gravavel()` em `app.py`).
- Copie os testes do motor para `tests/motor/` e rode: `python -m pytest tests`. Nada muda de resultado.

### O motor usa Qt?
| Usa | Troque por (Python puro) |
|---|---|
| `QSqlDatabase`/`QSqlQuery` | `sqlite3` (ou o driver do banco) |
| `QPdfDocument`, `QPrinter` para gerar PDF | `pymupdf` (`fitz`) ou `reportlab`; ou imprimir pela tela com `@media print` |
| `QImage`/`QPixmap` para processar imagem | `Pillow` |
| `QThread`/`QRunnable` para trabalho pesado | `threading`/`concurrent.futures` (rotas `def` do FastAPI já rodam fora da tela) |
| `QTimer` para checar algo de tempos em tempos | `refetchInterval` do TanStack Query na tela, ou uma thread no Python |
| `QFileSystemWatcher` | thread com `os.stat` periódico |
| `QSettings` | arquivo de config na pasta gravável |
| `QLocale`/datas | `datetime`; formatação na tela com `toLocaleString("pt-BR")` e `lib/competencia.ts` |

## Passo 3 · Um módulo por vez

Para **cada** tela do mapa, nesta ordem:

**a) Recorte a regra.** Tudo que a tela Qt decide vira função em `backend/servicos/<assunto>.py`:

```python
# ANTES — dentro do QDialog
def salvar(self):
    nome = self.ed_nome.text().strip()
    if len(nome) < 3:
        QMessageBox.warning(self, "Atenção", "Nome muito curto.")
        return
    if not self.usuario.admin and self.cb_tipo.currentText() == "Especial":
        QMessageBox.warning(self, "Atenção", "Só o administrador cria do tipo Especial.")
        return
    banco.inserir_cliente(nome, self.cb_tipo.currentText())
    self.accept()
```

```python
# DEPOIS — backend/servicos/clientes.py (sem Qt; mesmas regras, mesmas mensagens)
import banco  # o motor copiado (backend/motor está no sys.path)

class SemPermissao(Exception): ...

def salvar(usuario, nome: str, tipo: str) -> None:
    nome = nome.strip()
    if len(nome) < 3:
        raise ValueError("Nome muito curto.")
    if not usuario.admin and tipo == "Especial":
        raise SemPermissao("Só o administrador cria do tipo Especial.")
    banco.inserir_cliente(nome, tipo)
```

**b) O formato dos dados** em `backend/esquemas/<assunto>.py` (Pydantic) e **uma porta fina** em
`backend/api/<assunto>.py` (modelo: `api/exemplo.py`), registrada no `criar_api` de `app.py`
(`app.include_router(clientes.rota)`). Erro de regra vira 400 com o texto em `detail`; para
`SemPermissao`, um `exception_handler` que devolve 403 (como o do Plus em `app.py`).

**c) Uma função por porta** em `frontend/src/api/<assunto>.ts` (modelo: `api/exemplo.ts`).

**d) O módulo**: `frontend/src/rotas/<modulo>/Tela<Nome>.tsx`, num dos modelos de
[09-telas.md](09-telas.md), com as peças de [08-componentes.md](08-componentes.md).
Lista → `useQuery`; salvar/apagar → `useMutation` + `invalidateQueries`. O texto do `detail`
aparece sozinho num balão (já configurado no `main.tsx`).

**e) Ligue no menu**: uma linha em `componentes/layout/modulos.ts` (seção, chave, nome, ícone,
descrição, busca) e o componente em `main.tsx` (no objeto `telas` com `lazy`, e em `PaginaModulo`).

**f) Confira** (paridade): mesmos dados → mesma lista, mesmos totais, mesmas mensagens. Se puder,
um `pytest` em `tests/` chamando o serviço com os dados de antes.

**g) Foto + commit**: `feat: módulo Clientes na casca do Plus`.

## Equivalências de tela (Qt → kit)

| Qt | Kit (arquivo) | Observação |
|---|---|---|
| `QMainWindow` + `QMenuBar`/`QToolBar` | `JanelaPrincipal` + `MenuLateral` (`componentes/layout/`) | Sem barra de menu no topo: módulos no menu lateral, ações na barra de ferramentas da tela e no Ctrl+K |
| `QTabWidget` com telas | um módulo por tela em `modulos.ts` | Abas *dentro* de uma tela → `Segmentado` (`ui/segmentado.tsx`) |
| `QStackedWidget` | troca de módulo / componente | |
| `QDialog` (formulário) | `Dialogo` (`ui/dialogo.tsx`, curto) ou tela de formulário | Mais de ~6 campos → tela ou `Gaveta` |
| `QDockWidget`, painel de detalhes | `Gaveta` (`ui/gaveta.tsx`, a ficha lateral) | |
| `QMessageBox.question` | `await confirmar({...})` (`lib/confirmar.tsx`) | Só para ações perigosas |
| `QMessageBox.information/warning` | `toast.success` / `avisar(motivo)` (`lib/avisos.ts`) / `toast.error` | Nunca janela modal para avisar |
| `QStatusBar.showMessage` | `toast` | |
| `QTableWidget`/`QTableView` | cartões/lista como `rotas/cadastro` ou tabela densa como `rotas/tabela` | Ordenação no cabeçalho; zebra; números à direita |
| `QTreeWidget` | lista com grupos (`TituloGrupo`) ou linhas que expandem | |
| `QLineEdit` | `CampoRotulado` (formulário) · `Campo` (grande, entrada) · `CampoBusca` (barra) | Erro: `ErroDoCampo` embaixo |
| `QTextEdit` | `AreaTexto` (`ui/campos-extra.tsx`) | |
| `QComboBox` | `Escolha` (um) · `Lista multipla` (vários) · `buscavel` se > 8 itens (`ui/lista.tsx`) | |
| `QCheckBox` | `CaixaSelecao` (`ui/caixa-selecao.tsx`) · `Interruptor` (preferência) | |
| `QRadioButton` em grupo | `Segmentado` (2–4 opções) · `Escolha` (mais) | |
| `QDateEdit`/`QCalendarWidget` | `SeletorData`, `SeletorHora` (`ui/seletor-data.tsx`) · `SeletorCompetencia` (mês) | |
| `QSpinBox`/`QDoubleSpinBox` | `CampoRotulado` de texto (`inputMode="decimal"`) + `lerNumeroBr` (`lib/numeros.ts`) | `type="number"` não aceita vírgula; `setMaximum`/casas são regra: confira no Python |
| `QProgressBar` | `BarraOcupada` (sem saber quanto falta) · `BarraPartes` (proporção) | |
| `QToolTip` | `Dica` · ou `title` simples | |
| `QMenu` (contexto / botão) | `MenuSuspenso` + `ItemMenu` (`ui/pecas.tsx`) | |
| `QFileDialog` | `escolherPasta`, `salvarArquivo` (`api/janela.ts`) | Abrir arquivo para importar → `<input type="file">` e enviar em base64 |
| `QDesktopServices.openUrl` | `abrirLink`, `abrirArquivo`, `abrirPastaDoArquivo` (`api/janela.ts`) | |
| `QShortcut` | `useEffect` com `keydown` (ver Ctrl+B no `MenuLateral`) | Mantenha os atalhos antigos |
| `QSystemTrayIcon` | fora da casca; manter no Python se for essencial | |
| Ícones `.png` próprios | Lucide (`lucide-react`) | Traço 1.75, 16–19 px, como no Plus |

## Estado e atualização (o que eram sinais/slots)

- **Ler dados**: `useQuery({ queryKey: ["clientes", filtro], queryFn: () => clientesApi.listar(filtro) })`.
- **Mudar dados**: `useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"] }) })`.
  Substitui o "emitir sinal para a outra janela recarregar".
- **Algo muda por fora** (outro usuário na rede): `refetchInterval: 20_000` na consulta (o Plus
  sincroniza a cada 20 s na `JanelaPrincipal`).
- **Abrir outra tela já filtrada ou com um item aberto** (o que era `outra_janela.abrir(id)`): o
  mecanismo do Plus, `lib/pedidoTela.ts`: `aoIr("clientes"); pedirTela({ tela: "clientes", acao: "abrir", id: 7 })`
  e, na tela, `usePedidoTela("clientes", (p) => ...)`. Exemplos: `TelaCadastro.tsx` e `TelaPainel.tsx`.
- **Usuário logado, preferências**: no Python (sessão), como no Plus; o que é só visual (menu
  recolhido, seções dobradas) fica no `localStorage`.

## Tarefas longas (importar arquivo grande, gerar relatório)

1. A rota inicia o trabalho numa thread e devolve na hora `{ "id": ... }`.
2. Outra rota devolve o andamento (`{ "feito": 40, "total": 120, "mensagem": "..." }`).
3. A tela consulta com `refetchInterval: 500` e mostra `BarraPartes`/`BarraOcupada`.

## Impressão e PDF

- Relatório "bonito": gere o PDF no Python (o motor talvez já faça) e use `salvarArquivo`.
- Imprimir a própria tela: como a Visão geral do Plus — um bloco `#relatorio-pdf` escondido que só
  aparece em `@media print` (ver o fim do `index.css` do Plus) e `window.print()`.

## Armadilhas que já custaram caro

- **Dois programas no mesmo dado**: o antigo e o novo podem estar instalados juntos durante a
  migração. Pastas graváveis diferentes (`PASTA`/`VAR_DADOS`) e nada de escreverem no mesmo
  arquivo temporário.
- **Testar no dado real**: nunca. Pelo código o `app.py` só abre com a variável de teste.
- **Nome do `.exe`**: se a versão nova vai **substituir** a antiga por atualização, mantenha o
  mesmo nome do executável e o mesmo `AppId` do instalador (o Plus manteve `SistemaContabilQt.exe`);
  senão o Windows fica com os dois.
- **Pasta das telas no .exe**: o `.spec` leva `frontend/dist` como `telas`. Esquecer isso dá
  janela com "As telas não foram montadas".
- **Fonte**: a Inter vai dentro do programa; não dependa de internet.
- **Tamanho**: `PyQt6`/`PySide6` estão em `excludes` no `.spec`; se o motor ainda importar Qt,
  tire esse import antes de gerar o instalador.
