# 06 · Princípios visuais

> A linguagem visual do Sistema Contábil Plus em regras curtas. Quando uma tela nova não tiver
> modelo pronto, decida por aqui — e confira se o Plus já resolveu algo parecido (ele é a
> referência). Se duas regras brigarem, vale a de cima.

## 1. Clareza antes de enfeite
- Cada tela tem **um** propósito, dito no título e numa frase embaixo (`CabecalhoTela`).
- **Uma** ação principal por tela (`Botao` primário). As outras são `leve`, `fantasma` ou ficam no `…`.
- Texto em 3 níveis só: `texto` (o que importa), `texto-2` (apoio), `texto-3` (legenda, dica).
- Números sempre com `tabular-nums` e alinhados à direita em colunas.

## 2. Camadas, não caixas
- Fundo (`fundo`) → superfícies (`superficie`: cartões, janelas) → controles (`campo`).
- Separe com **espaço** e **uma borda fina** (`border-borda`), não com várias caixas aninhadas.
- Indicadores do mesmo assunto ficam num cartão só com divisórias de 1 px (`FaixaIndicadores`),
  nunca como caixinhas soltas.
- Sombra só para o que **flutua**, com os valores do Plus: listas abertas
  (`shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]`), janelas e gaveta
  (`shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]`), cartão em hover
  (`shadow-[0_16px_38px_-16px_rgba(0,0,0,0.25)]`).

## 3. Cantos coerentes
- Quanto maior a peça, maior o canto (escala do Plus): chip 8 (`rounded-lg`) → botão/campo 12
  (`rounded-xl`) → lista aberta e campo grande 16 (`rounded-2xl`) → cartão 20 (`rounded-[20px]`) →
  janela e gaveta 24 (`rounded-[24px]`) → cartão da entrada 28. Nunca um canto fora da escala.

## 4. Cor com significado
- **Verde** (`verde`) = foco, marcado, confirmar, "é aqui". Não use para decorar.
- **Vermelho** (`vermelho`) só para erro e ação destrutiva. **Âmbar** (`amber-*` do Tailwind) só
  para atenção (ex.: o seletor de competência fora do mês atual).
- **Grafite** (`primario`) é o botão principal; **destaque** marca o item ativo do menu.
- Gráficos: cada cor diz sempre a mesma coisa, como na Visão geral do Plus: situação
  `--st-prazo` (no prazo), `--st-atraso` (com atraso), `--st-vencida` (vencida), `--st-aberta`
  (a vencer); tipo `--tp-rotina`, `--tp-tarefa`, `--tp-estudo`.
- Selos: fundo da cor a 12% + texto na cor (`Selo`). Nunca selo de cor cheia.
- Identidade de item (empresa, cliente, pessoa): cor fixa por nome (`corPorTexto`, os mesmos
  tons do `corDaEmpresa`/`corDaPessoa` do Plus) no `IconeApp`/`Avatar`.

## 5. Nada falha calado
- Botão que não pode ser usado: continua visível e, ao clicar, um balão diz **por quê**
  (`avisar("Só quem criou pode apagar.")`).
- Toda gravação termina com balão de sucesso ou de erro com o motivo.
- Lista vazia explica e oferece a ação que resolve (`Vazio`).
- Carregando: esqueleto no formato do conteúdo (`Esqueleto`), nunca um giro solto no meio.
- Formulário: erro embaixo do campo (`ErroDoCampo`) + resumo no fim (`AvisoErro`) + balão.

## 6. Movimento que explica
- Animação mostra **de onde veio e para onde foi** (item ativo deslizando, janela crescendo do
  centro, gaveta vindo da direita). Não é enfeite.
- Molas rápidas que assentam sem quicar. Só `transform` e `opacity`.
- Respeita "reduzir animações" do Windows. Ver [10-animacoes.md](10-animacoes.md).

## 7. Programa de desktop, não site
- Sem barra de título própria, sem rodapé de site, sem "hero". A tela usa o espaço todo.
- Texto da interface não é selecionável (só campos). Cursor padrão nos botões.
- Atalhos de teclado: Ctrl+K busca, Ctrl+B menu, Esc fecha, Enter confirma.
- Barra de rolagem fina que só aparece enquanto rola.
- Tudo funciona sem internet (fonte Inter dentro do programa).

## 8. Densidade honesta
- Cadastro e formulário: confortável (campos 40 px, linhas 44 px).
- Tabelas de números: compacta (linhas 32 px, zebra).
- Largura: telas se ajustam ao espaço **disponível** (`@container`), não à janela; grade de
  cartões `auto-fill minmax(320px, 1fr)`.

## 9. Escreva como gente
- Verbos no botão ("Salvar", "Apagar"), nunca "OK".
- Mensagens dizem o que houve e o que fazer: "Não foi possível salvar: a pasta está fora do ar.
  Confira a rede e tente de novo."
- Pergunta de confirmação diz a consequência: "Ele sai da lista e não dá para desfazer."
