# Instruções para a IA

Este repositório é um **kit visual** (casca de programa desktop: Python + pywebview + React).
Ele não é o projeto do usuário: é a referência que você usa para fazer a "cirurgia" visual no
projeto dele.

## Se você foi aberta DENTRO do projeto do usuário e apontada para cá
Leia [guia/00-comece-aqui.md](guia/00-comece-aqui.md) e siga o roteiro. Em resumo:
1. Entenda o projeto sem mudar nada e mostre o mapa (telas, motor, regras presas nas telas).
2. Entreviste o usuário ([guia/02-entrevista.md](guia/02-entrevista.md)) em blocos curtos.
3. Mostre o plano e peça um "ok".
4. Copie `modelo/` e troque tela por tela, conferindo cada uma contra a antiga, com commit a cada parte.

Regras que não mudam:
- A cirurgia completa usa **a mesma stack** deste kit. Não ofereça tema no Qt, Electron,
  Tauri ou outra biblioteca de telas, e não diga que é trabalho demais
  ([guia/01-postura.md](guia/01-postura.md)).
- As regras de negócio do usuário ficam em Python e não mudam.
- Nomes, rótulos e cores vêm da entrevista, não do modelo.
- Nunca teste nos dados reais do usuário.

## Se você foi aberta DENTRO deste kit (para mantê-lo)
- `modelo/frontend`: `npm install`, `npm run build`, `npm run dev` (vitrine em :5173).
- `modelo/backend`: `python -m pytest modelo/backend/teste_api.py`.
- Fotos: `npx vite preview --port 4173` em `modelo/frontend` e, em outro terminal,
  `npm run fotos` (Edge do Windows; `SO=fotos|estilos|animacoes` para só uma parte).
- Mantenha o kit **neutro**: nada de nomes de empresa, de pessoas reais ou termos de um ramo
  específico. Dados de exemplo ficam em `modelo/frontend/src/dados/exemplo.ts`.
- Mudou um token? Atualize `estilos-prontos/*.css` e `guia/07-cores-e-medidas.md`.
- `AGENTS.md` é cópia exata deste arquivo.
