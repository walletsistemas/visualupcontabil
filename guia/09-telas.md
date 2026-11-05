# 09 · Telas (modelos e como montar)

> **Para a IA.** Toda tela do sistema segue um destes modelos, que são os do Sistema Contábil
> Plus. A casca (entrada, janela principal, menu lateral, busca Ctrl+K) é **igual ao Plus** em
> todos os sistemas; o que muda são os módulos do menu e as telas de cada módulo. Para cada tela
> antiga do Qt, escolha o modelo, copie a pasta correspondente de `modelo/frontend/src/rotas/` e
> troque dados, rótulos e ações. Não desenhe uma tela do zero.

Os nomes visíveis do modelo ("Meu Sistema", "Cadastro", "Painel", "Projeto Alfa", "Ana Souza")
são **exemplo**. Na cirurgia, nomes de módulos, seções do menu e rótulos vêm do sistema antigo.

| Modelo | Arquivo | Para telas do tipo |
|---|---|---|
| Entrada (login) | `rotas/login/TelaLogin.tsx` (+ `FundoAnimado.tsx`, `Avatar.tsx`) | Login, igual ao do Plus. |
| Janela principal | `componentes/layout/JanelaPrincipal.tsx` | A moldura de todos os módulos (menu + área). |
| Menu lateral | `componentes/layout/MenuLateral.tsx` + `modulos.ts` | Navegação. |
| Busca Ctrl+K | `componentes/layout/BuscaRapida.tsx` | Ir a qualquer módulo, ação ou item. |
| Cadastro (cartões/lista + ficha) | `rotas/cadastro/TelaCadastro.tsx` | Empresas, clientes, pessoas: coisas com nome e detalhes. |
| Painel | `rotas/painel/TelaPainel.tsx` | Visão geral, resumo, indicadores. |
| Tabela densa | `rotas/tabela/TelaTabela.tsx` | Muitas linhas e colunas, conferência, lançamentos. |
| Formulário | `rotas/formulario/TelaFormulario.tsx` | Criar/editar com muitos campos. |
| Todas as peças | `rotas/pecas/TelaPecas.tsx` | Catálogo (não vai para o sistema da pessoa). |

## Como os módulos são registrados

Três lugares, sempre os três (mesmo jeito do Plus):

1. **O mapa** `src/componentes/layout/modulos.ts`: `SECOES` é a lista de seções do menu e os
   módulos de cada uma. O menu lateral e a busca Ctrl+K leem daqui.

   ```ts
   export type Modulo = { chave: string; nome: string; icone: LucideIcon; descricao: string; busca?: string; contador?: number };
   export type Secao = { titulo: string; modulos: Modulo[]; soAdmin?: boolean };

   export const SECOES: Secao[] = [
     { titulo: "Gestão", modulos: [
       { chave: "painel", nome: "Painel", icone: LayoutDashboard, descricao: "Indicadores e gráficos do mês.", busca: "inicio dashboard resumo visao geral" },
       { chave: "cadastro", nome: "Cadastro", icone: LayoutGrid, descricao: "Cartões ou lista, busca e ficha lateral.", busca: "itens cartoes ficha", contador: 3 },
     ] },
     { titulo: "Modelos", soAdmin: true, modulos: [ /* ... */ ] },
   ];
   ```

   `busca` = palavras extras para a busca rápida (sinônimos, o nome antigo da tela).
   `contador` = número na bolinha ao lado do nome (pendências; no Plus vem do resumo do dia).
   `soAdmin` = a seção só aparece para quem tem `perfil === "admin"`
   (`secoesDoUsuario(usuario)`). `acharModulo(chave)` devolve o módulo pela chave.
   Quando os sistemas forem unidos ao Plus, estas linhas entram no `SECOES` de lá: use chaves
   que não colidam com as do Plus.

2. **A tela** em `src/rotas/<modulo>/Tela<Nome>.tsx` (uma pasta por módulo, como no Plus; peças
   que só esse módulo usa ficam na mesma pasta).

