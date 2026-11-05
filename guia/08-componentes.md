# 08 · Componentes (catálogo de peças)

> **Para a IA.** Antes de criar qualquer peça, procure aqui. As peças são **as do Sistema
> Contábil Plus**: algumas são cópia idêntica dos arquivos de lá, outras são o padrão do Plus
> tirado de dentro das telas para ser reusado. Cada peça tem arquivo, origem, quando usar,
> medidas, um exemplo com as props reais e a imagem. Copie o uso; não reinvente.

Todas as peças estão em `modelo/frontend/src/componentes/` (e as funções em `src/lib/`), e são
importadas com `@/` (apelido de `src/`). Os textos dos exemplos ("Projeto Alfa", "Categoria A"...)
são **exemplo**; na cirurgia os rótulos vêm do sistema antigo.

A tela **Todas as peças** (`src/rotas/pecas/TelaPecas.tsx`) mostra quase tudo funcionando. Abra
com `scripts\ABRIR_NO_NAVEGADOR.bat telas` e vá em *Modelos → Todas as peças*.

![Todas as peças, claro](../imagens/claro/pecas.png)

## De onde vem cada arquivo

| Origem | Arquivos | Regra |
|---|---|---|
| **Cópia do Plus** (idêntico) | `componentes/ui/botao.tsx`, `campo.tsx`, `caixa-selecao.tsx`, `lista.tsx`, `dialogo.tsx`, `aviso-erro.tsx`, `seletor-data.tsx`, `seletor-competencia.tsx`; `lib/confirmar.tsx`, `competencia.ts`, `pedidoTela.ts`, `rolagem.ts`, `desfoque.ts`, `utils.ts`; `api/cliente.ts`, `api/janela.ts`; `rotas/login/FundoAnimado.tsx` | **Nunca edite.** Mudou no Plus, copie de novo. A conferência compara byte a byte ([12-conferencia.md](12-conferencia.md)). |
| **Quase cópia do Plus** (só sem o que dependia de módulos de lá) | `index.css`, `rotas/login/TelaLogin.tsx`, `rotas/login/Avatar.tsx`, `componentes/layout/MenuLateral.tsx`, `BuscaRapida.tsx`, `JanelaPrincipal.tsx`, `modulos.ts`, `lib/avisos.ts`, `tema/tema.ts` | Mude só o que o guia manda (módulos do menu, ações da busca, `NOME_SISTEMA`, ligação com o Python, valores de paleta permitidos). |
| **Só do kit** (o padrão do Plus extraído, mesmas classes) | `componentes/ui/segmentado.tsx`, `interruptor.tsx`, `gaveta.tsx`, `campos-extra.tsx`, `pecas.tsx`; `componentes/graficos/graficos.tsx`; `tema/movimento.ts`; `lib/extras.ts`, `lib/numeros.ts` | Use como estão. No Plus estas peças moram dentro das telas (ex.: o `Segmentado` em `rotas/empresas/TelaEmpresas.tsx`). |

## Peça que falta: o que pode e o que não pode

O padrão é o Plus, mas cada sistema pode ter pequenas diferenças no uso das peças:

- **Pode** usar mais ou menos peças, e combinar as variantes que já existem (ex.: um `Botao`
  `leve` com `className="text-vermelho"` para "Apagar" na ficha, como no modelo).
- **Pode** criar uma peça nova quando o Plus não tiver nenhuma que resolva, desde que:
  - montada só com as classes e tokens do Plus (cores do [07](07-cores-e-medidas.md), os mesmos
    raios, sombras, alturas e tamanhos de letra);
  - num arquivo **próprio** do sistema: `componentes/ui/<nome>.tsx` novo, ou dentro da pasta do
    módulo em `rotas/<modulo>/` se só aquele módulo usa;
  - registrada no `docs/visual.md` do projeto ("Diferenças em relação ao Plus").
- **Não pode** editar um arquivo que é cópia do Plus (nem para "só acrescentar uma prop"). Se a
  peça do Plus quase serve, crie a sua ao lado, com outro nome.
- Se a peça nova servir para todos os sistemas, ela é **candidata a entrar no Plus**: avise o
  Levi.

## Do Qt para cá

| No Qt era | Aqui é | Observação |
|---|---|---|
| `QPushButton` | `Botao` | Escolha a `variante` pela importância, não pela cor. |
| `QToolButton` só com ícone | `Botao tamanho="icone"` | Sempre com `aria-label`. |
| `QLineEdit` (formulário) | `CampoRotulado` | Rótulo em cima, dica embaixo; erro com `ErroDoCampo`. |
| `QLineEdit` grande / de login | `Campo` | Com ícone. |
| `QLineEdit` de filtro na barra | `CampoBusca` | |
| `QTextEdit` / `QPlainTextEdit` | `AreaTexto` | |
| `QDoubleSpinBox` / `QSpinBox` | `CampoRotulado` com `inputMode="decimal"` + `lerNumeroBr` | `type="number"` não entende vírgula. Limite de valor é regra: confira no Python. |
| `QComboBox` | `Escolha` | Muitos itens: `buscavel`. |
| `QListWidget` com marcação múltipla | `Lista multipla` | |
| `QCheckBox` | `CaixaSelecao` | Preferência liga/desliga: `Interruptor`. |
| `QRadioButton` em grupo | `Segmentado` | 2–4 opções. Mais que isso: `Escolha`. |
| `QDateEdit` / `QCalendarWidget` | `SeletorData` | |
| `QTimeEdit` | `SeletorHora` | |
| Combo de competência (mês/ano) | `SeletorCompetencia` (barra) ou `GradeMeses` (dentro de caixa) | |
| `QMessageBox.question` / `warning` "tem certeza?" | `confirmar()` | `Confirmacao` quando o estado já está na tela. |
| `QMessageBox.information` / `critical` | balão (`toast.*`, `avisar()`) | Erro do Python vira balão sozinho. |
| `QDialog` | `Dialogo` | |
| `QDockWidget` / painel lateral de detalhes | `Gaveta` | A "ficha". |
| `QTableWidget` / `QTableView` | Tabela densa (`rotas/tabela/TelaTabela.tsx`) ou lista do cadastro (`rotas/cadastro/TelaCadastro.tsx`) | Ver [09-telas.md](09-telas.md). |
| `QToolTip` / `setToolTip` | `Dica` | Ou `title` simples em texto truncado. |
| `QMenu` (botão «…» ou contexto) | `MenuSuspenso` + `ItemMenu` + `Divisoria` | |
| `QProgressBar` sem fim definido | `BarraOcupada` | |
| `QProgressBar` com valor | `BarraPartes` | |
| Mensagens na `QStatusBar` | balão (`toast`) | Não há barra de status. |
| `QTabWidget` | `Segmentado` (abas curtas na mesma tela) ou módulos separados no menu | |
| `QLabel` "rótulo: valor" em ficha | `Dado` | |
| `QGroupBox` | `TituloGrupo` + grade | |
| `QSplashScreen` / "carregando..." | `Esqueleto` | |

