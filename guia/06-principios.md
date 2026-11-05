# 06 · Princípios visuais

> A linguagem do kit em regras curtas. Quando uma tela nova não tiver modelo pronto, decida
> por aqui. Se duas regras brigarem, vale a de cima.

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
- Sombra só para o que **flutua**: listas abertas (`shadow-pop`), janelas e gaveta
  (`shadow-janela`), cartão em hover (`shadow-cartao-hover`).

## 3. Cantos coerentes
- Quanto maior a peça, maior o canto: chip 8 → botão/campo 12 → lista aberta 16 →
  cartão 20 → janela 24. Nunca um canto solto fora da escala.

## 4. Cor com significado
- **Acento** = foco, marcado, confirmar, "é aqui". Não use acento para decorar.
- **Perigo** só para erro e ação destrutiva. **Alerta** só para atenção.
- Gráficos: cada `--g-*` diz sempre a mesma coisa em todas as telas (ex.: `--g-1` = concluído).
- Selos: fundo da cor a 12% + texto na cor (`Selo`). Nunca selo de cor cheia.
- Identidade de item (empresa, cliente, projeto): cor fixa por nome (`corPorTexto`) no
  `IconeApp`/`Avatar`.

## 5. Nada falha calado
- Botão que não pode ser usado: continua visível e, ao clicar, um balão diz **por quê**
  (`avisar("Só quem criou pode apagar.")`).
- Toda gravação termina com balão de sucesso ou de erro com o motivo.
- Lista vazia explica e oferece a ação que resolve (`Vazio`).
- Carregando: esqueleto no formato do conteúdo (`Esqueleto`), nunca um giro solto no meio.
- Formulário: erro embaixo do campo + resumo no fim (`AvisoErro`) + balão.

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