3. **A ligação** em `src/main.tsx`: a tela é lida em partes (`lazy`) e carregada ao fundo, como
   no Plus.

   ```tsx
   const telas = {
     painel: () => import("@/rotas/painel/TelaPainel").then((m) => ({ default: m.TelaPainel })),
     // nova: () => import("@/rotas/nova/TelaNova").then((m) => ({ default: m.TelaNova })),
   };
   const TelaPainel = lazy(telas.painel);

   // dentro de PaginaModulo:
   const tela: Record<string, ReactNode> = {
     painel: <TelaPainel aoIr={irPara} />,
     cadastro: <TelaCadastro aoNovo={() => irPara("formulario")} />,
   };
   ```

   `carregarTelasAoFundo()` lê todas as telas quando a janela está à toa, então trocar de
   módulo é instantâneo.

Navegação: TanStack Router com histórico **na memória** (o endereço da janela não muda). Rotas:
`/` (entrada) e `/app/$modulo`. Para ir a outro módulo, a tela recebe uma função (`aoIr`,
`aoNovo`, `aoVoltar`) que chama `irPara(chave)`. Chave desconhecida cai no `painel`. Para abrir
direto num módulo (fotos, testes), use `?tela=<chave>` no endereço.

### Abrir já filtrado ou com um item aberto: `pedidoTela`

É o mecanismo do Plus (`src/lib/pedidoTela.ts`, cópia idêntica). Quem pede vai ao módulo e
deixa um pedido; a tela recebe na hora (se já está aberta) ou assim que abrir.

```ts
// quem pede (busca Ctrl+K, painel...)
aoIr("cadastro");
pedirTela({ tela: "cadastro", acao: "abrir", id: i.id });
```

```tsx
// a tela (TelaCadastro.tsx)
usePedidoTela("cadastro", (p) => {
  if (p.acao === "abertos") setFiltro("abertos");
  if (p.acao === "abrir" && p.id) setQuer(p.id);   // abre a ficha quando a lista chegar
});
```

O tipo `PedidoTela` tem `tela`, `acao` e, opcionais, `id`, `uid`, `pessoa`, `titulo` e
`voltar` (`{ para, rotulo }`, para a tela mostrar "Voltar para…"). Exemplos no modelo: os números
do `TelaPainel` mandam `acao: "abertos"`; o item da busca Ctrl+K manda `acao: "abrir"`.
Ação nova = um texto novo em `acao`, tratado no `usePedidoTela` da tela. Não mude o arquivo.

---

## Entrada (login)

Arquivo: `rotas/login/TelaLogin.tsx` (quase cópia do Plus). Prop: `aoEntrar()`. Fundo em
`FundoAnimado.tsx` (cópia do Plus); a bolinha da pessoa em `Avatar.tsx`.

Anatomia, de cima para baixo:

- **Fundo animado** (`FundoAnimado`): degradê radial com `--cena-1/2/3` e 4 clarões grandes
  que flutuam devagar (só `transform`).
- Botão de tema no canto superior direito (36 px, redondo, `bg-tinta/10 backdrop-blur-md`).
- **Logo da UP** (`/logo_simbolo_escura.png` no claro, `/logo_simbolo.png` no escuro, 54 px) +
  `NOME_SISTEMA` em caixa alta 13 px `tracking-[0.3em]` `text-tinta/70`.
- **Cartão de vidro** (até 420 px): `rounded-[28px] border border-white/40 bg-vidro
  backdrop-blur-2xl backdrop-saturate-150 px-8 pb-7 pt-16`.
- **Avatar de 96 px saindo por cima** do cartão: ícone neutro antes; ao digitar o usuário,
  vira a foto ou as iniciais na cor da pessoa (troca com mola) e aparece "Olá, <nome>".
- `Campo` usuário (ícone `User`) e senha (ícone `KeyRound`, olho para mostrar em `fim`). Enter
  no usuário pula para a senha. **Caps Lock ligado**: um balãozinho escuro embaixo da senha
  ("Caps Lock está ligado").
- "Lembrar meu login" (`CaixaSelecao`) à esquerda e **"Mudar minha senha"** (link
  `text-verde-texto`) à direita.
- Botão **Entrar** (`primario`, `tamanho="g"`, largura toda, com `carregando`).
- Botão **Base de Dados** (`leve`, ícone `Database`): no Plus, escolhe a pasta da base.
- **Linha de estado da base**: pontinho verde + "Base de dados conectada" (12 px).
- Versão no canto inferior direito (11 px, `text-tinta/45`).
- **Erro**: o cartão **treme**, o campo que falta fica vermelho e um balão diz o quê.