## Botões

### `Botao` — cópia do Plus

Arquivo: `componentes/ui/botao.tsx`. Aceita todas as props de `<button>`, mais:

| Prop | Valores | Padrão |
|---|---|---|
| `variante` | `"primario"` · `"verde"` · `"leve"` · `"fantasma"` · `"link"` | `"primario"` |
| `tamanho` | `"p"` (h-8, 13 px, `rounded-lg`) · `"m"` (h-10, 14 px, `rounded-xl`) · `"g"` (h-12, 15 px, `rounded-2xl`) · `"icone"` (`size-9 rounded-full`) | `"m"` |
| `carregando` | `boolean`: mostra o giro (`Loader2`) e desliga o botão | — |
| `asChild` | `boolean`: o botão "veste" o filho (Radix Slot) | — |

| Variante | Quando usar |
|---|---|
| `primario` | **A** ação da tela (uma só): "Novo", "Entrar", "Editar" na ficha. Fundo `bg-primario`. |
| `verde` | Confirmar/salvar dentro de formulário e janela. Fundo `bg-verde`, texto `text-white`. |
| `leve` | Secundária: "Cancelar", "Relatório", "Base de Dados". Fundo `bg-campo`. |
| `fantasma` | Terciária, em barras e listas: só texto, fundo aparece no hover. |
| `link` | Ação em linha de texto (`text-verde-texto`). Sem altura fixa. |

**Não existe variante vermelha.** Apagar de verdade é `className="bg-vermelho text-white"` (como
no Plus); "Apagar" discreto na ficha é `variante="leve" className="text-vermelho"`.

Estados: hover (`brightness-110` / `bg-borda` / `bg-campo`), clique afunda
(`active:scale-[0.97]`), foco por teclado `ring-4 ring-verde/25`, desligado `opacity-50` e
sem clique. Ícone dentro: `className="size-4"`, antes do texto (o `gap-2` já separa).

Não use `disabled` para dizer "você não pode". Regra do Plus: botão que não pode ser usado
**não trava em silêncio**. Deixe ligado e, ao clicar, explique com `avisar("motivo")`. Use
`disabled` só quando o motivo é óbvio na tela (ex.: enquanto salva, via `carregando`).

Na barra de ferramentas, ajuste a altura para 36 px: `className="h-9"`.

```tsx
<Botao className="h-9" onClick={aoNovo}><Plus className="size-4" /> Novo</Botao>
<Botao variante="leve" onClick={aoVoltar}>Cancelar</Botao>
<Botao type="submit" variante="verde" carregando={formState.isSubmitting}>Salvar</Botao>
<Botao tamanho="icone" variante="leve" aria-label="Editar"><Pencil className="size-4" /></Botao>
<Botao className="bg-vermelho text-white hover:brightness-110"><Trash2 className="size-4" /> Apagar</Botao>
```

![Botões, claro](../imagens/claro/peca-botoes.png)
![Botões, escuro](../imagens/escuro/peca-botoes.png)

## Campos

### `Campo` (grande, com ícone) — cópia do Plus

Arquivo: `componentes/ui/campo.tsx`. Quando: tela de entrada e campos de destaque. Não use em
formulário comum (use `CampoRotulado`).

| Prop | Tipo |
|---|---|
| `icone` | ícone do Lucide (`User`, `KeyRound`...) |
| `realce` | `boolean`: borda e ícone em verde (ex.: usuário reconhecido) |
| `erro` | `boolean`: borda e anel vermelhos |
| `fim` | `ReactNode` no fim do campo (ex.: o olho de mostrar a senha) |
| + props de `<input>` e `ref` | |

Anatomia: `h-12`, `rounded-2xl`, fundo `bg-campo`, borda transparente, ícone 18 px `text-texto-3`
(vira verde no foco), texto 15 px. Foco: `border-verde/50 bg-superficie ring-4 ring-verde/15`.
Erro: `border-vermelho/50 ring-4 ring-vermelho/10`.

```tsx
<Campo icone={User} placeholder="Usuário" value={login} onChange={(e) => setLogin(e.target.value)} realce={!!achado} erro={erroCampo && !login.trim()} />
```

### `CampoRotulado` (formulário) — cópia do Plus

Arquivo: `componentes/ui/campo.tsx`. Quando: todo campo de texto de formulário e de diálogo.

| Prop | Tipo |
|---|---|
| `rotulo` | `string` (obrigatório) |
| `dica` | `string`: texto de ajuda embaixo (12 px, `text-texto-3`) |
| + props de `<input>` e `ref` | funciona direto com `register()` do React Hook Form |

