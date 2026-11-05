# 00 · Comece aqui (roteiro da cirurgia)

> **Para a IA.** Você foi chamada dentro de um sistema do escritório UP Contábil e apontada para
> esta pasta. Leia este arquivo inteiro antes de mexer em qualquer coisa. Ele diz o que é
> obrigatório, o que fazer, em que ordem e o que nunca fazer.

## Por que este kit existe

O **Sistema Contábil Plus** é o modelo de todos os sistemas do escritório. A ideia é que, no
futuro, os sistemas que hoje estão separados virem **uma coisa só**, dentro do Plus. Para isso
dar pouco trabalho, cada sistema em andamento passa por uma "cirurgia": ganha a **mesma stack**
e a **mesma casca** do Plus (tela de entrada, menu lateral, busca, janelas, cores, peças,
organização das pastas), mantendo as suas próprias regras e telas.

Este kit é a casca do Plus separada para isso: `modelo/` é um sistema-esqueleto que roda e cujos
arquivos são **cópias dos arquivos do Plus** (ou adaptações mínimas deles).

## O que é obrigatório e o que pode variar

Leia o detalhe em [01-o-padrao.md](01-o-padrao.md). Em resumo:

| Igual ao Plus, sempre | Pode ser do sistema |
|---|---|
| Stack (Python + FastAPI + pywebview; React + Vite + Tailwind + Radix + Motion...) | Os **módulos** do menu, as seções e os ícones |
| Organização das pastas (`backend/motor`, `servicos`, `api`, `esquemas`, `janela`; `frontend/src/rotas/<modulo>`, `componentes`, `lib`; `scripts`, `installer`, `tests`) | As **telas** de cada módulo e o que elas mostram |
| Tela de entrada, menu lateral, busca Ctrl+K, janelas, ficha lateral, balões | As **regras** do sistema (o motor) e os textos |
| Fonte, medidas, cantos, sombras, animações, logo da UP | O **nome** do sistema embaixo do logo |
| Os arquivos que são cópia do Plus (não se editam) | **Ajustes pequenos de paleta** (mesmos nomes de cor, outros tons) |
| Os nomes das cores (`verde`, `vermelho`, `destaque`...) e das peças | **Peças novas** quando o Plus não tem (com as classes do Plus, em arquivo próprio) |

A regra para decidir uma dúvida: **isto vai dar trabalho quando este sistema for juntado ao
Plus?** Se sim, não pode. Se não, pode, e fica registrado em `docs/visual.md` do projeto.

## O que é a "cirurgia"

Trocar a casca inteira do sistema (telas, janela, menus, botões, cores, animações) pela casca do
Plus, mantendo as regras (cálculos, banco, leitura de arquivos, validações) funcionando
exatamente como antes. Não é um tema por cima do que existe nem uma reescrita do sistema.

