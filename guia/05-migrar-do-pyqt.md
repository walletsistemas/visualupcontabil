# 05 · Migrar do PyQt (ou PySide, Tkinter) passo a passo

> **Para a IA.** O caminho que funcionou: esqueleto primeiro, motor intocado, uma tela por vez,
> cada tela conferida contra a antiga. Este capítulo mostra **onde cada coisa do Qt vai parar**.

## O desenho da troca

```
ANTES (Qt)                                   DEPOIS (kit)
──────────────────────────────────────────   ─────────────────────────────────────────────
main.py → QApplication + QMainWindow          backend/app.py → FastAPI + pywebview (janela)
telas/*.py (QWidget com regra dentro)    ─┬─► frontend/src/telas/*.tsx   (só mostra e pede)
                                          └─► backend/servicos/*.py      (a regra recortada)
motor/ (cálculo, banco, leitura de arquivo) ─► backend/motor/  (o MESMO código, mudando o mínimo)
sinais/slots, QTimer, QThread              ─► chamadas /api + TanStack Query (refetch, mutate)
QSS / setStyleSheet                        ─► tokens.css + Tailwind (nada de estilo solto)
```

A pergunta para cada linha de código Qt é sempre: **isto é regra ou é tela?**
- Regra (decide, calcula, valida, grava) → Python, em `servicos/` ou `motor/`.
- Tela (mostra, organiza, pergunta) → React, com as peças do kit.

## Passo 1 · Esqueleto rodando (primeiras horas)

1. Copie `modelo/backend` e `modelo/frontend` para o projeto (ex.: `backend/`, `frontend/`),
   além de `modelo/ABRIR.bat` e `modelo/empacotar/`.
2. Troque `NOME` em `backend/app.py`, o `<title>` de `frontend/index.html`, a `Marca` do menu
   e a variável `MEU_SISTEMA_DADOS` por nomes do projeto.
3. Aplique as cores da entrevista em `frontend/src/tema/tokens.css` (ou cole um arquivo de
   `estilos-prontos/`).
4. Rode `ABRIR.bat vitrine` (só telas) e `ABRIR.bat` (janela de verdade). Mostre ao usuário.
5. Commit: `feat: esqueleto da casca nova`.

## Passo 2 · Motor para dentro

- Mova (ou referencie) o código que não é tela para `backend/motor/`. Ajuste só imports.
- Se o motor lia configurações com `QSettings`, troque por um arquivo `config.ini`/`json` na
  pasta gravável (`pasta_gravavel()` em `app.py`). Mesmo conteúdo, mesmo comportamento.
- Rode os testes que existirem. Nada deve mudar de resultado.

### O motor usa Qt?
| Usa | Troque por (Python puro) |
|---|---|
| `QSqlDatabase`/`QSqlQuery` | `sqlite3` (ou o driver do banco) |
| `QPdfDocument`, `QPrinter` para gerar PDF | `pymupdf` (`fitz`) ou `reportlab`; ou imprimir pela tela com `@media print` |
| `QImage`/`QPixmap` para processar imagem | `Pillow` |
| `QThread`/`QRunnable` para trabalho pesado | `threading`/`concurrent.futures` (rotas `def` do FastAPI já rodam fora da tela) |
| `QTimer` para checar algo de tempos em tempos | `refetchInterval` do TanStack Query na tela, ou uma thread no Python |
| `QFileSystemWatcher` | thread com `os.stat` periódico (simples) |
| `QSettings` | arquivo de config na pasta gravável |
| `QLocale`/datas | `datetime`, `locale`; formatação na tela com `toLocaleString("pt-BR")` |

## Passo 3 · Uma tela por vez

Para **cada** tela do mapa, nesta ordem:

**a) Recorte a regra.** Tudo que a tela Qt decide vira função em `servicos/<assunto>.py`:

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
from motor import banco

class SemPermissao(Exception): ...

def salvar(usuario, nome: str, tipo: str) -> None:
    nome = nome.strip()
    if len(nome) < 3:
        raise ValueError("Nome muito curto.")
    if not usuario.admin and tipo == "Especial":
        raise SemPermissao("Só o administrador cria do tipo Especial.")
    banco.inserir_cliente(nome, tipo)