Anatomia: rótulo 13 px `font-medium text-texto-2`, `gap-1.5`, campo `h-10 rounded-xl px-3`
14 px. Foco `border-verde/50 bg-superficie ring-4 ring-verde/15`. Somente leitura (`readOnly`):
`opacity-60`.

**Não tem prop de erro** (é a peça do Plus). O erro vai assim: `aria-invalid`, a classe de erro
no campo e o texto embaixo com `ErroDoCampo` (de `pecas.tsx`):

```tsx
<div>
  <CampoRotulado rotulo="Código" placeholder="0000-0" dica="Quatro números, traço e um número."
    aria-invalid={!!e.codigo} className={cn(e.codigo && "border-vermelho/50 ring-4 ring-vermelho/10")}
    {...register("codigo")} />
  <ErroDoCampo texto={e.codigo?.message} />
</div>
```

### `AreaTexto` — só do kit

Arquivo: `componentes/ui/campos-extra.tsx`. Quando: texto longo (observação). Mesmo visual do
`CampoRotulado`, `min-h-24`, redimensiona na vertical. Props: `rotulo` (obrigatório) + props de
`<textarea>` e `ref`. Erro: `ErroDoCampo` embaixo, como no `CampoRotulado`.

```tsx
<AreaTexto rotulo="Observação" placeholder="Opcional" {...register("observacao")} />
```

### `CampoBusca` (barra de ferramentas) — só do kit

Arquivo: `componentes/ui/campos-extra.tsx` (no Plus, escrito dentro de
`rotas/empresas/TelaEmpresas.tsx`, com as mesmas classes). Quando: filtrar a lista da tela. Lupa
à esquerda, X para limpar quando há texto. `h-9 rounded-xl`, 13.5 px, `flex-1` com mínimo de
240 px. Não é para formulário.

| Prop | Tipo |
|---|---|
| `valor`, `aoMudar` | `string`, `(v: string) => void` |
| `placeholder` | padrão `"Buscar…"` |
| `className` | ex.: `"ml-2"`, `"max-w-md"` |

```tsx
<CampoBusca valor={busca} aoMudar={setBusca} placeholder="Buscar por nome, código…" className="ml-2" />
```

![Campos, claro](../imagens/claro/peca-campos.png)
![Campos, escuro](../imagens/escuro/peca-campos.png)

## Escolher

### `Lista` e `Escolha` — cópia do Plus

Arquivo: `componentes/ui/lista.tsx`. Lista suspensa no visual do sistema, no lugar do `<select>`.

`Lista` (vários valores):

| Prop | Tipo | Padrão |
|---|---|---|
| `rotulo` | `string` (obrigatório; vazio = sem rótulo) | — |
| `itens` | `{ valor, rotulo, detalhe? }[]` (`ItemLista<T>`) | — |
| `valor` | `T[]` | — |
| `aoMudar` | `(v: T[]) => void` | — |
| `multipla` | marca vários; a lista fica aberta enquanto marca | `false` |
| `buscavel` | campo "Procurar…" no topo (sem acento, sem maiúscula) | `false` |
| `compacto` | `h-9` e 13 px, para formulário denso | `false` |
| `vazio` | texto quando nada escolhido | `"Escolher…"` |
| `semItens` | texto quando a lista está vazia | `"Nada para escolher."` |
| `classe` | classes do bloco todo (**`classe`, não `className`**) | — |

`Escolha` (um valor só, o caso comum): mesmas props, mas `valor: T`, `aoMudar: (v: T) => void`,
`rotulo` opcional, sem `multipla`.

Anatomia: gatilho `h-10 rounded-xl bg-campo`, seta que gira ao abrir; aberto ganha
`border-verde/50 ring-4 ring-verde/15`. Caixa: `rounded-2xl border-borda bg-superficie p-1.5
shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]`, até 280 px de altura com rolagem, pelo menos a
largura do gatilho. Item escolhido: check verde (única) ou caixinha cheia de verde (múltipla).

```tsx
<Escolha valor={field.value} aoMudar={field.onChange}
  itens={["Categoria A", "Categoria B", "Categoria C"].map((c) => ({ valor: c, rotulo: c }))} />
<Lista rotulo="Equipe" multipla buscavel itens={pessoas.map((p) => ({ valor: p, rotulo: p }))}
  valor={field.value} aoMudar={field.onChange} />
```

O gatilho aparece em `../imagens/claro/peca-campos.png` e em `../imagens/claro/formulario.png`.

### `CaixaSelecao` — cópia do Plus

Arquivo: `componentes/ui/caixa-selecao.tsx`. Caixa de marcar 18 px, cantos de 6 px; marcada
enche de verde com o check branco. Foco `ring-4 ring-verde/20`. Rótulo 13 px `text-texto-2`,
clicável.

Props: `rotulo` (string), `marcado` (boolean), `aoMudar(v: boolean)`, `className`.
Quando: sim/não dentro de formulário ou lista ("Lembrar meu login"). Para preferência que vale
na hora, use `Interruptor`.

```tsx
<CaixaSelecao rotulo="Avisar a equipe por e-mail" marcado={field.value} aoMudar={field.onChange} />
```

### `Interruptor` — só do kit

Arquivo: `componentes/ui/interruptor.tsx` (no Plus, dentro do `ItemConta` do menu lateral, com
as mesmas classes). Liga/desliga estilo iOS: trilho 30 × 18 px (`bg-verde` ligado, `bg-borda`
desligado), bolinha branca de 14 px que desliza. `role="switch"`.

Props: `ligado` (boolean), `aoMudar(v: boolean)`, `rotulo?` (string). Quando: preferência ou
estado "ativo/inativo". Não use para escolher entre opções com nome (use `Segmentado`).

```tsx
<Interruptor rotulo="Ativo" ligado={field.value} aoMudar={field.onChange} />
```