![Entrada, claro](../imagens/claro/entrada.png)
![Entrada com usuário, claro](../imagens/claro/entrada-com-usuario.png)
![Entrada, escuro](../imagens/escuro/entrada.png)

Escuro com usuário: `../imagens/escuro/entrada-com-usuario.png`.

![Entrada em movimento](../imagens/animacoes/entrada.gif)

**Como ligar a entrada no sistema** (o visual não muda; só a lógica):

1. No modelo qualquer usuário entra. Ligue nas portas do Python como no Plus
   (`sessaoApi.info`, `.usuario`, `.entrar`): uma porta que acha a pessoa pelo login (nome, foto)
   e outra que confere a senha com o motor antigo.
2. Em `entrar()`: depois das checagens de vazio, chame a porta; sucesso → `aoEntrar()`; erro →
   `falhar(motivo)` (treme + balão com o `detail` do Python).
3. "Lembrar meu login": guarde só o usuário (nunca a senha).
4. "Mudar minha senha", "Base de Dados" e a linha de estado: ligue como no Plus. Se o sistema não
   tem troca de base, a linha de estado mostra a pasta em uso.
5. A versão (`v1.0.0`) tem que bater com `backend/versao.py`.

### Sistema sem login

Se o sistema antigo não tem login:

- em `main.tsx`, comece direto num módulo (`initialEntries: ["/app/<chave do módulo inicial>"]`)
  e apague `rotas/login/`;
- em `<JanelaPrincipal>`, **não passe** `usuario` nem `aoSair`: o rodapé do menu vira um botão
  **"Preferências"** (engrenagem) com menu automático, tema escuro e reduzir desfoque; "Meu
  perfil" e "Sair" somem do menu e da busca Ctrl+K sozinhos;
- seções marcadas com `soAdmin: true` **somem** sem usuário (`secoesDoUsuario` só mostra para
  `perfil === "admin"`): tire o `soAdmin` das seções que devem aparecer.

## Janela principal

Arquivo: `componentes/layout/JanelaPrincipal.tsx` (quase cópia do Plus, sem a sincronia de 20 s
e os avisos que dependem do servidor de lá). Props: `modulo` (chave ativa), `aoIr(chave)`,
`aoSair?()`, `usuario?` (`{ nome, cargo, perfil }`), `children` (a tela).

Anatomia:

```text
┌──────────────┬──────────────────────────────────────────────┐
│ MENU LATERAL │  <main class="@container overflow-auto">     │
│ 256 px       │    CabecalhoTela (título, subtítulo, ações)   │
│ (72 recolh.) │    barra de ferramentas                      │
│              │    conteúdo (px-6)                           │
└──────────────┴──────────────────────────────────────────────┘
  + BuscaRapida (por cima de tudo, quando aberta)
```

- Fundo `bg-fundo`. **Sem barra de título própria**: a barra de título é a do Windows, e a tela
  usa o espaço todo. Não crie cabeçalho fixo de aplicativo em cima.
- A `<main>` tem `@container`: as telas se ajustam à largura **disponível** (com o menu aberto
  ou recolhido), usando `@2xl:`, `@3xl:`, `@4xl:`, e não à largura da janela.
- O tema claro/escuro é trocado aqui (`trocarTema`) e repassado ao menu e à busca.
- O usuário está **fixo no modelo** (`usuario={{ nome: "Ana Souza", cargo: "Administradora",
  perfil: "admin" }}` em `main.tsx`). Na cirurgia, passe o usuário que entrou (vindo do Python).

![Janela principal com o painel, claro](../imagens/claro/painel.png)
![Janela principal com o painel, escuro](../imagens/escuro/painel.png)

## Menu lateral

Arquivo: `componentes/layout/MenuLateral.tsx` (quase cópia do Plus, sem as janelas e contadores
de módulos de lá: Novidades, Sugestões, Seu dia, e-mail). Props: `usuario?`, `modulo`, `tema`,
`aoIr(chave)`, `aoTrocarTema()`, `aoSair?()`.

