# 07 · Cores e medidas do Plus

> **Para a IA.** As cores, a fonte, os raios, as sombras e as medidas são **os do Sistema
> Contábil Plus**. Os tokens de cor moram em `modelo/frontend/src/index.css` (cópia do
> `index.css` do Plus). Raios e sombras não são tokens: são as classes literais que o Plus usa.
> Regra: **copie as classes do Plus/kit; não invente valores novos.** A única folga é a paleta,
> e só do jeito descrito em "O que pode variar na paleta".

## Como funciona

`src/index.css` tem quatro partes:

1. `:root { ... }`: valores do tema **claro**.
2. `.escuro { ... }`: valores do tema **escuro** (classe `escuro` no `<html>`, posta por
   `aplicarTema()` em `src/tema/tema.ts`).
3. `@theme inline { ... }`: liga os tokens principais a classes do Tailwind 4 (`bg-superficie`,
   `text-verde-texto`, `bg-destaque`...) e define a fonte (`--font-sans`). **Não mexa** neste bloco.
4. Regras gerais: `body` (fundo, cor, Inter, sem seleção de texto fora dos campos), barra de
   rolagem discreta, `html.sem-desfoque` ("Reduzir desfoque"), `@keyframes deslizar` e
   `color-scheme` claro/escuro.

O `@custom-variant dark (&:where(.escuro, .escuro *));` faz o `dark:` do Tailwind funcionar com a
classe `.escuro`. O tema começa pelo que está guardado (`localStorage`, chave `tema`) ou, sem nada
guardado, pelo tema do Windows. (No Plus a escolha fica guardada no Python, por usuário.)

Tokens sem classe no `@theme` (`--zebra`, `--st-*`, `--tp-*`, `--tinta-*`, `--saida`,
`--menu-brilho-*`, `--cena-*`) são usados como `var(--nome)`: `bg-[var(--zebra)]`,
`cor="var(--st-prazo)"`, `style={{ background: "var(--tinta-amarelo)" }}`.

## Regras

- **Copie as classes do Plus/kit; não invente valores novos.** Cor só por token
  (`bg-verde`, `text-texto-2`, `var(--st-vencida)`), raio e sombra só com as classes das tabelas
  abaixo. Nada de `bg-green-600`, `#3a7` solto, `rounded-[13px]` ou `shadow-xl` novos.
- Transparência sobre token é permitida e é como o Plus faz: `bg-verde/12`, `border-verde/40`,
  `ring-verde/15`, `text-tinta/70`, `bg-campo/60`.
- **Texto por cima do verde ou do vermelho é `text-white`** (não existe token "sobre acento").
  Por isso o `--verde` é escuro o bastante para letra branca.
- **Verde como texto usa `text-verde-texto`** (mais escuro no claro, mais claro no escuro, para
  ler bem). `text-verde` só em ícone ou detalhe pequeno.
- **Âmbar (atenção) não é token:** use as classes do Tailwind como o Plus,
  `bg-amber-500/12 text-amber-700 dark:text-amber-300` (selo) ou
  `border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300` (competência fora do mês).
- **Texto tem 3 níveis e só 3:** `text-texto` (principal), `text-texto-2` (secundário),
  `text-texto-3` (legenda, placeholder, ícone apagado).
- **As cores de situação e de tipo têm significado fixo** em todas as telas e em todos os
  sistemas (`--st-*` e `--tp-*`, tabela abaixo). Nunca use `--st-vencida` para uma categoria.
- **Números sempre `tabular-nums`** (colunas alinham).
- Sobre o menu lateral e a tela de entrada, o texto é `text-tinta` (com opacidade: `text-tinta/70`).

## Tokens: superfícies