### `Segmentado` — só do kit

Arquivo: `componentes/ui/segmentado.tsx` (no Plus, dentro de `rotas/empresas/TelaEmpresas.tsx`:
"Ativas/Inativadas" e "cartões/lista"). A pílula branca **desliza** até a opção escolhida
(`layoutId`, mola `MOLA_SEGMENTO`).

Props: `valor: T`, `opcoes: [T, ReactNode][]` (valor e rótulo, que pode ser ícone),
`aoMudar(v: T)`. Anatomia: trilho `h-9 rounded-xl bg-campo p-0.5`; opção `h-8 rounded-[10px] px-3`
13 px `font-medium`; escolhida `text-texto` sobre pílula `bg-superficie shadow-sm`; as outras
`text-texto-3`.

Quando: 2–4 opções exclusivas e curtas (Todos/Em aberto, Cartões/Lista, Só eu/Equipe).
Não use com mais de 4 opções ou rótulos longos (use `Escolha`). Cada `Segmentado` tem a sua
pílula (`layoutId` vem de `useId()`), então vários na mesma tela não se misturam.

```tsx
<Segmentado valor={filtro} opcoes={[["todos", "Todos"], ["abertos", "Em aberto"]]} aoMudar={setFiltro} />
<Segmentado valor={modo} opcoes={[["cartoes", <LayoutGrid key="g" className="size-4" />], ["lista", <List key="l" className="size-4" />]]} aoMudar={setModo} />
```

![Controles, claro](../imagens/claro/peca-controles.png)
![Controles, escuro](../imagens/escuro/peca-controles.png)

### `SeletorData` e `SeletorHora` — cópia do Plus

Arquivo: `componentes/ui/seletor-data.tsx`. No lugar do calendário do Windows.

`SeletorData`:

| Prop | Tipo | Padrão |
|---|---|---|
| `rotulo` | `string` | — |
| `valor` | `"AAAA-MM-DD"` ou `""` | — |
| `aoMudar` | `(v: string) => void` (`""` = limpou) | — |
| `vazio` | texto sem data | `"Sem prazo"` |
| `desligado` | `boolean`: não abre | — |
| `motivo` | `string`: com `desligado`, o balão que explica ao clicar | — |
| `titulo` | `string`: `title` do bloco | — |
| `gatilho` | `ReactNode`: botão próprio no lugar do campo com rótulo | — |

Anatomia: campo `h-10 rounded-xl` com ícone de calendário (`text-verde-texto` quando há data),
data por extenso ("sex, 17 de outubro de 2026", função `dataPorExtenso`), X para limpar ao
passar o mouse. Caixa `rounded-2xl` com `shadow-[0_24px_60px_-18px_rgba(0,0,0,0.4)]`: mês/ano
com setas, semana começando na **segunda**, 6 linhas fixas; escolhido `bg-verde text-white`;
atalhos "Hoje", "Amanhã", "Em 7 dias".

`SeletorHora`: props `rotulo`, `valor` (`"HH:MM"` ou `""`), `aoMudar`, `desligado`, `titulo`,
`motivo`. Horas 07h–21h, minutos `:00 :15 :30 :45`, e um campo para outro horário (aceita `9`,
`930`, `9:30`, `1745`; inválido → `avisar(...)`). Sempre 24 h.

```tsx
<Controller control={control} name="prazo" render={({ field }) => <SeletorData rotulo="Prazo" valor={field.value} aoMudar={field.onChange} />} />
<Controller control={control} name="hora" render={({ field }) => <SeletorHora rotulo="Hora" valor={field.value} aoMudar={field.onChange} />} />
<SeletorData rotulo="Entrega" valor={v} aoMudar={setV} desligado motivo="Só quem criou pode mudar a data." />
```

O campo aparece em `../imagens/claro/formulario.png`.

### `SeletorCompetencia` e `GradeMeses` — cópia do Plus

Arquivo: `componentes/ui/seletor-competencia.tsx`. Competência = mês de trabalho, `"AAAA-MM"`.

`SeletorCompetencia` é o botão de competência da **barra de ferramentas** (`h-9`). Props:
`valor` (`"AAAA-MM"`), `atual` (a competência de agora, `mesAtual()` de `lib/competencia.ts`),
`aoMudar(c)`. Mostra "Novembro de 2026". Na competência de agora fica verde
(`border-verde/30 bg-verde/10 text-verde-texto`); em outra fica âmbar, só como aviso (nada fica
bloqueado, como no sistema antigo), e a caixa ganha "Voltar para <competência de agora>".

`GradeMeses` é só a grade 4 × 3 (264 px) com troca de ano. Props: `valor`, `aoEscolher(c)`. Use
dentro de outra caixa ("a partir de…").

Para a competência ficar **a mesma em todas as telas** (mudou numa, as outras abrem nela), use
`useCompetencia()` de `lib/competencia.ts`, como no Plus.

```tsx
<SeletorCompetencia valor={mes} atual={mesAtual()} aoMudar={setMes} />
```

O botão aparece em `../imagens/claro/peca-controles.png` e `../imagens/claro/painel.png`.

## Janelas

### `Dialogo` — cópia do Plus

Arquivo: `componentes/ui/dialogo.tsx`. Janela por cima da tela, estilo folha do macOS: fundo
escurece e desfoca (`bg-black/30 backdrop-blur-sm`), a janela entra crescendo de 94% com mola
(420/32). Esc, clique fora e o X fecham.

| Prop | Tipo | Padrão |
|---|---|---|
| `aberto` | `boolean` | — |
| `aoFechar` | `() => void` | — |
| `titulo` | `string` (19 px semibold) | — |
| `descricao` | `ReactNode` (14 px `text-texto-2`, respeita quebras de linha) | — |
| `largura` | classe de largura máxima | `"max-w-md"` |
| `children` | conteúdo; botões no fim em `flex justify-end gap-2` | — |