Anatomia, de cima para baixo:

| Parte | Medidas e comportamento |
|---|---|
| Marca | Faixa de 72 px: **logo da UP** (`logo_simbolo_escura.png` no claro, `logo_simbolo.png` no escuro, 28 px de altura) e, embaixo, `NOME_SISTEMA` em caixa alta 9.5 px `tracking-[0.26em]`; botão de recolher à direita. Recolhido: só o logo (42 px), que vira o ícone de "abrir" no hover. |
| Buscar | Botão `h-9` "Buscar…" com `Ctrl K`; dispara o evento `abrir-busca`. |
| Seções | Título 10.5 px caixa alta `tracking-[0.14em]`. **Clique dobra a seção** (mola), e o menu lembra quais ficaram dobradas. Seção dobrada com o módulo ativo dentro mostra um pontinho `bg-destaque`. Recolhido: os títulos viram traços de 24 px. |
| Itens | `h-10 rounded-xl px-3`, ícone 19 px, texto 14 px. Ativo: **pílula** clara (`bg-white/80` + sombra; no escuro, degradê branco translúcido) que **desliza** de um item ao outro, barrinha `bg-destaque` de 3 × 20 px à esquerda, ícone `text-destaque` e texto `font-medium`. Contador: bolinha à direita (`bg-destaque` no ativo), ou no canto do ícone com o menu recolhido. Recolhido: o nome aparece num balão escuro ao passar o mouse. |
| Conta | Embaixo, com borda em cima: iniciais em bolinha de 36 px `bg-verde` + nome + cargo. Abre um menu: *Meu perfil*, **Preferências** (*Menu automático*, *Tema escuro*, *Reduzir desfoque*, cada um com interruptor) e *Sair*. Sem `usuario`: botão "Preferências" (ícone `Settings2`) com o mesmo menu de preferências. |

`NOME_SISTEMA` (exportado de `MenuLateral.tsx`) é o nome do sistema embaixo do logo da UP, no
menu e na entrada (no Plus: "Sistema Contábil"). É **o único texto da marca que muda** de sistema
para sistema; o logo é sempre o da UP.

Larguras: **256 px** aberto, **72 px** recolhido (constantes `ABERTO` e `FECHADO`).

Recolher: botão no topo ou **Ctrl+B**. Fica lembrado.

**Menu automático**: o menu fica recolhido e **abre por cima da tela** quando o mouse chega
(recolhe 350 ms depois que sai). O espaço reservado continua de 72 px, então o conteúdo não
pula. Liga pela preferência ou sozinho quando a janela tem menos de 1100 px.

O que fica guardado no computador (`localStorage`): `menu_recolhido`, `menu_automatico`,
`menu_dobradas`, `tema`, `reduzir-desfoque`.

Fundo `bg-menu`, texto `text-tinta`, com dois brilhos radiais suaves (`--menu-brilho-1/2`) e uma
linha de 1 px à direita.

![Menu recolhido, claro](../imagens/claro/menu-recolhido.png)
![Menu da conta, claro](../imagens/claro/menu-conta.png)

Escuro: `../imagens/escuro/menu-recolhido.png`, `../imagens/escuro/menu-conta.png`.

![Menu lateral em movimento](../imagens/animacoes/menu-lateral.gif)

**Para montar o menu do sistema:** faça o mapa das telas antigas (janelas, abas, itens do
`QMenuBar`), agrupe em 2–4 seções com o Levi, escreva `SECOES` em `modulos.ts` com um ícone do
Lucide para cada módulo e a `descricao` de uma linha, e troque o `NOME_SISTEMA`. O resto do
menu não muda.

## Busca rápida (Ctrl+K)

Arquivo: `componentes/layout/BuscaRapida.tsx` (quase cópia do Plus). Abre com **Ctrl+K** (de
qualquer lugar) ou pelo botão "Buscar…" do menu (`window.dispatchEvent(new Event("abrir-busca"))`).
Esc ou clique fora fecham.

