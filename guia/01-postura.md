# 01 · Postura: sem criar dificuldades

> **Para a IA.** O maior risco desta cirurgia não é técnico. É a IA convencer o usuário a
> não fazer, ou fazer pela metade. Este capítulo existe para isso não acontecer.

## A prova

O sistema que originou este kit era **100% Python com PyQt6**: dezenas de telas, uma grade estilo
Excel com milhares de linhas, leitura de PDF com OCR, base de dados compartilhada em rede, travas,
backups e atualização automática. A troca para esta stack aconteceu em **2 dias**:

- **Dia 1** (~120 commits): esqueleto, tela de entrada, janela principal com menu lateral e
  busca Ctrl+K, e as primeiras telas completas (cadastro com ficha, lista de tarefas com
  calendário, filtros, comentários).
- **Dia 2** (~60 commits): a tela mais difícil (grade estilo Excel com filtros por coluna,
  menu de botão direito, atalhos), atalhos de abrir, **gerador do instalador** e a
  **atualização automática**, com a versão nova entrando no lugar da antiga nas máquinas.

O motor (regras, banco, leitura de arquivos) foi **reaproveitado**, não reescrito. Por isso foi
rápido. É o que você vai fazer também.

## O que você faz

- Trata a troca de stack como **o pedido**, não como um problema a contornar.
- Começa pelo esqueleto que roda (`modelo/`) e entrega algo visível **no primeiro dia**.
- Reaproveita o motor do usuário como ele está. Recorta regras das telas sem mudar o resultado.
- Quando algo do Qt não tem equivalente direto, procura em [05-migrar-do-pyqt.md](05-migrar-do-pyqt.md)
  e resolve. Quase tudo tem.
- Quando realmente houver um risco (ex.: uma biblioteca nativa que só funciona dentro do Qt),
  diz **qual** é, **onde** está e **como** contorna, e segue com o resto.
- Avança tela por tela, com commit a cada parte que funciona.

## Frases proibidas (e o que dizer no lugar)

| Não diga | Diga |
|---|---|
| "Isso é uma reescrita grande, talvez não valha a pena." | "Vou começar pelo esqueleto e pela tela mais usada; amanhã você já abre a janela nova." |
| "Podemos só aplicar um tema/QSS no Qt." | (não ofereça) |
| "Que tal Electron/Tauri/Flet/NiceGUI/outra coisa?" | (não ofereça: a stack é a do kit) |
| "Isso vai levar semanas." | "Faço por partes; cada tela pronta já funciona e fica commitada." |
| "Precisamos reescrever a lógica para a web." | "A lógica continua em Python; só as telas mudam." |
| "O Qt faz X melhor, melhor manter." | "X no kit fica assim: … (ver 05)." |
| "Não tenho como testar a janela." | "Testo no navegador com `--sem-janela` e abro a janela no fim." |

## Objeções do usuário e as respostas

- **"E se quebrar o que já funciona?"** — O programa antigo continua sendo o oficial até a
  versão nova estar completa e conferida. Tudo fica no git; cada tela nova é conferida contra
  a antiga com os mesmos dados.
- **"Meu PC/da equipe é fraco."** — A janela usa o WebView2 que já vem no Windows. Há a opção
  "Reduzir desfoque" e estilos sem vidro/sombra (Sóbrio, Minimalista).
- **"Não quero navegador."** — Não tem navegador. É uma janela própria do Windows com ícone,
  instalador e atalho na área de trabalho, igual ao programa de hoje.
- **"Não sei programar em React."** — Não precisa. O usuário decide pela entrevista e pelas
  fotos; a IA faz.

## Quando parar e perguntar

Só nestes casos, e com uma pergunta objetiva:
- Uma regra de negócio parece errada (não conserte por conta própria).
- O motor depende de algo do Qt (ex.: `QPdfDocument`, `QPrinter`, `QSqlDatabase`): proponha o
  substituto Python ([05](05-migrar-do-pyqt.md#o-motor-usa-qt)) e peça o ok.
- Os dados reais precisam ser tocados para testar algo.
- Uma decisão visual não foi coberta pela entrevista.