Anatomia: `rounded-[24px] border-borda bg-superficie p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]`,
até a altura da janela menos 32 px (rola por dentro). Botões: `leve` (cancelar) à esquerda,
`verde` (confirmar) à direita.

Quando: tarefa curta que precisa de foco (editar um campo, escolher algo). Não use para mostrar
detalhes de um item (use `Gaveta`) nem para formulário grande (use uma tela).

```tsx
<Dialogo aberto={aberto} aoFechar={() => setAberto(false)} titulo="Título da janela" descricao="Uma frase que explica o que esta janela faz.">
  <div className="flex flex-col gap-3">
    <CampoRotulado rotulo="Campo" placeholder="Digite" />
    <div className="flex justify-end gap-2">
      <Botao variante="leve" onClick={() => setAberto(false)}>Cancelar</Botao>
      <Botao variante="verde" onClick={salvar}>Salvar</Botao>
    </div>
  </div>
</Dialogo>
```

![Janela, claro](../imagens/claro/janela.png)
![Janela, escuro](../imagens/escuro/janela.png)

### `confirmar()` (o mais usado) — cópia do Plus

Arquivo: `lib/confirmar.tsx`. "Tem certeza?" chamado de qualquer lugar, sem estado na tela.
Devolve `Promise<boolean>`. **Enter confirma, Esc cancela**; o foco começa no botão de confirmar.
Largura 400 px, botões de 36 px.

| Campo | Tipo | Padrão |
|---|---|---|
| `titulo` | `string` | — |
| `texto` | `string` (opcional) | — |
| `botao` | texto do botão de confirmar | `"Confirmar"` |
| `perigo` | botão `bg-vermelho`; `false` = `bg-verde` | **`true`** |

```tsx
if (await confirmar({ titulo: "Apagar este item?", texto: "Ele sai da lista e não dá para desfazer.", botao: "Apagar" })) {
  apagar.mutate(id);
}
if (await confirmar({ titulo: "Enviar agora?", botao: "Enviar", perigo: false })) enviar();
```

### `Confirmacao` — cópia do Plus

Arquivo: `componentes/ui/dialogo.tsx`. A mesma pergunta como componente, quando o estado de
aberto já vive na tela (substitui as caixas "Sim / Não" do sistema antigo).

Props: `aberto`, `titulo`, `texto` (`ReactNode`, obrigatório), `sim` (texto do botão),
`nao` (padrão `"Cancelar"`), `perigoso` (boolean: `bg-vermelho`, senão `bg-verde`),
`aoResponder(sim: boolean)`. Largura `max-w-md`, botões de 40 px. Aqui o foco começa em
**"Cancelar"** e não há atalho Enter.

```tsx
<Confirmacao aberto={pergunta} titulo="Apagar este item?" texto="Ele sai da lista e não dá para desfazer."
  sim="Apagar" perigoso aoResponder={(sim) => { setPergunta(false); if (sim) apagar(); }} />
```

![Pergunta, claro](../imagens/claro/pergunta.png)
![Pergunta, escuro](../imagens/escuro/pergunta.png)

### `Gaveta` (ficha lateral) — só do kit

Arquivo: `componentes/ui/gaveta.tsx` (o padrão da ficha da empresa do Plus,
`rotas/empresas/FichaEmpresa.tsx`). Desliza da direita (Vaul), flutuando a 8 px das bordas,
cantos `rounded-[24px]`, sombra `shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]`, 460 px de
largura. Arrastar para a direita, Esc, clique fora ou o X fecham.

| Prop | Tipo |
|---|---|
| `aberto`, `aoFechar` | `boolean`, `() => void` |
| `titulo` | `string`. Com `cabecalho`, o título fica só para leitor de tela. |
| `cabecalho` | `ReactNode` no topo (ícone grande, nome, selos) |
| `rodape` | `ReactNode`: ações fixas embaixo (`flex gap-2`, borda em cima) |
| `cor` | cor de identidade do item: véu degradê no topo. Hex (`corPorTexto()`) ou `var(--...)`: o véu é feito com `color-mix` a 13%. |
| `children` | corpo que rola (`px-6 py-5`) |

Quando: ver e agir sobre **um item** sem sair da lista (o "duplo clique abre detalhes" do Qt).
Não use para criar item novo com muitos campos (use a tela de formulário).

```tsx
<Gaveta aberto={!!i} aoFechar={() => setAberto(null)} titulo={i?.nome ?? ""} cor={i ? corPorTexto(i.nome) : undefined}
  cabecalho={i && <div className="flex items-start gap-4 pr-8"><IconeApp nome={i.nome} tamanho={60} />...</div>}
  rodape={<><Botao className="flex-1" onClick={editar}><Pencil className="size-4" /> Editar</Botao>
           <Botao variante="leve" className="text-vermelho" onClick={apagar}><Trash2 className="size-4" /> Apagar</Botao></>}>
  <TituloGrupo>Dados</TituloGrupo>
  <div className="grid grid-cols-2 gap-1.5"><Dado rotulo="Cidade" valor={i.cidade} copiavel /></div>
</Gaveta>
```

![Ficha lateral, claro](../imagens/claro/ficha-lateral.png)
![Ficha lateral, escuro](../imagens/escuro/ficha-lateral.png)

## Identidade e dados

Arquivo de todos: `componentes/ui/pecas.tsx` — **só do kit** (cada peça é o padrão que no Plus
está escrito dentro de alguma tela, com as mesmas classes).

### `Selo`

Pílula de situação: `h-[22px] rounded-full px-2.5`, 11.5 px `font-medium`, fundo da cor a 12% e
texto na cor. Props: `children`, `tom` (`"neutro"` padrão · `"verde"` · `"ambar"` ·
`"vermelho"`), `className`. Quando: situação de um item (concluído, atrasado). Não use como botão.

