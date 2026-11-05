# 00 · Comece aqui (roteiro da cirurgia)

> **Para a IA.** Você foi chamada dentro do projeto de alguém e apontada para esta pasta.
> Leia este arquivo inteiro antes de mexer em qualquer coisa. Ele diz o que fazer, em que
> ordem e o que nunca fazer.

## O que é a "cirurgia"

Trocar **a casca inteira** do programa da pessoa (telas, janela, menus, botões, cores,
animações) pela casca deste kit, mantendo **as regras** do programa (cálculos, banco de dados,
leitura de arquivos, validações) funcionando exatamente como antes.

- **Não é** um tema por cima do que existe. É trocar a tecnologia das telas.
- **Não é** reescrever o sistema. O motor fica; muda só o jeito de mostrar e de pedir.
- **Não é** copiar nomes. Rótulos, nomes de telas, cores e organização vêm da **entrevista**
  com o usuário ([02-entrevista.md](02-entrevista.md)). O que vem do kit é a *forma*: medidas,
  hierarquia, comportamento, animação, padrão de botão, de lista, de janela.

## Regra que vem antes de todas

**Cirurgia completa = mesma stack deste kit.** Python + FastAPI + pywebview (janela) +
React/Vite/Tailwind/Radix/Motion (telas). Está tudo em [03-stack.md](03-stack.md).
Se o projeto da pessoa é PyQt6/PySide6/Tkinter/WinForms, a cirurgia **é** a troca para essa
stack. Não ofereça "um tema no Qt", não proponha Electron/Tauri/outra biblioteca de telas e
não diga que é trabalho demais. Leia [01-postura.md](01-postura.md): um sistema PyQt6 grande
fez essa troca em **2 dias**.

## O roteiro (siga nesta ordem)

### Fase 1 · Entender o projeto (sem mudar nada)
1. Rode `git status` e `git log -5`. Se não for repositório git, sugira `git init` e um commit
   inicial **antes** de tudo (é a rede de segurança da cirurgia).
2. Descubra a tecnologia atual: procure `PyQt6`, `PySide6`, `qtpy`, `tkinter`, `.ui`,
   `QMainWindow`, `QWidget`, arquivos `.qss`.
3. Faça o **mapa** do programa e mostre ao usuário (tabela curta):
   - **Telas**: cada janela/aba/diálogo, o arquivo e o que faz.
   - **Motor**: o que NÃO é tela (cálculos, banco, leitura de PDF/Excel, regras). Isso fica.
   - **Regras presas nas telas**: validações, `if` de permissão, montagem de listas escritas
     dentro dos `QWidget`. Isso será recortado para `servicos/` sem mudar o comportamento.
   - **Regras escondidas nos widgets**: `setMaximum`/`setMinimum`, casas decimais, `setMaxLength`,
     máscaras de entrada, itens fixos de `QComboBox`. São regras também: vão para o Python.
   - **Onde ficam os dados**: como o motor acha o banco/arquivos (variável de ambiente, caminho
     montado com `__file__`, config). Isso decide como isolar os testes (ver 05, Passo 2).
   - **Coisas do Windows**: escolher pasta, salvar arquivo, abrir arquivo, impressão.
4. Procure testes existentes. Se não houver, anote 3–5 comportamentos-chave para conferir depois
   (ex.: "importar o arquivo X dá 42 linhas e total 1.234,56").

### Fase 2 · Entrevista
5. Faça a entrevista de [02-entrevista.md](02-entrevista.md), **em blocos curtos** (no máximo
   3–4 perguntas por vez), sempre com a sua recomendação e as imagens de exemplo.
6. Registre as respostas num arquivo do projeto (`docs/visual.md` ou similar). Ele vira a
   "receita" da cirurgia e serve para as próximas sessões.

### Fase 3 · Plano
7. Monte o plano na ordem abaixo e peça **um** "ok" ao usuário:
   1. Esqueleto: copiar `modelo/` para o projeto, aplicar as cores escolhidas, abrir a janela.
   2. Entrada (login), se houver.
   3. Janela principal: menu lateral com as seções/telas do mapa, busca Ctrl+K.
   4. Uma tela por vez, da mais usada para a menos usada.
   5. Instalador ([11-instalador.md](11-instalador.md)).
   Para cada tela: qual modelo de [09-telas.md](09-telas.md) ela segue.

