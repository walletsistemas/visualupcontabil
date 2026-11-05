# <Nome do Sistema> — regras para quem mexe no código

> MODELO de CLAUDE.md para os sistemas do escritório, no mesmo formato do Sistema Contábil Plus.
> Ao copiar o modelo para um projeto: troque os `<...>`, apague esta nota e copie para `AGENTS.md`.

Quem usa é <responsável>, <função> (não programador). Explique em linguagem simples e sempre
diga o que muda na prática. Fale em português.

## O que é este projeto

Versão nova do <sistema antigo> (o atual está em `<..\pasta-do-antigo>`), com a **casca do
Sistema Contábil Plus**, que é o padrão visual e técnico de todos os sistemas do escritório.
Um dia todos viram uma coisa só: por isso tudo que é casca fica IGUAL ao Plus. O guia completo
está em `<..\visualupcontabil\guia\00-comece-aqui.md>`.

O funcionamento continua o mesmo de hoje:
- programa desktop instalado em cada computador (`.exe` + instalador), janela própria do Windows;
- <onde ficam os dados e como são travados/copiados — igual ao sistema antigo>.

**Reaproveitar ao máximo o motor atual.** Nada de reescrever regras que já funcionam.

## Stack (obrigatória, a mesma do Plus)

- **Backend (Python):** FastAPI (só em 127.0.0.1, porta sorteada, com senha interna), Pydantic,
  pywebview (janela pelo WebView2), PyInstaller, Inno Setup, pytest.
- **Frontend (TypeScript):** React, Vite, Tailwind CSS, Radix UI, fonte Inter, Motion, Vaul,
  Sonner, cmdk (busca Ctrl+K), Lucide, TanStack Query/Router/Virtual, React Hook Form + Zod.
- Não usar Electron, Tauri, Django, pandas, outra biblioteca de componentes nem outro tema.

## Estrutura (a mesma do Plus)

| Pasta | O que tem |
|---|---|
| `backend/` | `motor/` (cópia do motor antigo, mudando o mínimo), `api/` (portas por assunto), `servicos/` (regras tiradas das telas Qt), `esquemas/` (Pydantic), `janela/` (pywebview), `app.py`, `versao.py`. |
| `frontend/` | Telas: uma pasta por módulo em `src/rotas/`; peças em `src/componentes/`; cores em `src/index.css`. |
| `assets/` | Ícone e arquivos que vão junto do programa. |
| `installer/` | `instalador.iss` e `GERAR_INSTALADOR.bat`. |
| `scripts/` | `.bat` de abrir (janela ou navegador; base fictícia ou oficial). |
| `tests/` | pytest (`api/`, `motor/`). |
| `docs/` | Documentação. |

## Regras do padrão (não mudam de sistema para sistema)

- Cores, fonte, medidas, sombras, animações, tela de entrada, menu lateral, busca Ctrl+K,
  janelas, balões e peças: **iguais ao Plus**. Copie do kit (`visualupcontabil/modelo`), não invente.
- Arquivos que existem no Plus ficam idênticos aos de lá (`componentes/ui/*`, `lib/*`, `index.css`...).
- O que é deste sistema: os módulos do menu, as telas de cada módulo, as regras e os textos.

## Regras que já custaram caro (herdadas do Plus)

- **Base de teste (fictícia):** `<pasta>`, aberta com `scripts\ABRIR_NA_JANELA.bat ficticia` ou
  `scripts\ABRIR_NO_NAVEGADOR.bat ficticia` (`teste` = sem navegador, porta 8765, senha "dev").
  Nunca abra o programa pelo código sem esse isolamento. A variável é `<VAR_DADOS>`: confira que
  está definida, não presuma.
- **Versão:** `backend/versao.py` é a fonte; os demais arquivos que levam a versão batem com ela.
- **Publicar atualização só com pedido explícito**, a cada vez.
- Dado de cliente (extratos, balancetes, planilhas) nunca entra no git.
- O sistema antigo continua o oficial até esta versão estar completa e testada na base de teste.

## Git

- Ao iniciar cada sessão, antes de qualquer tarefa, faça `git pull`.
- Ao terminar cada parte que funciona, faça commit. Ao concluir cada tarefa, commit e push.
- Se travou ou vai parar: commit e push do jeito que está, com o tipo `wip`.
- Mensagens "tipo: descrição curta em português". Tipos: `feat`, `fix`, `refactor`, `docs`,
  `style`, `chore`, `wip`. Um commit por assunto.
- Nunca envie senhas, tokens, `.env` ou dados de clientes. Nunca `push --force` nem `reset --hard`.
  Se o push for recusado, `pull` antes; se der conflito, pare e explique.

## AGENTS.md

`AGENTS.md` é cópia exata deste arquivo (para o Codex). Ao mudar um, copie para o outro.