| Token | Claro | Escuro | Para que serve | Classe |
|---|---|---|---|---|
| `--fundo` | `#f4f0ea` | `#191816` | Atrás de tudo (área da tela). | `bg-fundo` |
| `--superficie` | `#ffffff` | `#22211e` | Cartões, janelas, listas abertas, cabeçalho de tabela. | `bg-superficie`, `ring-superficie` |
| `--vidro` | `rgb(255 255 255 / 0.72)` | `rgb(34 33 30 / 0.72)` | Painéis translúcidos (busca Ctrl+K, cartão da entrada). Sempre com `backdrop-blur-2xl`. | `bg-vidro` |
| `--campo` | `rgb(43 42 40 / 0.05)` | `rgb(255 255 255 / 0.06)` | Fundo de campos, botão leve, hover de itens, trilho de barras. | `bg-campo` |
| `--borda` | `rgb(43 42 40 / 0.1)` | `rgb(255 255 255 / 0.09)` | Bordas e divisórias de 1 px. | `border-borda`, `bg-borda` |
| `--zebra` | `rgba(60, 50, 30, 0.065)` | `rgba(255, 255, 255, 0.045)` | Linha alternada da tabela densa. | `bg-[var(--zebra)]` |

## Tokens: texto

| Token | Claro | Escuro | Para que serve | Classe |
|---|---|---|---|---|
| `--texto` | `#2b2a28` | `#f2ede6` | Texto principal, valores. | `text-texto` |
| `--texto-2` | `#5e564e` | `#c9c0b5` | Rótulos de campo, subtítulos, texto de apoio. | `text-texto-2` |
| `--texto-3` | `#70675d` | `#9a9288` | Legendas, placeholder, ícones apagados, "—" de vazio. | `text-texto-3` |

## Tokens: ações e estados

| Token | Claro | Escuro | Para que serve | Classe |
|---|---|---|---|---|
| `--primario` | `#2b2a28` | `#e6ded3` | Fundo do botão principal (uma ação principal por tela). | `bg-primario` |
| `--primario-texto` | `#f4f0ea` | `#1b1a18` | Texto sobre o primário. | `text-primario-texto` |
| `--verde` | `#2f8257` | `#2e8257` | O acento: foco (anel), marcado, confirmar, dia escolhido, botão `verde`. | `bg-verde`, `ring-verde/25`, `border-verde/50`, `text-verde` (ícone) |
| `--verde-texto` | `#245f42` | `#8ed3ae` | Verde usado como **texto** (link, selo verde, "Mudar minha senha"). | `text-verde-texto` |
| `--vermelho` | `#c0432f` | `#e8735f` | Apagar, erro de campo, atrasado. | `bg-vermelho`, `text-vermelho`, `border-vermelho/50`, `bg-vermelho/10` |
| `--grafite` | `#2b2a28` | = claro | O grafite da UP. | `bg-grafite`, `text-grafite` |
| `--bege` | `#ddd0c8` | = claro | O bege da UP (ícone vazio do avatar da entrada). | `bg-bege`, `text-bege` |

## Tokens: menu lateral e entrada

| Token | Claro | Escuro | Para que serve | Classe |
|---|---|---|---|---|
| `--menu` | `#ebe4da` | `#262420` | Fundo do menu lateral. | `bg-menu` |
| `--tinta` | `#2b2a28` | `#ffffff` | Texto e ícones sobre o menu e sobre a tela de entrada. | `text-tinta`, `bg-tinta/[0.06]`, `ring-tinta/15` |
| `--destaque` | `#2f8257` | `#ddd0c8` | Barrinha e ícone do item ativo do menu, contador, pontinho de seção dobrada. | `bg-destaque`, `text-destaque` |
| `--menu-brilho-1` | `rgb(255 255 255 / 0.65)` | `rgb(221 208 200 / 0.1)` | Brilho suave no canto de cima do menu. | `bg-[radial-gradient(...)]` no `MenuLateral.tsx` |
| `--menu-brilho-2` | `rgb(62 154 107 / 0.12)` | `rgb(62 154 107 / 0.1)` | Brilho no canto de baixo do menu (tom do verde). | idem |
| `--cena-1` | `#fbf8f3` | `#3a3632` | Centro do degradê de fundo da entrada. | `FundoAnimado` (`rotas/login/FundoAnimado.tsx`) |
| `--cena-2` | `#efe7dc` | `#22201d` | Meio do degradê. | idem |
| `--cena-3` | `#e3d8ca` | `#171614` | Borda do degradê. | idem |
| `--clarao` | `1` | `1` | Intensidade dos clarões (reservado, igual ao Plus). | — |

## Tokens: situação e tipo (significado fixo)