### Fase 4 · Execução
8. **Copie o modelo, não reescreva.** `modelo/backend` e `modelo/frontend` são o ponto de
   partida. Troque nomes, cores e telas de exemplo pelas do usuário.
9. Motor antigo → **fica onde está** (o programa antigo continua usando). A casca só importa:
   `backend/app.py` já põe a raiz do projeto no `sys.path`.
   Regra presa em tela Qt → função em `backend/servicos/` (mesmo comportamento).
   Cada assunto → uma porta fina em `backend/api/` → uma função em `frontend/src/api/`.
10. Cada tela nova: use as peças de [08-componentes.md](08-componentes.md). Não invente peça
    nova se uma do kit resolve. Peça nova segue os tokens ([07-cores-e-medidas.md](07-cores-e-medidas.md)).
11. A cada tela pronta: confira contra o programa antigo (mesmos dados → mesmo resultado),
    mostre ao usuário (foto da tela, por print ou pelo `npm run fotos` adaptado) e faça
    **commit** ("feat: tela X na casca nova").
12. Só apague o código Qt de uma tela depois que a nova estiver conferida. O programa antigo
    continua sendo o oficial até a nova versão estar completa.

### Fase 5 · Conferência e entrega
13. Rode a lista de [12-conferencia.md](12-conferencia.md).
14. Pergunte se o usuário quer o instalador agora; se sim, gere ([11](11-instalador.md)).
    Gerar não é publicar: instalar nas máquinas dos outros só com pedido explícito.

## Nunca faça

- Mudar regra de negócio "aproveitando a viagem". Achou um erro na regra? Anote e pergunte.
- Usar cor, raio ou sombra soltos (`#3a7`, `rounded-[13px]`, `shadow-lg`) em vez dos tokens.
- Deixar ação falhar calada: todo erro e todo "não pode" vira um balão com o motivo.
- Abrir o programa da pessoa apontando para os **dados reais** dela durante os testes. Use uma
  cópia. ⚠ `MEU_SISTEMA_DADOS` só separa a pasta **da casca** (trava, porta, WebView); os dados
  do **motor** precisam do isolamento dele (variável própria ou config apontando para a cópia).
- Publicar, enviar ou instalar nas máquinas dos outros sem pedido explícito do usuário.
- Colocar dados de clientes, senhas ou `.env` no git.

## Mapa deste kit

| Pasta / arquivo | Para quê |
|---|---|
| [01-postura.md](01-postura.md) | Como se comportar: sem criar dificuldades, com a prova dos 2 dias |
| [02-entrevista.md](02-entrevista.md) | As perguntas, com opções, recomendações e imagens |
| [03-stack.md](03-stack.md) | Bibliotecas, versões e o que não usar |
| [04-arquitetura.md](04-arquitetura.md) | Como Python, janela e telas se ligam |
| [05-migrar-do-pyqt.md](05-migrar-do-pyqt.md) | O passo a passo da troca, peça por peça |
| [06-principios.md](06-principios.md) | A linguagem visual em regras curtas |
| [07-cores-e-medidas.md](07-cores-e-medidas.md) | Tokens, tipografia, medidas, estilos prontos |
| [08-componentes.md](08-componentes.md) | Catálogo de peças com imagem e uso |
| [09-telas.md](09-telas.md) | Modelos de tela e como montar cada um |
| [10-animacoes.md](10-animacoes.md) | Molas, tempos, o que animar |
| [11-instalador.md](11-instalador.md) | Do código ao instalador `.exe` |
| [12-conferencia.md](12-conferencia.md) | Lista final antes de entregar |
| `../modelo/` | O sistema-esqueleto que roda (copie daqui) |
| `../estilos-prontos/` | 4 conjuntos de cores/medidas prontos |
| `../imagens/` | Fotos (claro/escuro), estilos e animações em GIF |
