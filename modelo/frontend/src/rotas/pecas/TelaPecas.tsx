import { useState, type ReactNode } from "react";
import { Bell, Download, Inbox, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import { Botao } from "@/componentes/ui/botao";
import { Campo, CampoRotulado } from "@/componentes/ui/campo";
import { CampoBusca } from "@/componentes/ui/campos-extra";
import { Confirmacao, Dialogo } from "@/componentes/ui/dialogo";
import { CaixaSelecao } from "@/componentes/ui/caixa-selecao";
import { Interruptor } from "@/componentes/ui/interruptor";
import { Segmentado } from "@/componentes/ui/segmentado";
import { Escolha } from "@/componentes/ui/lista";
import { SeletorCompetencia } from "@/componentes/ui/seletor-competencia";
import { Avatar, BarraOcupada, ErroDoCampo, Dado, Dica, Divisoria, IconeApp, ItemMenu, MenuSuspenso, Pessoas, Selo, Vazio } from "@/componentes/ui/pecas";
import { avisar } from "@/lib/avisos";
import { confirmar } from "@/lib/confirmar";
import { mesAtual } from "@/lib/competencia";
import { PESSOAS_EXEMPLO } from "@/dados/exemplo";

/** CATÁLOGO: todas as peças, uma seção para cada. É daqui que saem as fotos do guia. */
export function TelaPecas() {
  const [seg, setSeg] = useState<"a" | "b" | "c">("a");
  const [marcado, setMarcado] = useState(true);
  const [ligado, setLigado] = useState(true);
  const [esc, setEsc] = useState("Opção 1");
  const [busca, setBusca] = useState("");
  const [mes, setMes] = useState(mesAtual());
  const [dialogo, setDialogo] = useState(false);
  const [pergunta, setPergunta] = useState(false);

  return (
    <div className="pb-12">
      <CabecalhoTela titulo="Todas as peças" subtitulo="Cada peça em todos os seus estados. Copie, não reinvente." />
      <div className="flex flex-col gap-3.5 px-6">
        <Secao id="botoes" titulo="Botões" nota="primario = a ação da tela (uma só) · verde = confirmar · leve = secundário · fantasma = barras · vermelho = apagar">
          <div className="flex flex-wrap items-center gap-2">
            <Botao><Plus className="size-4" /> Primário</Botao>
            <Botao variante="verde">Acento</Botao>
            <Botao variante="leve">Leve</Botao>
            <Botao variante="fantasma">Fantasma</Botao>
            <Botao className="bg-vermelho text-white hover:brightness-110"><Trash2 className="size-4" /> Apagar (vermelho)</Botao>
            <Botao variante="link">Link</Botao>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Botao tamanho="p">Pequeno</Botao>
            <Botao tamanho="m">Médio</Botao>
            <Botao tamanho="g">Grande</Botao>
            <Botao tamanho="icone" variante="leve" aria-label="Editar"><Pencil className="size-4" /></Botao>
            <Botao carregando>Salvando</Botao>
            <Botao disabled>Desligado</Botao>
          </div>
        </Secao>

        <Secao id="campos" titulo="Campos">
          <div className="grid gap-4 @3xl:grid-cols-2">
            <Campo icone={Bell} placeholder="Campo grande com ícone" />
            <Campo icone={Bell} placeholder="Com erro" erro />
            <CampoRotulado rotulo="Campo de formulário" placeholder="Digite aqui" dica="Uma dica curta embaixo." />
            <div>
              <CampoRotulado rotulo="Com erro" defaultValue="abc" aria-invalid className="border-vermelho/50 ring-4 ring-vermelho/10" />
              <ErroDoCampo texto="Escreva pelo menos 3 letras." />
            </div>
            <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Busca da barra de ferramentas…" />
            <Escolha valor={esc} aoMudar={setEsc} itens={["Opção 1", "Opção 2", "Opção 3"].map((o) => ({ valor: o, rotulo: o }))} />
          </div>
        </Secao>

        <Secao id="controles" titulo="Controles">
          <div className="flex flex-wrap items-center gap-6">
            <Segmentado valor={seg} opcoes={[["a", "Dia"], ["b", "Semana"], ["c", "Mês"]]} aoMudar={setSeg} />
            <CaixaSelecao rotulo="Caixa de marcar" marcado={marcado} aoMudar={setMarcado} />
            <Interruptor rotulo="Interruptor" ligado={ligado} aoMudar={setLigado} />
            <SeletorCompetencia valor={mes} atual={mesAtual()} aoMudar={setMes} />
          </div>
        </Secao>

        <Secao id="selos" titulo="Selos, avatares e identidade">
          <div className="flex flex-wrap items-center gap-2">
            <Selo>Neutro</Selo>
            <Selo tom="verde">Concluído</Selo>
            <Selo tom="ambar">Atenção</Selo>
            <Selo tom="vermelho">Atrasado</Selo>
            <span className="mx-2 h-6 w-px bg-borda" />
            {PESSOAS_EXEMPLO.slice(0, 4).map((p) => <Avatar key={p} nome={p} />)}
            <Pessoas nomes={PESSOAS_EXEMPLO.slice(0, 4)} />
            <span className="mx-2 h-6 w-px bg-borda" />
            <IconeApp nome="Projeto Alfa" />
            <IconeApp nome="Vale Verde" />
            <IconeApp nome="Rio Claro" />
          </div>
          <div className="mt-4 grid max-w-xl grid-cols-3 gap-1.5">
            <Dado rotulo="Dado" valor="Valor curto" copiavel />
            <Dado rotulo="Vazio" valor="" />
            <Dado rotulo="Número" valor="1.234,56" />
          </div>
        </Secao>

        <Secao id="janelas" titulo="Janelas, menus e avisos" nota="Nada falha calado: todo erro e toda ação concluída vira um balão.">
          <div className="flex flex-wrap items-center gap-2">
            <Botao variante="leve" onClick={() => setDialogo(true)}>Abrir janela</Botao>
            <Botao variante="leve" onClick={() => setPergunta(true)}>Pergunta sim/não</Botao>
            <Botao variante="leve" onClick={() => confirmar({ titulo: "Apagar?", texto: "Não dá para desfazer.", botao: "Apagar" })}>confirmar()</Botao>
            <MenuSuspenso alinhar="start" gatilho={<Botao variante="leve">Menu suspenso</Botao>}>
              <ItemMenu icone={Pencil} texto="Editar" aoClicar={() => {}} />
              <ItemMenu icone={Download} texto="Baixar" aoClicar={() => {}} />
              <Divisoria />
              <ItemMenu icone={Trash2} texto="Apagar" perigo aoClicar={() => {}} />
            </MenuSuspenso>
            <Dica texto="Uma dica curta"><Botao variante="leve">Passe o mouse</Botao></Dica>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Botao variante="fantasma" tamanho="p" onClick={() => toast.success("Salvo.")}>Balão de sucesso</Botao>
            <Botao variante="fantasma" tamanho="p" onClick={() => toast.error("Não foi possível salvar: a pasta está fora do ar.")}>Balão de erro</Botao>
            <Botao variante="fantasma" tamanho="p" onClick={() => avisar("Só quem criou pode apagar este item.")}>Balão de motivo</Botao>
            <Botao variante="fantasma" tamanho="p" onClick={() => toast("Informação neutra.")}>Balão neutro</Botao>
          </div>
        </Secao>

        <Secao id="estados" titulo="Estados: carregando e vazio">
          <BarraOcupada className="max-w-sm" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-[20px] bg-campo" />)}
          </div>
          <Vazio icone={Inbox} titulo="Nada por aqui ainda" texto="Quando houver itens, eles aparecem nesta área." acao={{ texto: "Criar o primeiro", aoClicar: () => {} }} />
        </Secao>

        <Secao id="cores" titulo="Cores (tokens)">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
            {["fundo", "superficie", "campo", "borda", "texto", "texto-2", "texto-3", "primario", "verde", "verde-texto", "vermelho", "bege", "grafite", "menu", "destaque", "st-prazo", "st-atraso", "st-vencida", "st-aberta", "tp-rotina", "tp-tarefa", "tp-estudo"].map((t) => (
              <div key={t} className="overflow-hidden rounded-xl border border-borda">
                <div className="h-12" style={{ background: `var(--${t})` }} />
                <p className="px-2 py-1 font-mono text-[11px] text-texto-2">--{t}</p>
              </div>
            ))}
          </div>
        </Secao>
      </div>

      <Dialogo aberto={dialogo} aoFechar={() => setDialogo(false)} titulo="Título da janela" descricao="Uma frase que explica o que esta janela faz.">
        <div className="flex flex-col gap-3">
          <CampoRotulado rotulo="Campo" placeholder="Digite" />
          <div className="flex justify-end gap-2">
            <Botao variante="leve" onClick={() => setDialogo(false)}>Cancelar</Botao>
            <Botao variante="verde" onClick={() => setDialogo(false)}>Salvar</Botao>
          </div>
        </div>
      </Dialogo>
      <Confirmacao aberto={pergunta} titulo="Apagar este item?" texto="Ele sai da lista e não dá para desfazer." sim="Apagar" perigoso aoResponder={() => setPergunta(false)} />
    </div>
  );
}

function Secao({ id, titulo, nota, children }: { id: string; titulo: string; nota?: string; children: ReactNode }) {
  return (
    <section id={id} className="rounded-[20px] border border-borda bg-superficie p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <h2 className="text-[15px] font-semibold tracking-tight">{titulo}</h2>
      {nota && <p className="mt-0.5 text-[12px] text-texto-3">{nota}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