Se o sistema é PyQt6/PySide6/Tkinter/WinForms, a cirurgia **é** a troca para a stack do Plus.
Não ofereça "um tema no Qt", não proponha Electron/Tauri/outra biblioteca de telas e não diga que
é trabalho demais: o próprio Plus fez essa troca, saindo do PyQt6, em **2 dias**
([01-o-padrao.md](01-o-padrao.md#postura-sem-criar-dificuldades)).

## O roteiro (siga nesta ordem)

### Fase 1 · Entender o projeto (sem mudar nada)
1. `git status` e `git log -5`. Se não for repositório git, sugira `git init` e um commit inicial
   **antes** de tudo.
2. Descubra a tecnologia atual: `PyQt6`, `PySide6`, `qtpy`, `tkinter`, `.ui`, `QMainWindow`, `.qss`.
3. Faça o **mapa** e mostre ao usuário (tabela curta):
   - **Telas**: cada janela/aba/diálogo, o arquivo e o que faz. Cada uma vira um **módulo** do menu
     ou uma janela dentro de um módulo.
   - **Motor**: o que NÃO é tela (cálculos, banco, leitura de PDF/Excel, regras). Será copiado.
   - **Regras presas nas telas**: validações, `if` de permissão, montagem de listas dentro dos
     `QWidget`. Vão para `backend/servicos/` sem mudar o comportamento.
   - **Regras escondidas nos widgets**: `setMaximum`, casas decimais, `setMaxLength`, máscaras,
     itens fixos de `QComboBox`. Também são regras: vão para o Python.
   - **Onde ficam os dados**: como o motor acha o banco/arquivos (variável, caminho com
     `__file__`, config). Decide como isolar a base de teste.
   - **Coisas do Windows**: escolher pasta, salvar arquivo, abrir arquivo, impressão.
4. Procure testes. Se não houver, anote 3–5 comportamentos-chave para conferir depois
   (ex.: "importar o arquivo X dá 42 linhas e total 1.234,56").

### Fase 2 · Entrevista
5. Faça a entrevista de [02-entrevista.md](02-entrevista.md) em blocos curtos (3–4 perguntas por
   vez), sempre com a sua recomendação. Ela é sobre **módulos, telas e o que é particular deste
   sistema** — a aparência já está decidida (é a do Plus).
6. Registre as respostas em `docs/visual.md` do projeto, incluindo a seção
   "Diferenças em relação ao Plus" (mesmo que vazia).

### Fase 3 · Plano
7. Monte o plano nesta ordem e peça **um** "ok":
   1. Esqueleto: a versão nova numa pasta própria (como o Plus fez), a partir de `modelo/`, com o
      nome do sistema, a base de teste e a janela abrindo.
   2. Motor copiado para `backend/motor/` e testes do motor passando.
   3. Entrada (login) e janela principal com os módulos no menu.
   4. Um módulo por vez, do mais usado para o menos usado.
   5. Instalador, quando o usuário pedir ([11-instalador.md](11-instalador.md)).

### Fase 4 · Execução
8. **Copie o modelo, não reescreva.** E nunca edite os arquivos que são cópia do Plus
   (lista em [01-o-padrao.md](01-o-padrao.md#arquivos-que-são-cópia-do-plus)).
9. Motor antigo → **cópia** em `backend/motor/`, mudando o mínimo (só imports, se precisar).
   O sistema antigo continua intocado na pasta dele e é o oficial até a versão nova estar pronta.
   Regra presa em tela Qt → função em `backend/servicos/` (mesmo comportamento e mensagens).
10. Cada tela nova: um módulo em `frontend/src/rotas/<modulo>/Tela<Nome>.tsx`, montado com as
    peças de [08-componentes.md](08-componentes.md) e um dos modelos de [09-telas.md](09-telas.md).
11. A cada módulo pronto: confira contra o sistema antigo (mesmos dados → mesmo resultado),
    mostre ao usuário (foto) e faça **commit** ("feat: módulo X na casca do Plus").
12. Só apague o código Qt quando a versão nova estiver completa e conferida na base de teste.

### Fase 5 · Conferência e entrega
13. Rode a lista de [12-conferencia.md](12-conferencia.md), incluindo a parte "Igual ao Plus".
14. Pergunte se o usuário quer o instalador agora. Gerar não é publicar: instalar nas máquinas do
    escritório só com pedido explícito.

## Nunca faça

- Mudar regra de negócio "aproveitando a viagem". Achou erro na regra? Anote e pergunte.
- Editar um arquivo que é cópia do Plus, ou criar um "jeito próprio" de algo que o Plus já tem.
- Inventar cor, canto, sombra ou animação. Copie as classes do Plus/kit.
- Deixar ação falhar calada: todo erro e todo "não pode" vira um balão com o motivo.
- Testar na base oficial. Use a base fictícia (`scripts\ABRIR_*.bat ficticia`); pelo código o
  `app.py` nem abre sem a variável de teste.
- Publicar atualização ou instalar nos computadores do escritório sem pedido explícito.
- Colocar dados de clientes, senhas ou `.env` no git.

## Mapa deste kit

| Pasta / arquivo | Para quê |
|---|---|
| [01-o-padrao.md](01-o-padrao.md) | O que é obrigatório, o que pode variar e a postura |
| [02-entrevista.md](02-entrevista.md) | As perguntas: módulos, telas e particularidades |
| [03-stack.md](03-stack.md) | Bibliotecas e versões (as do Plus) |
| [04-arquitetura.md](04-arquitetura.md) | Como Python, janela e telas se ligam |
| [05-migrar-do-pyqt.md](05-migrar-do-pyqt.md) | O passo a passo da troca, peça por peça |
| [06-principios.md](06-principios.md) | A linguagem visual do Plus em regras curtas |
| [07-cores-e-medidas.md](07-cores-e-medidas.md) | As cores e medidas do Plus |
| [08-componentes.md](08-componentes.md) | Catálogo de peças com imagem e uso |
| [09-telas.md](09-telas.md) | Modelos de tela e como montar cada um |
| [10-animacoes.md](10-animacoes.md) | As animações do Plus |
| [11-instalador.md](11-instalador.md) | Scripts de abrir, `.exe` e instalador |
| [12-conferencia.md](12-conferencia.md) | Lista final antes de entregar |
| `../modelo/` | O esqueleto que roda, no formato do Plus (copie daqui) |
| `../imagens/` | Fotos (claro/escuro) e GIFs das animações |