| Tom | Classes |
|---|---|
| `neutro` | `bg-campo text-texto-2` |
| `verde` | `bg-verde/12 text-verde-texto` |
| `ambar` | `bg-amber-500/12 text-amber-700 dark:text-amber-300` |
| `vermelho` | `bg-vermelho/12 text-vermelho` |

```tsx
<Selo tom="vermelho">Atrasado</Selo>
<Selo>{i.categoria}</Selo>
```

### `Avatar`

Bolinha com foto ou iniciais, numa cor **fixa por nome** (`corPorTexto`), letra branca.
Props: `nome` (string), `foto?` (endereço), `tamanho` (px, padrão 32), `anel?` (borda da cor da
superfície, para empilhar com `-space-x-1`), `className`. Abaixo de 22 px mostra só uma letra.
(O avatar grande da tela de entrada é outro: `rotas/login/Avatar.tsx`.)

```tsx
<Avatar nome="Nome Sobrenome" />
<span className="flex -space-x-2">{nomes.map((n) => <Avatar key={n} nome={n} tamanho={30} anel />)}</span>
```

### `Pessoas`

Até 3 avatares de 22 px empilhados + o primeiro nome + "+N". Nome completo de todos no `title`.
Prop: `nomes: string[]`. Quando: responsável/equipe em cartão, lista e ficha.

```tsx
<Pessoas nomes={[i.responsavel, ...i.equipe]} />
```

### `IconeApp`

Quadrado com cantos de 28% e duas letras (palavras com mais de 2 letras ou com número), na cor
fixa do nome. É a identidade visual de cada item da lista (como as empresas no Plus). Props:
`nome`, `tamanho` (padrão 44), `cor?` (substitui a cor automática). Tamanhos usados: 26 (linha de
lista), 40 (cartão), 60 (ficha).

```tsx
<IconeApp nome={i.nome} tamanho={40} />
```

### `Dado`

Rótulo pequeno em caixa alta (10.5 px, `tracking-[0.06em]`, `text-texto-3`) em cima, valor
13 px embaixo, num bloco `rounded-lg bg-campo/60 px-2.5 py-1.5`. Valor vazio vira "—".
Props: `rotulo`, `valor` (**string**), `copiavel?` (mostra o `BotaoCopiar` no hover).
Quando: dados de leitura em fichas e cartões, em grade `grid grid-cols-2 gap-1.5`.

```tsx
<Dado rotulo="Contato" valor={i.contato} copiavel />
```

### `BotaoCopiar`

Ícone de copiar 20 px que aparece **só com o mouse em cima** do bloco pai que tenha a classe
`group/item` (o `Dado` já tem). Copia e mostra o balão "Copiado." (ou erro). Prop: `texto`.

```tsx
<div className="group/item flex items-center gap-1.5">{codigo}<BotaoCopiar texto={codigo} /></div>
```

### `ErroDoCampo`

O erro embaixo de um `CampoRotulado` ou `AreaTexto`: 12 px `text-vermelho`, `role="alert"`,
`mt-1.5`. Prop: `texto?` (sem texto, não mostra nada).

```tsx
<ErroDoCampo texto={e.nome?.message} />
```

### `TituloGrupo`

Título de grupo em fichas, formulários e menus: 10.5 px, caixa alta, `tracking-[0.08em]`,
`text-texto-3`, `mb-1.5`. Prop: `children`.

```tsx
<TituloGrupo>Identificação</TituloGrupo>
```

![Selos, avatares e identidade, claro](../imagens/claro/peca-selos.png)
![Selos, avatares e identidade, escuro](../imagens/escuro/peca-selos.png)

## Menus e dicas

### `Dica`

Tooltip **sempre escuro** (`bg-[#1b1a18] text-white`, como no Plus, nos dois temas), 12.5 px,
com setinha (Radix). Props: `texto`, `lado` (`"top"` padrão · `"right"` · `"bottom"` · `"left"`),
`children` (**um** elemento, que recebe o gatilho). Atraso de 250 ms (o `Tooltip.Provider` está
no `main.tsx`). Quando: botão só de ícone, abreviação. Não use para texto importante (ninguém
passa o mouse em tudo).

```tsx
<Dica texto="Uma dica curta"><Botao variante="leve">Passe o mouse</Botao></Dica>
```

### `MenuSuspenso`, `ItemMenu`, `Divisoria`

O «…» da barra e menus de ações. Caixa `w-56 rounded-2xl border-borda bg-superficie p-1.5
shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]`.

| Peça | Props |
|---|---|
| `MenuSuspenso` | `gatilho` (um elemento), `children`, `alinhar` (`"end"` padrão · `"start"`) |
| `ItemMenu` | `icone` (Lucide), `texto`, `perigo?` (vermelho), `aoClicar`. `h-9 rounded-xl`, 13.5 px, hover `bg-campo`. Fecha o menu ao clicar. |
| `Divisoria` | sem props: linha de 1 px `bg-borda my-1` |

Ação perigosa vai por último, depois de uma `Divisoria`, e confirma com `confirmar()`.

```tsx
<MenuSuspenso gatilho={<button aria-label="Mais ações" className="flex size-9 items-center justify-center rounded-xl bg-campo text-texto-2 transition hover:text-texto data-[state=open]:text-texto"><MoreHorizontal className="size-[18px]" /></button>}>
  <ItemMenu icone={Download} texto="Importar planilha" aoClicar={importar} />
  <Divisoria />
  <ItemMenu icone={Trash2} texto="Apagar" perigo aoClicar={apagar} />
</MenuSuspenso>
```

![Janelas, menus e avisos, claro](../imagens/claro/peca-janelas.png)
![Janelas, menus e avisos, escuro](../imagens/escuro/peca-janelas.png)