Usados como `var(--...)` nas props `cor` dos gráficos (`<Indicador cor="var(--st-prazo)" ...>`)
e em `COR_SITUACAO` (`src/dados/exemplo.ts`). Não têm classe Tailwind. Vêm da Visão geral do
Plus: cada cor diz sempre a mesma coisa em todos os gráficos.

| Token | Claro | Escuro | Significado (sempre) |
|---|---|---|---|
| `--st-prazo` | `#2f8257` | `#4fae7c` | Entregue no prazo / concluído / bom |
| `--st-atraso` | `#c98a1b` | `#e0a845` | Entregue com atraso / atenção |
| `--st-vencida` | `#c0432f` | `#e8735f` | Passou do prazo e não foi entregue / problema |
| `--st-aberta` | `#d6cdc1` | `#4a443d` | A vencer / ainda não começou / neutro |
| `--tp-rotina` | `#4f6fa8` | `#7b98d1` | Tipo "rotina" (no modelo: "em andamento") |
| `--tp-tarefa` | `#8a5a83` | `#b68aae` | Tipo "tarefa" |
| `--tp-estudo` | `#2f7f7a` | `#5fb0aa` | Tipo "estudo" |

## Tokens: tintas de linha

As cores que a pessoa usa para pintar linhas na Escrituração do Plus (as mesmas do sistema
antigo). Use-as quando o sistema também deixar "pintar" uma linha ou célula.

| Token | Claro | Escuro |
|---|---|---|
| `--tinta-amarelo` | `#fbefc0` | `#4a4120` |
| `--tinta-verde` | `#dcefe2` | `#1f3a2a` |
| `--tinta-vermelho` | `#f8dad1` | `#4a2620` |
| `--tinta-azul` | `#dee3f5` | `#262d4a` |
| `--tinta-laranja` | `#fae1cc` | `#4a3220` |
| `--tinta-roxo` | `#e7ddf2` | `#3a2a4a` |
| `--tinta-cinza` | `#e5e0d9` | `#36322d` |
| `--saida` | `#c44a35` | `#f08a78` |

`--saida` é a cor do **valor negativo** (saída) na grade da Escrituração do Plus:
`text-[var(--saida)]` quando o valor é menor que zero.

Catálogo de cores do modelo, como aparece na tela "Todas as peças":

![Cores (tokens), claro](../imagens/claro/peca-cores.png)
![Cores (tokens), escuro](../imagens/escuro/peca-cores.png)

## O que pode variar na paleta (e como)

O padrão é o Plus. Um sistema pode ter **pequenas diferenças de paleta**, desde que não fuja do
padrão nem dê trabalho na hora de unir ao Plus.

Pode mudar o **valor** (não o nome) destes tokens, sempre nos **dois** temas (`:root` e `.escuro`):

| Token | Cuidado |
|---|---|
| `--verde` e `--verde-texto` (o acento) | Mudam juntos. `--verde` continua escuro o bastante para `text-white` por cima (botão `verde`, caixa marcada, dia escolhido). `--verde-texto` precisa ler bem sobre `--superficie` (contraste 4,5:1). |
| `--destaque` (item ativo do menu) | Legível sobre `--menu`; o contador usa `text-white` no claro e `#1b1a18` no escuro. |
| `--menu` (e `--menu-brilho-2`, o brilho no tom do verde) | Continua claro no tema claro e escuro no tema escuro (o `--tinta` não muda). |

Como fazer:

1. Mude só esses valores no `src/index.css`, nos dois blocos. **Mesmos nomes**, nenhum token novo.
2. Registre no `docs/visual.md` do projeto, numa seção **"Diferenças em relação ao Plus"**:
   token, valor do Plus, valor novo, motivo.
3. Confira em claro e escuro: botão `verde`, selo verde, foco dos campos, item ativo do menu,
   calendário (dia escolhido).

Cores escritas direto no código copiado do Plus **não acompanham** a troca e ficam como estão
(é aceito): a sombra verde do dia escolhido no `SeletorData`
(`shadow-[0_4px_12px_-4px_rgba(62,154,107,0.7)]`) e os clarões verdes do `FundoAnimado`.

## O que não pode variar na paleta

- Criar token com outro nome, ou apagar algum dos tokens acima.
- Escrever cor direto na tela, fora do que o Plus já faz (lista no fim do capítulo).
- Mexer na estrutura: `--fundo`, `--superficie`, `--vidro`, `--campo`, `--borda`, os 3 níveis
  de texto, `--primario`, `--vermelho`, `--tinta`, `--cena-*`, as cores de situação/tipo
  (`--st-*`, `--tp-*`) e as tintas de linha ficam com os valores do Plus.