Anatomia: véu `bg-black/25 backdrop-blur-[2px]`; painel de **vidro** (`bg-vidro
backdrop-blur-2xl`) de 600 px, a 14% do topo, `rounded-[20px]`,
`shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]`; campo de 56 px (16 px de letra) com lupa e "Esc";
resultados em grupos com título 11 px caixa alta; item `h-11 rounded-xl` com ícone 18 px, nome
e, à direita, onde fica; item escolhido com `bg-verde/12` e ícone verde.

Grupos, nesta ordem:

1. **Ações** do dia a dia (no modelo: novo cadastro, trocar tema, sair).
2. **Abrir item**: itens do cadastro, só depois de 2 letras digitadas. Escolher um item faz
   `aoIr("cadastro"); pedirTela({ tela: "cadastro", acao: "abrir", id })`.
3. **Ir para · <seção>**: todos os módulos de `secoesDoUsuario(usuario)`.

Filtro (`filtrar`): **cada palavra digitada precisa aparecer** (sem acento); começo de palavra
pesa mais. Nada de casar letras soltas.

![Busca rápida, claro](../imagens/claro/busca-rapida.png)
![Busca rápida, escuro](../imagens/escuro/busca-rapida.png)

**Para adaptar:** troque as `acoes` pelas ações mais usadas do sistema (atalhos de teclado e
itens de menu do Qt); troque `ITENS` pela lista real (vinda da mesma consulta da tela de cadastro)
e faça "Abrir item" mandar o pedido para o módulo certo. O visual e o filtro não mudam.

## Cabeçalho e barra de ferramentas

Arquivo: `componentes/layout/JanelaPrincipal.tsx` (`CabecalhoTela`). Props: `titulo`,
`subtitulo?`, `acoes?` (botões à direita do título), `children` (a barra de ferramentas),
`className`.

Anatomia: `px-6 pt-6 pb-3`; título 24 px semibold; subtítulo 13.5 px `text-texto-2` (uma frase
que diz o que se faz na tela); barra `mt-4 flex flex-wrap items-center gap-2`. Tudo na barra tem
**36 px** de altura.

Ordem fixa da barra (da esquerda para a direita):

1. Filtros: `Segmentado` (Todos/Em aberto), `SeletorCompetencia`.
2. Busca: `CampoBusca` (`flex-1`, ocupa o que sobra).
3. Contagem: `<span className="px-1 text-[12.5px] tabular-nums text-texto-3">{plural(n, "item", "itens")}</span>`.
4. Modo de ver: `Segmentado` com ícones (cartões/lista).
5. Botão principal: `<Botao className="h-9">` (variante `primario`), com ícone.
6. «…»: `MenuSuspenso` com as ações raras (importar, exportar).

Ações que valem para a tela toda, mas não são a principal (ex.: "Relatório"), vão em `acoes`
como `Botao variante="leve" tamanho="p" className="h-9"`.

```tsx
<CabecalhoTela titulo="Cadastro" subtitulo="Cartões para olhar, lista para comparar. Clique para abrir a ficha.">
  <Segmentado valor={filtro} opcoes={[["todos", "Todos"], ["abertos", "Em aberto"]]} aoMudar={setFiltro} />
  <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Buscar por nome, código, responsável, cidade…" className="ml-2" />
  <span className="px-1 text-[12.5px] tabular-nums text-texto-3">{plural(itens.length, "item", "itens")}</span>
  <Segmentado valor={modo} opcoes={[["cartoes", <LayoutGrid key="g" className="size-4" />], ["lista", <List key="l" className="size-4" />]]} aoMudar={setModo} />
  <Botao className="h-9" onClick={aoNovo}><Plus className="size-4" /> Novo</Botao>
  <MenuSuspenso gatilho={...}>...</MenuSuspenso>
</CabecalhoTela>
```

---

## Cadastro (cartões ou lista + ficha)

Arquivo: `rotas/cadastro/TelaCadastro.tsx`. Prop: `aoNovo()`. A tela ocupa a altura toda
(`flex h-full flex-col`): cabeçalho fixo em cima, área de conteúdo que rola
(`min-h-0 flex-1 overflow-y-auto px-6 pb-8`).

**Estados**, nesta ordem: carregando → `Esqueleto`; nada para mostrar → `Vazio` com a ação que
resolve; senão, cartões ou lista.