## Estados da tela

### `Vazio` — só do kit (`pecas.tsx`)

Ícone fino grande (40 px, traço 1.4), frase em negrito 16 px, explicação 13 px e, se houver, o
botão que resolve (`leve`, pequeno). Props: `icone`, `titulo`, `texto`, `acao?: { texto, aoClicar }`.
Quando: lista sem itens ou busca sem resultado. Sempre diga **o que fazer**.

```tsx
<Vazio icone={SearchX} titulo={`Nada encontrado para «${busca}»`} texto="Confira a escrita, ou limpe a busca para ver todos."
  acao={{ texto: "Limpar busca", aoClicar: () => setBusca("") }} />
```

### `Esqueleto` — só do kit (`pecas.tsx`)

Blocos pulsando no formato do que vai chegar. Props: `forma` (`"cartoes"` = grade de cartões
de 320 px, padrão · `"linhas"` = lista/tabela), `quantos` (padrão 6), `altura` (px: altura do
cartão, padrão 180; ou da linha, use 44 para lista e 32 para tabela), `className`. Quando:
primeira carga (`q.isLoading`). Não use giro solto no meio da tela.

```tsx
{q.isLoading ? <Esqueleto /> : ...}
{q.isLoading ? <Esqueleto forma="linhas" altura={44} quantos={8} /> : ...}
```

### `BarraOcupada` — só do kit (`pecas.tsx`)

Barra fina (4 px) com um pedaço verde indo e vindo (a barra da tela "Atualizando" do Plus):
trabalho sem saber quanto falta (importar, gerar arquivo). Prop: `className` (ex.: `"max-w-sm"`).

```tsx
{importando && <BarraOcupada className="max-w-sm" />}
```

### `AvisoErro` — cópia do Plus

Arquivo: `componentes/ui/aviso-erro.tsx`. Erro no fim do formulário: caixa
`rounded-xl bg-vermelho/10 text-vermelho` 13 px, `role="alert"`. Ao aparecer, **rola até ele e
repete num balão**. Texto vazio = não mostra nada. Props: `texto`, `className`.

```tsx
<AvisoErro texto={erroGeral} className="mt-5" />
```

![Estados, claro](../imagens/claro/peca-estados.png)
![Estados, escuro](../imagens/escuro/peca-estados.png)

### `useJanelaEstreita(limite)` — só do kit (`pecas.tsx`)

Gancho: `true` enquanto a janela tem menos de `limite` px. O menu lateral usa
`useJanelaEstreita(1100)` para ligar o modo automático.

## Balões (toasts)

Biblioteca Sonner. O `<Toaster>` fica em `src/main.tsx`: no **topo, ao centro**, cores ricas,
botão de fechar, cantos de 16 px. Regra do Plus: **nada falha calado**; toda ação concluída e
todo erro viram balão.

| Chamada | Quando |
|---|---|
| `toast.success("Salvo.")` | Ação concluída. |
| `toast.error("Não foi possível salvar: <motivo>.")` | Falha. (Erros do Python já viram balão sozinhos; ver [04-arquitetura.md](04-arquitetura.md).) |
| `avisar("Só quem criou pode apagar este item.")` | "Não pode" com o motivo (`lib/avisos.ts`, balão de aviso, `id` = texto para não repetir). |
| `toast("Informação neutra.")` | Informação. |
| `copiarTexto(texto, "Copiado.")` | Copiar para a área de transferência, sempre contando se deu certo (`lib/avisos.ts`). |

No Plus, `lib/avisos.ts` também guarda os textos de motivo de cada módulo (`MOTIVO_EMPRESA`,
`MOTIVO_TAREFA`...). Cada sistema cria os seus no mesmo formato, no mesmo arquivo.

```tsx
import { toast } from "sonner";
import { avisar } from "@/lib/avisos";
```

![Balões, claro](../imagens/claro/baloes.png)
![Balões, escuro](../imagens/escuro/baloes.png)

## Gráficos (CSS puro) — só do kit

Arquivo: `componentes/graficos/graficos.tsx`. Sem biblioteca: seguem o tema sozinhos. As cores
vêm das props `cor`, sempre um `var(--st-...)` ou `var(--tp-...)` com o significado fixo da
Visão geral do Plus ([07-cores-e-medidas.md](07-cores-e-medidas.md)). Auxiliar: `pct(a, b)` =
porcentagem inteira (0 se `b` for 0).

### `Painel` (cartão de gráfico)

Anatomia fixa: **título · o que mede · legenda · gráfico · leitura**. Props: `titulo`,
`mede` (frase do que o gráfico mede), `legenda?` (use `Chave`), `leitura?` (a frase que
**interpreta** o gráfico, no rodapé com borda), `acao?` (botão no canto), `children`, `className`
(`"h-full"` para igualar alturas na grade). Cartão `rounded-[20px]`, título 14.5 px, `px-5`.

Atenção ao nome: o cartão de gráfico se chama `Painel`, igual ao módulo Painel. Na tela, o
modelo importa como `Painel as Cartao`.

```tsx
<Cartao titulo="Por pessoa" mede="Itens de cada responsável, pela situação." leitura="Quem tem mais vermelho precisa de ajuda primeiro." className="h-full">
  <Barras itens={...} />
</Cartao>
```

### `Chave`

Quadradinho de cor + nome (+ número) da legenda. Props: `cor`, `texto`, `valor?`, `aoClicar?`
(clicável quando filtra algo).

```tsx
<Chave cor="var(--st-prazo)" texto="No prazo" valor={12} />
```

### `Indicador` e `FaixaIndicadores`

`Indicador`: número grande (28 px) + a referência que o torna legível ("de 18", "28%") + o que
significa. Props: `cor`, `rotulo`, `valor`, `referencia?`, `explica`, `alerta?` (número em
`text-vermelho`), `aoClicar?` (vira botão, com seta no hover; leva à lista filtrada).

