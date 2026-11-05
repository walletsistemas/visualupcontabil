# 12 · Conferência antes de entregar

> Rode esta lista inteira. Item que falhar volta para a tela correspondente. Mostre ao usuário
> o resultado (fotos e o que foi conferido), não só "está pronto".

## Regras (o mais importante)
- [ ] Cada tela migrada foi conferida contra a antiga com os **mesmos dados**: mesmas listas,
      mesmos totais, mesmas mensagens de erro e de permissão.
- [ ] Os testes do motor (se existiam) passam sem alteração.
- [ ] Nenhuma regra de negócio foi mudada sem o usuário pedir.
- [ ] Nenhum teste tocou os dados reais.

## Casca
- [ ] `npm run build` sem erro de TypeScript.
- [ ] `python -m pytest` passa (inclui o `teste_api.py` da casca: senha interna e endereço).
- [ ] A janela abre (`ABRIR.bat`), sem piscar branco, maximizada, com o nome certo.
- [ ] Fechar e abrir de novo lembra tema, menu recolhido e seções dobradas.
- [ ] Abrir duas vezes: a segunda avisa que já está aberto.

## Visual
- [ ] Nenhuma cor/raio/sombra solta no código novo: `grep -rnE "#[0-9a-fA-F]{3,6}|rounded-\[|shadow-\[" frontend/src/telas`
      (exceções só com comentário explicando).
- [ ] Todas as telas em **claro e escuro**, sem texto ilegível (atenção a texto sobre acento).
- [ ] Janela estreita (1024 px): menu vira automático, nada corta, nada rola de lado.
- [ ] Toda tela tem título + frase; uma ação principal; vazio, carregando e erro tratados.
- [ ] Todo botão desligado explica o motivo ao clicar.
- [ ] Toda gravação mostra balão de sucesso ou erro.
- [ ] Ctrl+K acha as telas e as ações combinadas; Ctrl+B recolhe o menu; Esc fecha janelas.
- [ ] Com "Reduzir desfoque" ligado, nada fica sem contraste.
- [ ] Com "reduzir animações" do Windows ligado, as telas continuam usáveis.

## Entrega
- [ ] Fotos novas do sistema da pessoa em claro e escuro (`npm run fotos` adaptado, ou prints).
- [ ] `docs/visual.md` com a receita da entrevista atualizada.
- [ ] Instalador gerado e testado num PC (ou VM) limpo.
- [ ] Nada de senha, `.env` ou dado de cliente no git.
- [ ] Commit final e resumo para o usuário: o que mudou, o que foi conferido, o que ficou para depois.