- Fonte, raios, sombras, desfoque, medidas e animações: iguais ao Plus, sempre.

## Raios (classes literais do Plus)

Os raios `rounded-lg`, `rounded-xl` e `rounded-2xl` são os **padrões do Tailwind** (8, 12 e
16 px). Os maiores são escritos com o valor, como no Plus.

| Classe | px | Onde |
|---|---|---|
| `rounded-[3px]` | 3 | Quadradinho de cor da legenda (`Chave`, `Indicador`). |
| `rounded-[5px]` / `rounded-[6px]` | 5 / 6 | Caixinha da `Lista` múltipla / `CaixaSelecao`, colunas do gráfico `Colunas`. |
| `rounded-md` | 6 | `kbd` ("Ctrl K", "Esc"), botãozinho de copiar e de limpar. |
| `rounded-lg` | 8 | `Botao tamanho="p"`, `Dado`, `Dica`, botões pequenos de ícone, meses da `GradeMeses`, título de seção do menu. |
| `rounded-[10px]` | 10 | Pílula do `Segmentado` (dentro do trilho de 12 px). |
| `rounded-xl` | 12 | `Botao` médio, `CampoRotulado`, `Lista`, `SeletorData`, `CampoBusca`, trilho do `Segmentado`, itens de menu, de lista e da busca, item do menu lateral, `AvisoErro`. |
| `rounded-2xl` | 16 | `Campo` grande, `Botao tamanho="g"`, caixas flutuantes (`Lista` aberta, `MenuSuspenso`, menu da conta, calendário, competência). Os balões (`Toaster`) usam `borderRadius: 16`. |
| `rounded-[20px]` | 20 | Cartões, painéis de gráfico, `FaixaIndicadores`, tabela, `Esqueleto`, busca Ctrl+K. |
| `rounded-[24px]` | 24 | `Dialogo` e `Gaveta`. |
| `rounded-[28px]` | 28 | Cartão de vidro da tela de entrada. |
| `rounded-full` | — | `Botao tamanho="icone"`, `Selo`, avatares, interruptor, contadores, barras. |

`IconeApp` usa cantos de 28% do tamanho (`borderRadius: tamanho * 0.28`).

## Sombras e desfoque (classes literais do Plus)

