# 02 · A entrevista

> **Para a IA.** A aparência já está decidida: é a do Sistema Contábil Plus. A entrevista serve
> para o que é **deste sistema**: nome, módulos, telas, comportamento e as poucas diferenças
> permitidas ([01-o-padrao.md](01-o-padrao.md)). Pergunte em **blocos de 3–4**, sempre com a sua
> recomendação; se a sua ferramenta tem perguntas de múltipla escolha (ex.: AskUserQuestion),
> use-as. Não pergunte o que dá para descobrir no código. "Decide você" = use a recomendação.
> As respostas vão para `docs/visual.md` do projeto.
>
> Antes de começar, mostre ao usuário 2 ou 3 fotos do padrão para ele saber como vai ficar:
> [entrada](../imagens/claro/entrada.png), [painel](../imagens/claro/painel.png),
> [cadastro](../imagens/claro/cadastro-cartoes.png), [ficha](../imagens/escuro/ficha-lateral.png).

---

## Bloco 1 · Identidade

**1. Nome do sistema** (aparece embaixo do logo da UP no menu e na entrada, na janela e no
instalador). *Recomendado: o nome atual do sistema.* O logo é sempre o da UP.

**2. Nome da pasta e da variável de teste.** Proponha a partir do nome, sem acento nem espaço
(ex.: "Folha Fácil" → pasta `FolhaFacil`, variável `FOLHA_FACIL_DADOS`). Só confirme.

**3. Onde fica a base de teste (fictícia)?** Proponha uma cópia dos dados em
`%USERPROFILE%\Desktop\<BASE> FICTICIA` (como o `BANCO FICTICIO` do Plus). Nunca a oficial.

**4. A paleta do Plus serve, ou o sistema precisa de um tom próprio para ser reconhecido?**
- Igual ao Plus *(recomendado)*
- Ajuste pequeno: outro tom de verde no destaque (mostre 2 ou 3 tons próximos). Só os valores
  dos tokens mudam, nos dois temas; os nomes ficam. Fora disso, explique que não pode
  ([01](01-o-padrao.md#não-pode-mesmo-que-o-usuário-peça-só-um-pouquinho)).

---

## Bloco 2 · Organização

**5. Módulos do menu.** Mostre o mapa de telas da Fase 1 e proponha:
- as **seções** (títulos em caixa alta; o Plus usa "Gestão", "Operação", "Administração");
- os **módulos** de cada seção, com nome, ícone (da biblioteca Lucide; diga o nome do ícone) e uma
  frase de descrição (aparece na busca Ctrl+K);
- quais seções são **só do administrador**;
- quais módulos têm **contador** na bolinha (pendências).
Lembre: módulo com nome igual a um do Plus (ex.: "Empresas") terá de ser juntado ao do Plus um
dia — pergunte se é o mesmo assunto.

![menu](../imagens/claro/menu-conta.png)

**6. Primeira tela depois de entrar?**
- Um **painel** com números e gráficos do mês, como a Visão geral do Plus *(recomendado se
  houver o que medir)*
- O módulo mais usado direto

**7. Para cada módulo que é lista:** cartões, lista, ou os dois com o alternador (como Empresas
no Plus)? O que aparece no cartão (no máximo: nome, 1 linha de detalhe, 1 selo de situação, 2–4
dados, pessoas e um valor)? Clicar abre a **ficha lateral** *(recomendado)* ou uma tela inteira?
![cartões](../imagens/claro/cadastro-cartoes.png)

**8. Tem login?**
- Sim, igual ao Plus (foto/iniciais ao digitar, lembrar login, mudar senha) *(recomendado se o
  sistema antigo tinha usuários)*
- Não: abre direto na janela principal (o rodapé do menu vira "Preferências")

---

## Bloco 3 · Comportamento

**9. Busca rápida (Ctrl+K):** além das telas, que **ações** ("Novo X") e que **registros**
(quais, por quais campos) ela deve achar?
![busca](../imagens/claro/busca-rapida.png)

**10. Confirmações:** quais ações pedem "tem certeza?" (sugestão: apagar, sobrescrever, enviar
para outros). As demais avisam com balão de sucesso.

**11. Atalhos de teclado** que a equipe já usa no sistema antigo (o Plus já tem Ctrl+K e Ctrl+B).
Os antigos continuam funcionando.

**12. Peças que o Plus não tem:** alguma tela precisa de algo que não está em
[08-componentes.md](08-componentes.md)? Se sim, será uma peça nova, com as classes do Plus, num
arquivo próprio — e anotada em "Diferenças em relação ao Plus".

---

## Fechamento

Mostre o resumo e peça o "ok". Grave em `docs/visual.md` neste formato:

```md
# Receita visual — <Nome do Sistema>
Padrão: Sistema Contábil Plus (kit visualupcontabil). Logo: UP.

- Nome no menu/entrada: <NOME> · Pasta: <Pasta> · Variável de teste: <VAR_DADOS>
- Base de teste: <caminho>
- Menu:
  - Gestão: Painel (LayoutDashboard), Clientes (Users, contador: pendências)
  - Administração (só admin): Usuários (UserCog)
- Primeira tela: Painel · Login: sim (igual ao Plus)
- Listas: Clientes = cartões + lista, ficha lateral
- Busca Ctrl+K: telas, "Novo cliente", clientes por nome/CNPJ
- Confirmar antes de: apagar, enviar

## Diferenças em relação ao Plus
- (nenhuma) | ex.: --verde claro #2f7a6b / escuro #2e7a6b (tom do sistema); peça nova Linha do tempo (rotas/historico/LinhaDoTempo.tsx)
```
