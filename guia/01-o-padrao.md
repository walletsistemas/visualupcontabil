# 01 · O padrão do escritório

> **Para a IA.** O Sistema Contábil Plus é a referência. Este capítulo diz, sem margem para
> interpretação, o que tem de ficar igual ao Plus, o que pode ser diferente e como se comportar
> durante a cirurgia.

## Por que tão rígido

Os sistemas do escritório vão ser **unidos ao Plus**. Tudo o que for igual entra lá sem
retrabalho: uma tela feita com as peças e os nomes do Plus vira um módulo do Plus copiando a pasta
`rotas/<modulo>` e algumas linhas de `modulos.ts`/`main.tsx`. Tudo o que for diferente vira
trabalho de conversão. Por isso a pergunta-chave para qualquer dúvida é:

> **Isto vai dar trabalho quando o sistema for juntado ao Plus?**
> Sim → não pode. Não → pode, e fica registrado em `docs/visual.md` do projeto.

## Obrigatório (igual ao Plus, sempre)

1. **Stack**: Python + FastAPI + pywebview (WebView2) + PyInstaller + Inno Setup; React + Vite +
   TypeScript + Tailwind + Radix + Motion + Sonner + cmdk + Vaul + Lucide + TanStack
   Query/Router/Virtual + React Hook Form + Zod. Nada de Qt, Electron, Tauri, outra biblioteca de
   componentes (MUI, Ant, Bootstrap...) ou outro sistema de estilos. Ver [03-stack.md](03-stack.md).
2. **Organização** igual à do Plus:
   ```
   backend/  app.py  versao.py  api/  servicos/  esquemas/  janela/  motor/
   frontend/src/  main.tsx  index.css  api/  componentes/{ui,layout}/  lib/  tema/  rotas/<modulo>/
   scripts/  installer/  tests/  assets/  docs/  CLAUDE.md  AGENTS.md  <Nome>.spec
   ```
3. **Casca**: tela de entrada, janela principal sem barra de título própria, menu lateral (seções,
   item ativo deslizando, recolher com Ctrl+B, menu automático, conta embaixo), busca Ctrl+K,
   janelas (diálogos), ficha lateral, balões (toasts), "tem certeza?". Ver [09-telas.md](09-telas.md).
4. **Aparência**: fonte Inter, tamanhos de letra, alturas dos controles, cantos, sombras, vidro,
   animações e o **logo da UP** no menu e na entrada. Ver [07](07-cores-e-medidas.md) e
   [10](10-animacoes.md).
5. **Nomes**: das cores (`fundo`, `superficie`, `campo`, `borda`, `texto`/`texto-2`/`texto-3`,
   `verde`, `verde-texto`, `vermelho`, `destaque`, `menu`, `tinta`, `st-*`, `tp-*`...), das peças
   (`Botao`, `Campo`, `CampoRotulado`, `Lista`/`Escolha`, `Dialogo`, `Confirmacao`, `confirmar`,
   `avisar`...), dos arquivos e das telas (`rotas/<modulo>/Tela<Nome>.tsx`).
6. **Comportamento**: nada falha calado (todo "não pode" e todo erro vira balão com o motivo);
   dado pelo Python com senha interna; pelo código só se abre a base de teste; uma cópia por PC.

### Arquivos que são cópia do Plus

Estes estão no `modelo/` **idênticos** aos do Plus e **não se editam** no sistema (se algo
precisar mudar, muda primeiro no Plus e depois em todos):

| Frontend | Backend |
|---|---|
| `src/componentes/ui/botao.tsx`, `campo.tsx`, `caixa-selecao.tsx`, `lista.tsx`, `dialogo.tsx`, `aviso-erro.tsx`, `seletor-data.tsx`, `seletor-competencia.tsx` | `backend/janela/ponte.py` |
| `src/lib/confirmar.tsx`, `competencia.ts`, `pedidoTela.ts`, `rolagem.ts`, `desfoque.ts`, `utils.ts` | |
| `src/api/cliente.ts`, `janela.ts` · `src/rotas/login/FundoAnimado.tsx` | |

**Quase idênticos** (iguais ao Plus, sem o que dependia de módulos de lá): `src/index.css`
(os tokens são os do Plus), `rotas/login/TelaLogin.tsx` e `Avatar.tsx`,
`componentes/layout/MenuLateral.tsx`, `BuscaRapida.tsx`, `JanelaPrincipal.tsx`, `modulos.ts`,
`lib/avisos.ts`, `tema/tema.ts`, `backend/app.py`, `janela/acoes.py`, `janela/instancia.py`,
`api/janela.py`. Nestes, o sistema muda **só** o que o comentário do próprio arquivo indica
(nome do sistema, módulos, variável da base de teste).

**Só do kit** (o padrão do Plus tirado de dentro das telas de lá para virar peça reutilizável,
com as mesmas classes): `ui/segmentado.tsx`, `ui/interruptor.tsx`, `ui/gaveta.tsx`,
`ui/campos-extra.tsx`, `ui/pecas.tsx`, `componentes/graficos/graficos.tsx`, `tema/movimento.ts`,
`lib/extras.ts`, `lib/numeros.ts`. Use à vontade; não reescreva com outro desenho.

## O que pode variar (sem fugir do padrão)