```

**b) Abra uma porta fina** em `backend/api/<assunto>.py` (modelo: `api/exemplo.py`) e inclua
no `criar_api` de `app.py` (`app.include_router(clientes.rota)`). Erro de regra vira 400/403
com o texto em `detail`. Para `SemPermissao`, registre um `exception_handler` que devolve 403.

**c) Uma função por porta** em `frontend/src/api/<assunto>.ts` (modelo: `api/exemplo.ts`).

**d) A tela.** Escolha o modelo em [09-telas.md](09-telas.md) e monte com as peças de
[08-componentes.md](08-componentes.md). Lista → `useQuery`; salvar/apagar → `useMutation` +
`invalidateQueries`. O texto do `detail` aparece sozinho num balão (já configurado no `main.tsx`).

**e) Ligue no menu**: uma linha em `componentes/layout/telas.ts` e o componente em `main.tsx`.

**f) Confira** (paridade): mesmos dados de entrada → mesma lista, mesmos totais, mesmas
mensagens. Se puder, escreva um `pytest` chamando o serviço com os dados de antes.

**g) Foto + commit**: `feat: tela Clientes na casca nova`.

## Equivalências de tela (Qt → kit)

| Qt | Kit | Observação |
|---|---|---|
| `QMainWindow` + `QMenuBar`/`QToolBar` | `JanelaPrincipal` + `MenuLateral` | Sem barra de menu no topo: telas no menu lateral, ações na barra de ferramentas da tela e no Ctrl+K |
| `QTabWidget` com telas | uma rota por tela no menu lateral | Abas *dentro* de uma tela → `Segmentado` |
| `QStackedWidget` | troca de componente/rota | |
| `QDialog` (formulário) | `Dialogo` (curto) ou tela `Formulario` (longo) | Mais de ~6 campos → tela ou `Gaveta` |
| `QDockWidget`, painel de detalhes | `Gaveta` (ficha lateral) | |
| `QMessageBox.question` | `await confirmar({...})` | Só para ações perigosas |
| `QMessageBox.information/warning` | `toast.success` / `avisar(motivo)` / `toast.error` | Nunca janela modal para avisar |
| `QStatusBar.showMessage` | `toast` | |
| `QTableWidget`/`QTableView` | `Lista` (cartões/lista) ou `Tabela` (densa, virtualizada) | Ordenação no cabeçalho; zebra; números à direita |
| `QTreeWidget` | lista com grupos (`TituloGrupo`) ou linhas que expandem | |
| `QLineEdit` | `CampoRotulado` (forms) · `Campo` (grande) · `CampoBusca` (barra) | |
| `QTextEdit` | `AreaTexto` | |
| `QComboBox` | `Escolha` (um) · `Lista multipla` (vários) · `buscavel` se > 8 itens | |
| `QCheckBox` | `CaixaSelecao` · `Interruptor` (preferência liga/desliga) | |
| `QRadioButton` em grupo | `Segmentado` (2–4 opções) · `Escolha` (mais) | |
| `QDateEdit`/`QCalendarWidget` | `SeletorData` · `SeletorHora` · `SeletorMes` | |
| `QSpinBox`/`QDoubleSpinBox` | `CampoRotulado type="number"` ou texto com máscara | |
| `QProgressBar` | `BarraOcupada` (sem saber quanto falta) · `BarraPartes` (proporção) | |
| `QToolTip` | `Dica` · ou `title` simples | |
| `QMenu` (contexto / botão) | `MenuSuspenso` + `ItemMenu` | |
| `QFileDialog` | `escolherPasta`, `salvarArquivo` em `api/janela.ts` | Abrir arquivo para importar → `<input type="file">` e enviar em base64 |
| `QDesktopServices.openUrl` | `abrirLink`, `abrirArquivo`, `abrirPastaDoArquivo` | |
| `QShortcut` | `useEffect` com `keydown` (ver Ctrl+B no `MenuLateral`) | Mantenha os atalhos antigos |
| `QSystemTrayIcon` | fora do escopo da casca; manter no Python se for essencial | |
| Ícones `.png` próprios | Lucide (`lucide-react`) | Traço 1.75, 16–19 px |

## Estado e atualização (o que eram sinais/slots)

- **Ler dados**: `useQuery({ queryKey: ["clientes", filtro], queryFn: () => clientesApi.listar(filtro) })`.
- **Mudar dados**: `useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"] }) })`.
  Isso substitui o "emitir sinal para a outra janela recarregar".
- **Algo muda por fora** (outro usuário na rede): `refetchInterval: 20_000` na consulta.
- **Usuário logado, preferências**: guardados no Python (sessão) e lidos pela tela; o que é só
  visual (menu recolhido, tema) fica no `localStorage`.

## Tarefas longas (importar arquivo grande, gerar relatório)

1. A rota inicia o trabalho numa thread e devolve na hora `{ "id": ... }`.
2. Outra rota devolve o andamento (`{ "feito": 40, "total": 120, "mensagem": "..." }`).
3. A tela consulta com `refetchInterval: 500` e mostra `BarraPartes`/`BarraOcupada`.

## Impressão e PDF

- Relatório "bonito": gere o PDF no Python (o motor talvez já faça) e use `salvarArquivo`.
- Imprimir a própria tela: um bloco `@media print` (o kit não traz um pronto; o original usava
  um `#relatorio` escondido que só aparece na impressão) e `window.print()`.

## Armadilhas que já custaram caro

- **Dois programas no mesmo dado**: durante a migração, o antigo e o novo podem estar
  instalados juntos. Use pastas graváveis diferentes (`MEU_SISTEMA_DADOS`) e não deixe os dois
  escreverem no mesmo arquivo temporário.
- **Testar no dado real**: nunca. Copie para uma pasta de teste.
- **Nome do `.exe`**: se a versão nova vai **substituir** a antiga por atualização, mantenha o
  mesmo nome do executável e o mesmo `AppId` do instalador; senão o Windows fica com os dois.
- **Pasta das telas no .exe**: o PyInstaller precisa levar `frontend/dist` (já está no `.spec`).
  Esquecer isso dá janela branca com "As telas não foram montadas".
- **Fonte**: a Inter vai dentro do programa (`public/fontes`); não dependa de internet.
- **Tamanho**: exclua `PyQt6`/`PySide6` do `.spec` quando o Qt sair, ou o instalador leva
  100 MB à toa.