**Cartões** (`Cartao`): grade `grid-cols-[repeat(auto-fill,minmax(320px,1fr))] items-start gap-3.5`.
Cada cartão:

```text
┌────────────────────────────────────────────┐  rounded-[20px], border-borda, bg-superficie,
│ [Ícone 40]  Nome (14 semibold)     [Selo]  │  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
│             código · cidade (12)           │  p-4, gap-3
│ ┌ CATEGORIA ─────┐ ┌ PRAZO ─────────┐      │  2 × Dado
│ └ Categoria A ───┘ └ 17/10/2026 ────┘      │
│ Progresso                          64%     │  BarraPartes altura 6
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░                          │
├────────────────────────────────────────────┤  border-t, bg-campo/40, px-4 py-2
│ (Pessoas)                     R$ 12.345,00 │
└────────────────────────────────────────────┘
```

Hover: sobe 2 px, borda `border-verde/40`, `shadow-[0_16px_38px_-16px_rgba(0,0,0,0.25)]`. Foco
por teclado: `ring-4 ring-verde/20`; Enter abre. Entram em cascata (`cascata(n)`).

**Lista** (`TabelaItens`): tabela num cartão `rounded-[20px]`; cabeçalho fixo (`sticky top-0`)
11 px caixa alta `text-texto-3`; linhas `h-11` com borda entre elas e hover `bg-campo`; primeira
coluna com `IconeApp` de 26 px + nome `font-medium`; situação como `Selo`; números à direita em
`tabular-nums`.

**Ficha** (`Ficha`): `Gaveta` com o véu na cor do item (`corPorTexto(nome)`); cabeçalho com
`IconeApp` 60 px, nome 18 px, código e selos; corpo em grupos (`TituloGrupo` + grade
`grid-cols-2 gap-1.5` de `Dado`); rodapé com **Editar** (`primario`, `flex-1`) e **Apagar**
(`leve` com `text-vermelho`, que pede `confirmar()`).

**Pedidos que a tela atende** (`usePedidoTela("cadastro", ...)`): `acao: "abertos"` liga o filtro
"Em aberto"; `acao: "abrir"` com `id` abre a ficha daquele item quando a lista chegar.

![Cadastro em cartões, claro](../imagens/claro/cadastro-cartoes.png)
![Cadastro em lista, claro](../imagens/claro/cadastro-lista.png)
![Ficha lateral, claro](../imagens/claro/ficha-lateral.png)

Escuro: `../imagens/escuro/cadastro-cartoes.png`, `../imagens/escuro/cadastro-lista.png`,
`../imagens/escuro/ficha-lateral.png`.

![Ficha e confirmação em movimento](../imagens/animacoes/ficha-e-janela.gif)
![Segmentado e busca em movimento](../imagens/animacoes/busca-e-segmentado.gif)

**Como montar uma tela de cadastro:**

1. Copie `rotas/cadastro/` para `rotas/<modulo>/` e renomeie o componente (`Tela<Nome>`).
2. Crie `src/api/<assunto>.ts` com a função de listar (padrão de `exemploApi`) e a porta em
   `backend/api/<assunto>.py` chamando o serviço.
3. Troque `useQuery({ queryKey: ["itens"], queryFn: exemploApi.itens })` pela sua função.
4. Defina o filtro do `Segmentado` (o filtro mais usado do sistema antigo) e os campos que a
   busca olha (dentro do `semAcento(...)`).
5. Cartão: escolha 1 título, 1 linha de apoio, até 2 `Dado`, 1 `Selo` de situação e o rodapé
   (responsáveis + número). Não ponha tudo no cartão: o resto vai na ficha.
6. Lista: as colunas que a pessoa compara (até 5–6).
7. Ficha: todos os dados em grupos com `TituloGrupo`; ações do item no rodapé.
8. Troque `"cadastro"` no `usePedidoTela` pela chave do módulo.
9. Registre o módulo em `modulos.ts` e `main.tsx`.

Se o sistema antigo só tinha lista, ofereça os dois modos; se a pessoa prefere só um, tire o
`Segmentado` de modo.

## Painel

Arquivo: `rotas/painel/TelaPainel.tsx`. Prop: `aoIr(chave)`. A tela inicial: o que precisa de
atenção, em números e gráficos (como a Visão geral do Plus).