`FaixaIndicadores`: junta os indicadores **num cartão só**, com divisórias de 1 px. Cabem
quantos indicadores quiser: cada um tem no mínimo 180 px e a faixa quebra a linha sozinha
(`repeat(auto-fit, minmax(180px, 1fr))`). Nada de caixinhas soltas.

```tsx
<FaixaIndicadores>
  <Indicador cor="var(--st-prazo)" rotulo="Concluídos" valor={5} referencia="de 18" explica="entregues neste mês" aoClicar={abrirConcluidos} />
  <Indicador cor="var(--st-vencida)" rotulo="Atrasados" valor={4} explica="passaram do prazo" alerta aoClicar={abrirAtrasados} />
</FaixaIndicadores>
```

### `BarraPartes`

Uma barra só, dividida em partes coloridas com 2 px de vão. Props: `partes: { valor, cor, nome? }[]`
(com `nome`, o `title` mostra valor e %), `altura` (px, padrão 10). Para progresso, complete com
uma parte `cor: "transparent"`.

```tsx
<BarraPartes partes={[{ valor: 64, cor: "var(--tp-rotina)" }, { valor: 36, cor: "transparent" }]} altura={6} />
```

### `Rosca`

Rosca com `conic-gradient` e o número no meio. Props: `partes: { valor, cor }[]`, `centro`
(string, 22 px), `centroSub` (string, 10.5 px), `tamanho` (px, padrão 136).

```tsx
<Rosca partes={[{ valor: 5, cor: "var(--st-prazo)" }, { valor: 4, cor: "var(--st-vencida)" }]} centro="28%" centroSub="concluído" />
```

### `Barras`

Barras horizontais em colunas alinhadas: nome (38%) | barra | número (72 px). Props:
`itens: { nome, detalhe?, partes: { valor, cor }[], escala, valor, aoClicar? }[]`. `escala` é o
valor que enche a barra toda (use o maior da lista).

```tsx
<Barras itens={pessoas.map((p) => ({ nome: p.nome, detalhe: `${p.qtd} itens`, escala: maior, valor: `${p.pct}% feito`, partes: p.partes }))} />
```

### `Colunas`

Colunas lado a lado, empilhadas por cor, número em cima e rótulo embaixo (até 34 px de largura).
Props: `colunas: { rotulo, partes: { valor, cor, nome }[], fundo?, destaque? }[]`, `altura`
(px, padrão 132). `fundo` marca uma coluna (fim de semana); `destaque` põe o rótulo em negrito
(hoje). Coluna com total 0 mostra um tracinho.

```tsx
<Colunas colunas={dias.map((d) => ({ rotulo: d.dia, fundo: d.fimDeSemana, partes: [
  { nome: "No prazo", cor: "var(--st-prazo)", valor: d.noPrazo }, { nome: "Com atraso", cor: "var(--st-atraso)", valor: d.atraso }] }))} />
```

![Painel com gráficos, claro](../imagens/claro/painel.png)
![Painel com gráficos, escuro](../imagens/escuro/painel.png)

## Funções de apoio (`src/lib/`)

| Função | Arquivo | Origem | Faz |
|---|---|---|---|
| `cn(...classes)` | `utils.ts` | cópia do Plus | Junta classes sem conflito. Use sempre que aceitar `className`. |
| `iniciais(nome)` | `utils.ts` | cópia do Plus | "Levi Mota" → "LM". |
| `mascaraCnpj(t)`, `mascaraCpf(t)` | `utils.ts` | cópia do Plus | Só números, já com pontos, barra e traço. |
| `plural(n, um, varios)` | `utils.ts` | cópia do Plus | "1 item", "2 itens". |
| `MESES`, `MESES_CURTOS`, `hojeIso()`, `mesAtual()`, `compPorExtenso(c)`, `compCurta(c)`, `ultimoDia(c)`, `somarMeses(c, n)` | `competencia.ts` | cópia do Plus | Competência `"AAAA-MM"` e datas no fuso do computador ("Setembro de 2026", "09/2026"). |
| `useCompetencia()`, `definirCompetencia(c)` | `competencia.ts` | cópia do Plus | A competência escolhida, igual em todas as telas. |
| `dataPorExtenso(v)` | `componentes/ui/seletor-data.tsx` | cópia do Plus | "2026-10-17" → "sex, 17 de outubro de 2026". |
| `pedirTela(p)`, `usePedidoTela(tela, fazer)` | `pedidoTela.ts` | cópia do Plus | Abrir um módulo já filtrado ou com um item aberto (ver [09-telas.md](09-telas.md)). |
| `confirmar(pedido)` | `confirmar.tsx` | cópia do Plus | "Tem certeza?" (ver acima). |
| `aplicarDesfoque(reduzir?)`, `desfoqueReduzido()` | `desfoque.ts` | cópia do Plus | "Reduzir desfoque". |
| `ligarBarraDiscreta()` | `rolagem.ts` | cópia do Plus | Barra de rolagem que só aparece rolando. |
| `avisar(texto)`, `useAvisoDeErro(q, oque)`, `copiarTexto(texto, sucesso?)` | `avisos.ts` | quase cópia | Balões (ver acima). |
| `corPorTexto(texto)` | `extras.ts` | só do kit | Cor fixa (hex) por texto: o mesmo item tem sempre a mesma cor (no Plus: `corDaEmpresa`, `corDaPessoa`). |
| `semAcento(t)` | `extras.ts` | só do kit | Para buscas: sem acento e sem maiúscula. |
| `lerNumeroBr(texto)`, `formatarBr(n, { casas, moeda })` | `numeros.ts` | só do kit | Números no jeito brasileiro ("1.234,56", "R$ 1.234,56"). |
