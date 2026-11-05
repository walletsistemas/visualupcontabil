# Padrão visual UP Contábil — a casca do Sistema Contábil Plus

Este repositório é o **padrão obrigatório** para os sistemas internos do escritório. O
**Sistema Contábil Plus** foi escolhido como base e modelo: todos os outros sistemas em andamento
passam a usar a **mesma stack** e a **mesma casca** dele (tela de entrada, menu lateral, busca
Ctrl+K, janelas, cores, peças, organização das pastas). O objetivo é que, no futuro, todos virem
**uma coisa só**, dentro do Plus, com o mínimo de retrabalho.

![Painel](imagens/claro/painel.png)

| | |
|---|---|
| ![Cadastro](imagens/claro/cadastro-cartoes.png) | ![Ficha](imagens/escuro/ficha-lateral.png) |
| ![Entrada](imagens/escuro/entrada.png) | ![Busca](imagens/claro/busca-rapida.png) |

![Menu lateral](imagens/animacoes/menu-lateral.gif)

## Como usar no seu sistema (3 passos)

1. Clone este repositório **ao lado** do seu projeto:
   ```bash
   git clone https://github.com/walletsistemas/visualupcontabil.git
   ```
2. Abra a IA (Claude Code, Codex...) **dentro do seu projeto**.
3. Diga:
   > Leia `..\visualupcontabil\guia\00-comece-aqui.md` e siga o roteiro para fazer a cirurgia do
   > meu sistema para o padrão do Sistema Contábil Plus. Me entreviste antes de mudar qualquer coisa.

A IA vai: entender o seu sistema → entrevistar você (nome, módulos do menu, telas, o que é
particular) → mostrar um plano → montar a versão nova numa pasta própria e passar módulo por
módulo, conferindo que tudo continua dando o mesmo resultado. O sistema antigo fica intocado e
continua sendo o oficial até a versão nova estar pronta.

## O que é obrigatório e o que pode variar

| Igual ao Plus, sempre | Pode ser do seu sistema |
|---|---|
| Stack, organização das pastas, nomes de arquivos e peças | Módulos, seções e ícones do menu |
| Tela de entrada, menu lateral, busca, janelas, ficha, balões | As telas de cada módulo, as regras e os textos |
| Fonte, cantos, sombras, animações, logo da UP | O nome do sistema embaixo do logo |
| Os arquivos que são cópia do Plus | Ajuste pequeno de paleta (outros tons, mesmos nomes) |
| | Peças novas que o Plus não tem (com as classes do Plus) |

Regra para qualquer dúvida: **vai dar trabalho quando o sistema for juntado ao Plus?** Se sim,
não pode. Detalhes em [guia/01-o-padrao.md](guia/01-o-padrao.md).

## Ver o padrão rodando

Precisa de [Node.js](https://nodejs.org/) e [Python 3.12+](https://www.python.org/downloads/).

```bash
modelo\scripts\ABRIR_NO_NAVEGADOR.bat telas
```
As telas de exemplo no navegador, em http://localhost:5173.

```bash
modelo\scripts\ABRIR_NA_JANELA.bat ficticia
```
O programa completo, na janela própria, numa base de teste.

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| [`guia/`](guia/00-comece-aqui.md) | O roteiro da cirurgia para a IA, o padrão (obrigatório × pode variar), a entrevista, a migração do PyQt, princípios, cores, peças, telas, animações, instalador e a conferência final |
| `modelo/` | O esqueleto que **roda**, no formato do Plus: `backend/`, `frontend/`, `scripts/`, `installer/`, `tests/`, `assets/` e um `CLAUDE.md` modelo para o projeto |
| `imagens/` | Fotos de cada tela e peça (claro e escuro) e GIFs das animações |

## Manutenção

O Plus é a referência. Quando ele mudar algo da casca (um arquivo de `componentes/ui`, `lib`,
`index.css`, menu, entrada...), atualize a cópia em `modelo/` e as fotos (`npm run fotos` em
`modelo/frontend`). Veja [CLAUDE.md](CLAUDE.md).

Repositório interno da UP Contábil. Nunca coloque dados de clientes aqui.