Anatomia:

1. `CabecalhoTela` com saudação pelo horário ("Bom dia/Boa tarde/Boa noite, <nome>"), subtítulo
   que ensina ("Clique num número para ver a lista."), `SeletorCompetencia` + `Segmentado` (só
   eu / equipe) na barra e "Relatório" em `acoes`.
2. Coluna `flex flex-col gap-3.5 px-6`, cada bloco num `motion.div {...cascata(n)}`:
   - `FaixaIndicadores` com 2 a 5 `Indicador` (a faixa se ajusta). Cada número clicável leva à
     lista filtrada: `aoClicar={() => { aoIr("cadastro"); pedirTela({ tela: "cadastro", acao: "abertos" }); }}`.
   - Grade `grid gap-3.5 @4xl:grid-cols-2` com cartões de gráfico (`Painel` dos gráficos, com
     `className="h-full"` para igualar a altura).
   - Cartão largo (largura toda) para o gráfico de tempo (`Colunas`).
   - Uma faixa simples de atividade (avatares + frase).

Cada cartão de gráfico segue: título · o que mede · legenda (`Chave`) · gráfico · **leitura**
(a frase que diz o que concluir). Cores sempre pelos `--st-*` / `--tp-*` com o significado fixo.

![Painel, claro](../imagens/claro/painel.png)
![Painel, escuro](../imagens/escuro/painel.png)

**Como montar um painel:**

1. Pergunte as 4 perguntas que a equipe faz toda manhã ("quantas empresas atrasadas?"). Cada uma
   vira um `Indicador`, com `referencia` ("de 90") e `explica`.
2. Para cada indicador importante, um cartão de gráfico que explica o número (por situação →
   `Rosca` + `BarraPartes`; por pessoa/categoria → `Barras`; no tempo → `Colunas`).
3. Escreva a `leitura` calculada a partir dos dados, não um texto fixo.
4. Os números vêm de uma porta própria (`/api/painel/...`) que soma no Python; a tela não soma
   milhares de linhas.

## Tabela densa

Arquivo: `rotas/tabela/TelaTabela.tsx`. Para muitas linhas (o modelo mostra 600) com leitura
rápida, como planilha (no Plus, a grade da Escrituração segue a mesma ideia).

Anatomia:

- Cabeçalho da tela com `CampoBusca` (`max-w-md`) e a contagem de linhas.
- Cartão que ocupa o resto da altura: `mx-6 mb-6 flex min-h-0 flex-1 flex-col overflow-hidden
  rounded-[20px] border border-borda bg-superficie shadow-[0_1px_2px_rgba(0,0,0,0.04)]`.
- Cabeçalho das colunas `h-9 bg-campo/50`, 11 px caixa alta; **clique ordena** (de novo inverte),
  com seta na coluna ordenada.
- Linhas de **32 px** em **zebra** (`bg-[var(--zebra)]` nas ímpares), 13 px; hover `bg-campo`;
  clique marca a linha (`bg-verde/15` + faixa de 3 px `bg-verde` à esquerda).
- Números à direita em `tabular-nums`; textos longos com `truncate`.
- Rodapé `h-9 bg-campo/50` com o **total**, alinhado à coluna do valor.
- **Virtualizada** (`useVirtualizer`, `estimateSize: () => 32`, `overscan: 12`): só desenha as
  linhas que aparecem. As colunas são `flex` com larguras fixas (`w-16`, `w-32`...) e uma
  `flex-1` para o nome, iguais no cabeçalho e nas linhas.

Colunas definidas numa lista:

```ts
const COLUNAS: Coluna[] = [
  { campo: "id", nome: "Nº", largura: "w-16", direita: true },
  { campo: "nome", nome: "Nome", largura: "flex-1 min-w-[180px]" },
  { campo: "valor", nome: "Valor", largura: "w-32", direita: true },
];
```

Valor negativo (saída) em tabela de lançamentos: `text-[var(--saida)]`, como na Escrituração do
Plus. Linha "pintada" pela pessoa: as tintas `--tinta-*`.

![Tabela, claro](../imagens/claro/tabela.png)
![Tabela, escuro](../imagens/escuro/tabela.png)