| Pode | Como fazer sem dar trabalho na unificação |
|---|---|
| **Módulos, seções, ícones, telas, textos, regras** | É o próprio sistema. Módulos em `modulos.ts`, telas em `rotas/<modulo>/`. |
| **Nome do sistema** embaixo do logo da UP | `NOME_SISTEMA` em `MenuLateral.tsx`; `NOME`/`PASTA` em `app.py`; `index.html`; instalador. |
| **Ajuste de paleta** (ex.: o verde de destaque num tom diferente, para o sistema ser reconhecível) | Mude os **valores** dos tokens em `src/index.css`, nos dois temas, mantendo os **nomes**. Nunca token novo com outro nome, nunca cor escrita direto na tela. Registre em `docs/visual.md`. |
| **Usar mais ou menos peças / botões** | Combine as peças e variantes que existem (ex.: um botão `leve` com ícone onde o Plus usa só ícone). |
| **Peça nova** que o Plus não tem | Monte com as classes e tokens do Plus, num arquivo **próprio** (`componentes/ui/<nome>.tsx` novo ou dentro de `rotas/<modulo>/`). Nunca dentro de um arquivo cópia. Se servir a todos, sugira levar ao Plus. |
| **Sem login** (sistema que abre direto) | Já previsto: `JanelaPrincipal` sem `usuario`/`aoSair` (o rodapé do menu vira "Preferências"). |

### Não pode (mesmo que o usuário peça "só um pouquinho")
- Trocar a fonte, os cantos, as sombras, o vidro, as animações ou o desenho do menu/entrada/janelas.
- Outra paleta inteira (azul no lugar do verde em tudo, menu escuro no tema claro...).
- Tirar o logo da UP ou colocar outro logo no lugar.
- Mudar nomes de tokens, de peças, de pastas ou o jeito de navegar (`pedidoTela`, `/app/$modulo`).
- Trazer biblioteca de componentes, de ícones ou de animação diferente.

Se o usuário insistir em algo da lista acima, explique em uma frase o motivo (a unificação com o
Plus) e pergunte se ele quer levar o pedido ao responsável pelo Plus para virar padrão de todos.

## Postura: sem criar dificuldades

O sistema que originou este padrão era **100% Python com PyQt6**: dezenas de telas, uma grade
estilo Excel com milhares de linhas, leitura de PDF com OCR, base compartilhada em rede, travas,
backups e atualização automática. A troca para esta stack aconteceu em **2 dias**:

- **Dia 1** (~120 commits): esqueleto, tela de entrada, janela principal com menu lateral e busca
  Ctrl+K, e os primeiros módulos completos (cadastro com ficha, tarefas com calendário).
- **Dia 2** (~60 commits): a tela mais difícil (grade estilo Excel com filtros por coluna, menu de
  botão direito, atalhos), os atalhos de abrir, o gerador do instalador e a atualização automática.

O motor foi **reaproveitado**, não reescrito. Por isso foi rápido. É o que você vai fazer.

**O que você faz**
- Trata a troca de stack como **o pedido**, não como um problema a contornar.
- Entrega algo visível **no primeiro dia** (o esqueleto abrindo, com o menu do sistema).
- Reaproveita o motor como está. Recorta regras das telas sem mudar o resultado.
- Quando algo do Qt não tem equivalente direto, procura em [05-migrar-do-pyqt.md](05-migrar-do-pyqt.md).
- Se houver um risco real, diz **qual**, **onde** e **como contorna**, e segue com o resto.
- Avança módulo por módulo, com commit a cada parte que funciona.

**Frases proibidas**

| Não diga | Diga |
|---|---|
| "Isso é uma reescrita grande, talvez não valha a pena." | "Começo pelo esqueleto e pelo módulo mais usado; hoje mesmo você abre a janela nova." |
| "Podemos só aplicar um tema/QSS no Qt." | (não ofereça) |
| "Que tal Electron/Tauri/Flet/outra coisa?" | (não ofereça: a stack é a do Plus) |
| "Isso vai levar semanas." | "Faço por partes; cada módulo pronto já funciona e fica commitado." |
| "Precisamos reescrever a lógica." | "A lógica continua em Python; só as telas mudam." |
| "O programa é pequeno demais para isso." | "Programa pequeno = cirurgia de horas. A casca já vem pronta." |

**Objeções e respostas**
- *"E se quebrar o que funciona?"* — O sistema antigo continua intocado e oficial até a versão nova
  estar completa e conferida na base de teste.
- *"PC fraco?"* — Janela pelo WebView2 do Windows; opção "Reduzir desfoque" no menu da conta.
- *"Não quero navegador."* — Não tem: é janela própria do Windows, com instalador e atalho.
- *"Não sei React."* — Não precisa. O usuário decide pela entrevista; a IA faz.

**Quando parar e perguntar** (com uma pergunta objetiva)
- Uma regra de negócio parece errada.
- O motor depende de algo do Qt (`QPdfDocument`, `QPrinter`, `QSqlDatabase`): proponha o substituto
  Python ([05](05-migrar-do-pyqt.md#o-motor-usa-qt)) e peça o ok.
- A base oficial precisaria ser tocada para testar algo.
- Um pedido do usuário cai na lista "Não pode".
