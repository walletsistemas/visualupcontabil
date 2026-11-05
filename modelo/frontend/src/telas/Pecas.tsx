import { useState, type ReactNode } from "react";
import { Bell, Download, Inbox, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import { Botao } from "@/componentes/ui/botao";
import { Campo, CampoBusca, CampoRotulado } from "@/componentes/ui/campo";
import { Confirmacao, Dialogo } from "@/componentes/ui/dialogo";
import { CaixaSelecao, Interruptor, Segmentado } from "@/componentes/ui/marcadores";
import { Escolha } from "@/componentes/ui/lista";
import { SeletorMes } from "@/componentes/ui/seletor-mes";
import { Avatar, BarraOcupada, Dado, Dica, Divisoria, IconeApp, ItemMenu, MenuSuspenso, Pessoas, Selo, Vazio } from "@/componentes/ui/pecas";
import { avisar } from "@/lib/avisos";
import { confirmar } from "@/lib/confirmar";
import { mesAtual } from "@/lib/datas";
import { PESSOAS_EXEMPLO } from "@/dados/exemplo";

/** CATÁLOGO: todas as peças, uma seção para cada. É daqui que saem as fotos do guia. */
export function Pecas() {
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
        <Secao id="botoes" titulo="Botões" nota="primario = a ação da tela (uma só) · acento = confirmar · leve = secundário · fantasma = barras · perigo = apagar">
          <div className="flex flex-wrap items-center gap-2">
            <Botao><Plus className="size-4" /> Primário</Botao>
            <Botao variante="acento">Acento</Botao>
            <Botao variante="leve">Leve</Botao>
            <Botao variante="fantasma">Fantasma</Botao>
            <Botao variante="perigo"><Trash2 className="size-4" /> Perigo</Botao>
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
            <CampoRotulado rotulo="Com erro" defaultValue="abc" erro="Escreva pelo menos 3 letras." />
            <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Busca da barra de ferramentas…" />
            <Escolha valor={esc} aoMudar={setEsc} itens={["Opção 1", "Opção 2", "Opção 3"].map((o) => ({ valor: o, rotulo: o }))} />
          </div>
        </Secao>

        <Secao id="controles" titulo="Controles">
          <div className="flex flex-wrap items-center gap-6">
            <Segmentado valor={seg} opcoes={[["a", "Dia"], ["b", "Semana"], ["c", "Mês"]]} aoMudar={setSeg} />
            <CaixaSelecao rotulo="Caixa de marcar" marcado={marcado} aoMudar={setMarcado} />
            <Interruptor rotulo="Interruptor" ligado={ligado} aoMudar={setLigado} />
            <SeletorMes valor={mes} atual={mesAtual()} aoMudar={setMes} />
          </div>
        </Secao>

        <Secao id="selos" titulo="Selos, avatares e identidade">
          <div className="flex flex-wrap items-center gap-2">
            <Selo>Neutro</Selo>
            <Selo tom="acento">Concluído</Selo>
            <Selo tom="alerta">Atenção</Selo>
            <Selo tom="perigo">Atrasado</Selo>
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
            {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-cartao bg-campo" />)}
          </div>
          <Vazio icone={Inbox} titulo="Nada por aqui ainda" texto="Quando houver itens, eles aparecem nesta área." acao={{ texto: "Criar o primeiro", aoClicar: () => {} }} />
        </Secao>

        <Secao id="cores" titulo="Cores (tokens)">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
            {["fundo", "superficie", "campo", "borda", "texto", "texto-2", "texto-3", "primario", "acento", "acento-texto", "perigo", "alerta", "menu", "marca", "g-1", "g-2", "g-3", "g-4", "g-5", "g-6", "g-7"].map((t) => (
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
            <Botao variante="acento" onClick={() => setDialogo(false)}>Salvar</Botao>
          </div>
        </div>
      </Dialogo>
      <Confirmacao aberto={pergunta} titulo="Apagar este item?" texto="Ele sai da lista e não dá para desfazer." sim="Apagar" perigoso aoResponder={() => setPergunta(false)} />
    </div>
  );
}

function Secao({ id, titulo, nota, children }: { id: string; titulo: string; nota?: string; children: ReactNode }) {
  return (
    <section id={id} className="rounded-cartao border border-borda bg-superficie p-5 shadow-cartao">
      <h2 className="text-[15px] font-semibold tracking-tight">{titulo}</h2>
      {nota && <p className="mt-0.5 text-[12px] text-texto-3">{nota}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