**Como montar uma tabela densa:**

1. Copie `rotas/tabela/` para `rotas/<modulo>/`. Troque `LINHAS` pelo `useQuery` da sua porta.
2. Escreva `COLUNAS` com as colunas do `QTableWidget` antigo, na mesma ordem. Números com
   `direita: true`.
3. Copie as mesmas larguras para as `<span>` de cada linha.
4. Ajuste o filtro da busca e o total do rodapé (o total deve vir do Python se for regra).
5. Menu de botão direito, filtro por coluna e edição na célula: acrescente sobre esta base,
   mantendo linha de 32 px, zebra e cabeçalho que ordena.

## Formulário

Arquivo: `rotas/formulario/TelaFormulario.tsx`. Prop: `aoVoltar()`. React Hook Form + Zod.

Anatomia:

- `CabecalhoTela` com título ("Novo cadastro") e subtítulo; sem barra.
- Um cartão `mx-6 max-w-3xl rounded-[20px] border border-borda bg-superficie p-6
  shadow-[0_1px_2px_rgba(0,0,0,0.04)]`.
- Grupos: `TituloGrupo` + grade `grid gap-4 @2xl:grid-cols-2` (2 colunas quando cabe). Entre
  grupos, divisória `my-6 h-px bg-borda`.
- Campo de texto: `CampoRotulado {...register("campo")}` com o erro do jeito do Plus:
  `aria-invalid`, `className={cn(e.campo && "border-vermelho/50 ring-4 ring-vermelho/10")}` e
  `<ErroDoCampo texto={e.campo?.message} />` embaixo.
- Campo que não é `<input>` (`Escolha`, `Lista`, `SeletorData`, `SeletorHora`, `Interruptor`,
  `CaixaSelecao`): dentro de `<Controller render={({ field }) => ...} />`, ligando
  `valor={field.value}` e `aoMudar={field.onChange}`.
- Liga/desliga juntos numa linha `mt-5 flex flex-wrap gap-6`.
- **Erro**: embaixo de cada campo, em vermelho; e, ao tentar salvar, `AvisoErro` no fim
  ("Confira os campos marcados em vermelho."), que rola até ele e repete num balão.
- **Ações no rodapé, à direita**: `mt-6 flex justify-end gap-2 border-t border-borda pt-5`, com
  *Cancelar* (`leve`) e *Salvar* (`verde`, `type="submit"`, `carregando={formState.isSubmitting}`).

```tsx
const esquema = z.object({
  nome: z.string().trim().min(3, "Escreva pelo menos 3 letras."),
  codigo: z.string().trim().regex(/^\d{4}-\d$/, "Use o formato 0000-0."),
  equipe: z.array(z.string()).min(1, "Escolha ao menos uma pessoa."),
});
const { register, control, handleSubmit, formState } = useForm<Dados>({ resolver: zodResolver(esquema), defaultValues: { ... } });

<form onSubmit={handleSubmit(salvar, () => setErroGeral("Confira os campos marcados em vermelho."))}>
```

![Formulário, claro](../imagens/claro/formulario.png)
![Formulário com erros, claro](../imagens/claro/formulario-erros.png)

Escuro: `../imagens/escuro/formulario.png`, `../imagens/escuro/formulario-erros.png`.

**Como montar um formulário:**

1. Copie `rotas/formulario/` para `rotas/<modulo>/`.
2. Liste os campos do `QDialog`/tela antiga e agrupe (2–4 grupos com `TituloGrupo`).
3. Escreva o `esquema` Zod com as mesmas regras do sistema antigo e mensagens que dizem o que
   fazer. Repita as regras **também** no serviço Python (é ele quem decide).
4. Troque cada widget pelo equivalente ([08-componentes.md](08-componentes.md), quadro do Qt).
   CNPJ/CPF: `mascaraCnpj`/`mascaraCpf`; valores: `lerNumeroBr`/`formatarBr`.
5. No `salvar`, chame a porta (`useMutation`); sucesso → `toast.success` e volta; erro do Python
   vira balão sozinho ou, se for de um campo, use `setError` do React Hook Form.
6. Formulário curto (1–3 campos) não é tela: é um `Dialogo`.
