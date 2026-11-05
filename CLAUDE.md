# Instruções para a IA

Este repositório é o **padrão obrigatório** dos sistemas do escritório UP Contábil: a casca do
**Sistema Contábil Plus** (Python + FastAPI + pywebview; React + Vite + Tailwind), separada para
ser aplicada em todos os sistemas que um dia serão unidos ao Plus. Fale em português, simples.

## Se você foi aberta DENTRO de um sistema do escritório e apontada para cá
Leia [guia/00-comece-aqui.md](guia/00-comece-aqui.md) e siga o roteiro. Em resumo:
1. Entenda o projeto sem mudar nada e mostre o mapa (telas, motor, regras presas nas telas).
2. Entreviste o usuário ([guia/02-entrevista.md](guia/02-entrevista.md)): nome, módulos, telas,
   particularidades. A aparência já está decidida: é a do Plus.
3. Mostre o plano e peça um "ok".
4. Monte a versão nova numa pasta própria a partir de `modelo/`, copie o motor para
   `backend/motor/` e passe módulo por módulo, conferindo contra o antigo, com commit a cada parte.

Regras que não mudam ([guia/01-o-padrao.md](guia/01-o-padrao.md)):
- Mesma stack e mesma casca do Plus. Não ofereça tema no Qt, Electron, Tauri ou outra biblioteca,
  e não diga que é trabalho demais.
- Arquivos que são cópia do Plus não se editam. Cores, cantos, sombras e animações não se inventam.
- Pode variar: módulos, telas, regras, textos, nome do sistema, ajuste pequeno de paleta (mesmos
  nomes de token), peças novas com as classes do Plus em arquivo próprio — sempre registrado em
  `docs/visual.md`. Dúvida: "vai dar trabalho na unificação com o Plus?" Sim → não pode.
- As regras de negócio ficam em Python e não mudam. Nunca teste na base oficial.

## Se você foi aberta DENTRO deste repositório (para mantê-lo)
- A referência é o Plus (`..\sistema-contabil-plus`). Os arquivos marcados como cópia em
  `guia/01-o-padrao.md` devem ficar idênticos aos de lá: compare com
  `git diff --no-index --ignore-cr-at-eol <plus>/<arquivo> modelo/<arquivo>`.
- `modelo/frontend`: `npm install`, `npm run build`, `npm run dev`.
- `modelo`: `python -m pytest tests`.
- Fotos: `npx vite preview --port 4173` em `modelo/frontend` e, em outro terminal, `npm run fotos`
  (Edge do Windows; `SO=fotos|animacoes` para só uma parte).
- Dados de exemplo são inventados (`modelo/frontend/src/dados/exemplo.ts`). Nunca dado de cliente.
- `AGENTS.md` é cópia exata deste arquivo.