| Classe | Onde |
|---|---|
| `shadow-[0_1px_2px_rgba(0,0,0,0.04)]` | Cartão parado, painel de gráfico, tabela, formulário. |
| `hover:shadow-[0_16px_38px_-16px_rgba(0,0,0,0.25)]` | Cartão com o mouse em cima. |
| `shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]` | Caixas flutuantes: `Lista`, `MenuSuspenso`, menu da conta, `SeletorCompetencia`. |
| `shadow-[0_24px_60px_-18px_rgba(0,0,0,0.4)]` | Caixa do `SeletorData` e do `SeletorHora`. |
| `shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]` | `Dialogo`, `Gaveta`, busca Ctrl+K, menu automático aberto por cima. |
| `shadow-sm` | Botões cheios (`primario`, `verde`), pílula do `Segmentado`. |
| `shadow-lg` | `Dica`, aviso de Caps Lock. |
| `shadow-[0_40px_100px_-30px_rgba(60,45,30,0.35)]` + `dark:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]` | Cartão de vidro da entrada. |
| `shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]` | Avatar da entrada. |
| `bg-white/80 shadow-[0_1px_2px_rgba(60,45,30,0.08),0_6px_16px_-10px_rgba(60,45,30,0.35)]` (claro) / degradê `white/[0.16]→white/[0.09]` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_6px_16px_-8px_rgba(0,0,0,0.6)]` (escuro) | Pílula do item ativo do menu. |
| `shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]` | `IconeApp`. |

| Desfoque | Onde |
|---|---|
| `backdrop-blur-2xl` | Vidro: busca Ctrl+K e cartão da entrada (este também com `backdrop-saturate-150`). |
| `backdrop-blur-sm` | Véu escuro atrás do `Dialogo` (`bg-black/30`). |
| `backdrop-blur-[2px]` | Véu atrás da busca Ctrl+K (`bg-black/25`). |
| `backdrop-blur-md` | Botão de tema da entrada. |

"Reduzir desfoque" (menu da conta) desliga todos de uma vez (`html.sem-desfoque`).

## Escala de texto (a que o código usa)

Tamanhos em px, com `text-[NNpx]`. Não invente tamanhos novos; escolha o da função.

| Tamanho | Peso | Uso | Exemplo no código |
|---|---|---|---|
| 28 | semibold, `tracking-tight`, `tabular-nums` | Número grande de indicador | `Indicador` |
| 24 | semibold, `tracking-tight` | **Título de tela** | `CabecalhoTela` (`h1`) |
| 22 | semibold | Número no meio da rosca | `Rosca` |
| 19 | semibold, `tracking-tight` | **Título de janela** (diálogo) | `Dialogo` |
| 18 | semibold | Título da ficha (gaveta) | `Gaveta`, cabeçalho da ficha em `TelaCadastro.tsx` |
| 16 | semibold / normal | Título do estado vazio; texto da busca Ctrl+K | `Vazio`, `BuscaRapida` |
| 15 | medium / semibold | Campo grande, botão grande, "Olá, Fulano" da entrada, título de seção | `Campo`, `Botao tamanho="g"`, `TelaLogin`, `Secao` em `TelaPecas.tsx` |
| 14.5 | semibold | Título de cartão de gráfico | `Painel` (gráficos) |
| 14 | normal | **Corpo**: campo de formulário, item do menu lateral, lista suspensa, nome no cartão, descrição do diálogo | `CampoRotulado`, `MenuLateral`, `Lista`, `Dialogo` |
| `text-sm` (14) | medium | Botão médio | `Botao tamanho="m"` |
| 13.5 | normal | Subtítulo de tela, busca da barra, item de menu suspenso e do menu da conta | `CabecalhoTela`, `CampoBusca`, `ItemMenu` |
| 13 | medium / normal | **Secundário**: rótulo de campo, botão pequeno, texto de tabela, valor de `Dado`, nome do sistema na entrada (caixa alta, `tracking-[0.3em]`) | `CampoRotulado` (label), `Botao tamanho="p"`, `TelaTabela`, `TelaLogin` |
| 12.5 | normal / medium | Contagem da barra, dica (tooltip), nomes em `Pessoas`, aviso de Caps Lock | `TelaCadastro.tsx`, `Dica`, `Pessoas` |
| 12 | normal | **Legenda**: dica/erro sob o campo, "o que mede" e "leitura" dos gráficos, linha de estado da base | `CampoRotulado`, `ErroDoCampo`, `Painel` |
| 11.5 | medium / normal | Selo, legenda de gráfico, explicação do indicador | `Selo`, `Chave`, `Indicador` |
| 11 | semibold, CAIXA ALTA, `tracking-[0.06em]` | Cabeçalho de tabela; título de grupo da busca; versão na entrada | `TelaTabela`, `BuscaRapida`, `TelaLogin` |
| 10.5 | semibold, CAIXA ALTA, `tracking-[0.06em]` a `tracking-[0.14em]` | **Rótulo em caixa alta**: `Dado` (0.06em), `TituloGrupo` (0.08em), seções do menu (0.14em) | `Dado`, `TituloGrupo`, `MenuLateral` |
| 9.5 | medium, CAIXA ALTA, `tracking-[0.26em]` | Nome do sistema embaixo do logo da UP no menu; número do contador com menu recolhido | `MenuLateral` (`NOME_SISTEMA`) |

Pesos: `font-semibold` para títulos e números, `font-medium` para rótulos e botões, normal para o
resto. Títulos sempre com `tracking-tight`; caixa alta sempre com tracking aberto.

## Alturas de controles

| Altura | Onde |
|---|---|
| `h-8` (32 px) | `Botao tamanho="p"`; opção do `Segmentado`; título de seção do menu. Linha da tabela densa (32 px, virtual). |
| `h-9` (36 px) | **Tudo da barra de ferramentas**: `CampoBusca`, `Segmentado`, `SeletorCompetencia`, botões da barra (`className="h-9"`), «…» (`size-9`); `Botao tamanho="icone"` (`size-9 rounded-full`); `ItemMenu`; `Lista compacto`; meses e dias do calendário; cabeçalho e rodapé da tabela; botão "Buscar…" do menu. |
| `h-10` (40 px) | **Formulário**: `Botao` médio (padrão), `CampoRotulado`, `Lista`/`Escolha`, `SeletorData`, `SeletorHora`; item do menu lateral. |
| `h-11` (44 px) | Linha da lista (modo lista do cadastro); item da busca Ctrl+K. |
| `h-12` (48 px) | `Campo` grande (entrada); `Botao tamanho="g"`. |
| `h-14` (56 px) | Campo da busca Ctrl+K. |

Menores: `Selo` 22 px, `CaixaSelecao` 18 px, `Interruptor` 30 × 18 px.

## Espaçamentos

| Medida | Onde |
|---|---|
| `px-6` (24 px) | Margem lateral de toda tela: `CabecalhoTela` (`px-6 pb-3 pt-6`) e o conteúdo abaixo (`px-6`, ou `mx-6` na tabela e no formulário). |
| `gap-3.5` (14 px) | Entre cartões e blocos: grade de cartões, coluna do painel, `Esqueleto`. |
| `gap-2` (8 px) | Entre itens da barra de ferramentas e entre botões de rodapé. |
| `gap-4` (16 px) | Entre campos de formulário. |
| `p-4` (16 px) | Miolo do cartão do cadastro. |
| `p-5` / `px-5` (20 px) | Cartões de seção e de gráfico, indicadores. |
| `p-6` (24 px) | Cartão do formulário; miolo da gaveta (`px-6 py-5`). |
| `p-7` (28 px) | Diálogo. |
| `mt-4` | Entre o título da tela e a barra de ferramentas. |
| `my-6` | Divisória entre grupos do formulário. |

Larguras de referência: menu lateral 256 px (aberto) / 72 px (recolhido); gaveta 460 px;
diálogo `max-w-md` (448 px; `confirmar()` 400 px); busca Ctrl+K 600 px; cartão da entrada
420 px; cartões com no mínimo 320 px (`grid-cols-[repeat(auto-fill,minmax(320px,1fr))]`).

As telas se ajustam à **largura disponível** (container queries, porque a `<main>` tem
`@container`), não à da janela: `@2xl` (672 px) formulário em 2 colunas, `@3xl` (768 px)
duas colunas no catálogo de peças, `@4xl` (896 px) cartões de gráfico em 2 colunas.

## Cores escritas direto (as que o Plus já tem)

Estas cores estão escritas no código **do Plus** e, por isso, também no kit. São as únicas
aceitas fora dos tokens. Não acrescente outras.

| Onde | O quê |
|---|---|
| `Dica` e balão do menu recolhido | `bg-[#1b1a18] text-white` (dica sempre escura, nos dois temas). |
| Contador do menu (`MenuLateral.tsx`) | `text-white dark:text-[#1b1a18]` sobre `bg-destaque`. |
| Pílula do item ativo do menu | `bg-white/80` e as sombras da tabela acima. |
| Texto sobre verde/vermelho | `text-white` (botões, caixa marcada, dia escolhido, `confirmar()`, `Confirmacao`). |
| Âmbar de atenção | `amber-500` / `amber-700` / `amber-300` do Tailwind (`Selo tom="ambar"`, `SeletorCompetencia`). |
| `lib/extras.ts` (`CORES`) | 8 tons fixos para `Avatar`, `IconeApp` e o véu da ficha (`corPorTexto`). Letra branca por cima. |
| `rotas/login/Avatar.tsx` (`CORES`, `#2B2A28`) | Cores do avatar da entrada por login; grafite quando ninguém foi digitado. |
| `rotas/login/FundoAnimado.tsx` (`CLAROES`) | 4 clarões do fundo da entrada (bege, verde, cobre, verde-acinzentado). |
| `rotas/login/TelaLogin.tsx` | Borda `border-white/40` (`dark:border-white/10`) e sombras do cartão de vidro. |
| Véus | `bg-black/30` (diálogo), `bg-black/25` (busca), `bg-black/20` (gaveta). |
| `backend/app.py` | `background_color="#2B2A28"` da janela (o grafite: a janela não pisca branco ao abrir). |
