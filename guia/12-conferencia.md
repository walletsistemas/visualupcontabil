# 12 · Conferência antes de entregar

> **Para a IA.** Rode esta lista inteira. Item que falhar volta para a tela correspondente.
> Mostre ao Levi o resultado (fotos e o que foi conferido), não só "está pronto".

## Regras (o mais importante)
- [ ] Cada tela migrada foi conferida contra a antiga com os **mesmos dados** (na base de teste):
      mesmas listas, mesmos totais, mesmas mensagens de erro e de permissão.
- [ ] Os testes do motor (se existiam) passam sem alteração.
- [ ] Nenhuma regra de negócio foi mudada sem o Levi pedir.
- [ ] Nenhum teste e nenhuma abertura pelo código tocou os dados reais (sempre
      `scripts\ABRIR_*.bat ficticia` / `teste`, ou a variável `MEU_SISTEMA_DADOS` definida).
- [ ] O sistema antigo continua intocado na pasta dele.

## Igual ao Plus
- [ ] Os arquivos que são **cópia do Plus** estão idênticos aos de lá. Para cada um, a comparação
      não mostra nada (PowerShell, na raiz do projeto):

      ```powershell
      $plus = "C:\Users\LEVIMOTA\Desktop\sistema-contabil-plus"
      $copias = @(
        "frontend/src/componentes/ui/botao.tsx", "frontend/src/componentes/ui/campo.tsx",
        "frontend/src/componentes/ui/caixa-selecao.tsx", "frontend/src/componentes/ui/lista.tsx",
        "frontend/src/componentes/ui/dialogo.tsx", "frontend/src/componentes/ui/aviso-erro.tsx",
        "frontend/src/componentes/ui/seletor-data.tsx", "frontend/src/componentes/ui/seletor-competencia.tsx",
        "frontend/src/lib/confirmar.tsx", "frontend/src/lib/competencia.ts", "frontend/src/lib/pedidoTela.ts",
        "frontend/src/lib/rolagem.ts", "frontend/src/lib/desfoque.ts", "frontend/src/lib/utils.ts",
        "frontend/src/api/cliente.ts", "frontend/src/api/janela.ts",
        "frontend/src/rotas/login/FundoAnimado.tsx", "backend/janela/ponte.py")
      foreach ($f in $copias) { git diff --no-index --ignore-cr-at-eol --stat "$plus/$f" $f }
      ```

      Saída vazia = igual. Um arquivo só, por exemplo:
      `git diff --no-index --ignore-cr-at-eol <plus>/frontend/src/componentes/ui/botao.tsx frontend/src/componentes/ui/botao.tsx`.
      Se o Plus mudou um desses arquivos, copie a versão nova de lá (nunca o contrário).
- [ ] `frontend/src/index.css` comparado com o do Plus: só pode diferir nas regras de uma tela
      de lá (barras da Escrituração, relatório em PDF) e nos **valores de cor** permitidos
      (`--verde`/`--verde-texto`, `--destaque`, `--menu`/`--menu-brilho-2`), cada um registrado
      no `docs/visual.md` em "Diferenças em relação ao Plus". Nenhum token novo, nenhum apagado,
      nenhum nome trocado ([07-cores-e-medidas.md](07-cores-e-medidas.md)).
- [ ] Nenhuma cor, raio ou sombra fora das que o Plus usa. Procure no código **novo** (telas dos
      módulos e peças criadas para o sistema):

      ```powershell
      git grep --untracked -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|rounded-\[|shadow-\[|blur-\[" -- frontend/src/rotas frontend/src/componentes
      ```

      Os arquivos que são cópia (ou quase cópia) do Plus e as peças do kit também aparecem:
      ignore-os. Nos arquivos novos, cada resultado tem que estar nas tabelas de raios, sombras e
      "cores escritas direto" do [07](07-cores-e-medidas.md). Classe de cor do Tailwind solta (`bg-green-600`,
      `text-blue-500`...) também não pode; o âmbar só nas classes do `Selo`/`SeletorCompetencia`.
- [ ] Fonte Inter; os tamanhos de letra, alturas e espaçamentos são os do [07](07-cores-e-medidas.md).
- [ ] Animações só com os nomes de `tema/movimento.ts` (nenhuma mola nova) ([10](10-animacoes.md)).
- [ ] **Logo da UP** no menu lateral (aberto e recolhido) e na tela de entrada, nos dois temas;
      `NOME_SISTEMA` com o nome do sistema embaixo do logo.
- [ ] Tela de entrada, menu lateral, busca Ctrl+K, janelas, gaveta e balões com o mesmo desenho
      do Plus (compare as fotos lado a lado).
- [ ] Peças novas (se houver) em arquivo próprio, montadas com as classes do Plus, e registradas
      no `docs/visual.md` ([08-componentes.md](08-componentes.md)).
- [ ] Módulos registrados em `modulos.ts` com chaves que não colidem com as do Plus.

## Casca
- [ ] `npm run build` sem erro de TypeScript.
- [ ] `python -m pytest tests` passa (inclui `tests/api/test_casca.py`: senha interna, endereço,
      senha no endereço só em `/api/arquivos/`, base de teste pelo código).
- [ ] `python backend\app.py` sem a variável de teste e sem `--oficial` **não abre** (avisa e para).
- [ ] A janela abre (`scripts\ABRIR_NA_JANELA.bat ficticia`), sem piscar branco, maximizada, com o
      nome certo.
- [ ] Fechar e abrir de novo lembra tema, menu recolhido e seções dobradas.
- [ ] Abrir duas vezes: a segunda avisa que já está aberto.
- [ ] A versão bate em `backend/versao.py`, `installer/instalador.iss` e na tela de entrada.

## Visual
- [ ] Todas as telas em **claro e escuro**, sem texto ilegível (atenção a texto branco sobre o
      verde, se a paleta mudou).
- [ ] Janela estreita (1024 px): menu vira automático, nada corta, nada rola de lado.
- [ ] Toda tela tem título + frase; uma ação principal; vazio, carregando e erro tratados.
- [ ] Todo botão desligado explica o motivo ao clicar.
- [ ] Toda gravação mostra balão de sucesso ou erro.
- [ ] Ctrl+K acha os módulos e as ações combinadas; "Abrir item" abre a ficha certa
      (`pedidoTela`); Ctrl+B recolhe o menu; Esc fecha janelas.
- [ ] Com "Reduzir desfoque" ligado, nada fica sem contraste.
- [ ] Com "reduzir animações" do Windows ligado, as telas continuam usáveis.
- [ ] Sem login (se for o caso): menu mostra "Preferências", "Sair" some, e nenhuma seção que
      deveria aparecer sumiu por causa do `soAdmin`.

## Entrega
- [ ] Fotos novas do sistema em claro e escuro (`npm run fotos` adaptado, ou prints).
- [ ] `docs/visual.md` do projeto atualizado, com a seção "Diferenças em relação ao Plus"
      (vazia, se não houver nenhuma).
- [ ] Instalador gerado (`installer\GERAR_INSTALADOR.bat`) e testado num PC (ou VM) limpo,
      **só se o Levi pediu**. Gerar não é publicar: nada instalado nas máquinas do escritório
      nem posto em pasta de atualização sem pedido explícito dele.
- [ ] Nada de senha, `.env` ou dado de cliente no git.
- [ ] Commit final e resumo para o Levi: o que mudou, o que foi conferido, o que ficou para depois.
