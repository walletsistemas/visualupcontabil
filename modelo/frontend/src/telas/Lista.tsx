import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Download, LayoutGrid, List, MoreHorizontal, Pencil, Plus, SearchX, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { exemploApi } from "@/api/exemplo";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import type { Pedido } from "@/componentes/layout/telas";
import { Botao } from "@/componentes/ui/botao";
import { CampoBusca } from "@/componentes/ui/campo";
import { Gaveta } from "@/componentes/ui/dialogo";
import { Segmentado } from "@/componentes/ui/marcadores";
import { BarraPartes } from "@/componentes/graficos/graficos";
import { Dado, Esqueleto, IconeApp, ItemMenu, MenuSuspenso, Pessoas, Selo, TituloGrupo, Vazio } from "@/componentes/ui/pecas";
import { COR_SITUACAO, ROTULO_SITUACAO, type Item, type Situacao } from "@/dados/exemplo";
import { confirmar } from "@/lib/confirmar";
import { cn, corPorTexto, plural, semAcento } from "@/lib/utils";
import { cascata } from "@/tema/movimento";

const TOM: Record<Situacao, "acento" | "neutro" | "perigo" | "alerta"> = { concluido: "acento", andamento: "neutro", atrasado: "perigo", pendente: "alerta" };
const dataBr = (iso: string) => iso.split("-").reverse().join("/");

/**
 * CADASTRO: barra de ferramentas (filtro, busca, contagem, modo de ver, botão principal, «…»),
 * grade de CARTÕES ou LISTA, e a FICHA lateral (gaveta) ao clicar.
 */
export function Lista({ aoNovo, pedido = {} }: { aoNovo: () => void; pedido?: Pedido }) {
  const q = useQuery({ queryKey: ["itens"], queryFn: exemploApi.itens });
  const [busca, setBusca] = useState("");
  const [modo, setModo] = useState<"cartoes" | "lista">("cartoes");
  const [filtro, setFiltro] = useState<"todos" | "abertos">(pedido.filtro === "abertos" ? "abertos" : "todos");
  const [aberto, setAberto] = useState<Item | null>(null);
  // pedido «abrir o item N» (busca Ctrl+K, atalhos): abre a ficha assim que a lista chega
  useEffect(() => {
    if (pedido.abrir && q.data) setAberto(q.data.find((i) => i.id === pedido.abrir) ?? null);
  }, [pedido.abrir, q.data]);

  const itens = (q.data ?? [])
    .filter((i) => filtro === "todos" || i.situacao !== "concluido")
    .filter((i) => !busca || semAcento(`${i.nome} ${i.codigo} ${i.responsavel} ${i.cidade}`).includes(semAcento(busca)));

  return (
    <div className="flex h-full flex-col">
      <CabecalhoTela titulo="Cadastro" subtitulo="Cartões para olhar, lista para comparar. Clique para abrir a ficha.">
        <Segmentado valor={filtro} opcoes={[["todos", "Todos"], ["abertos", "Em aberto"]]} aoMudar={setFiltro} />
        <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Buscar por nome, código, responsável, cidade…" className="ml-2" />
        <span className="px-1 text-[12.5px] tabular-nums text-texto-3">{plural(itens.length, "item", "itens")}</span>
        <Segmentado
          valor={modo}
          opcoes={[["cartoes", <LayoutGrid key="g" className="size-4" />], ["lista", <List key="l" className="size-4" />]]}
          aoMudar={setModo}
        />
        <Botao className="h-9" onClick={aoNovo}><Plus className="size-4" /> Novo</Botao>
        <MenuSuspenso gatilho={<button aria-label="Mais ações" className="flex size-9 items-center justify-center rounded-xl bg-campo text-texto-2 transition hover:text-texto data-[state=open]:text-texto"><MoreHorizontal className="size-[18px]" /></button>}>
          <ItemMenu icone={Download} texto="Importar planilha" aoClicar={() => toast.success("Importado (exemplo).")} />
          <ItemMenu icone={Upload} texto="Exportar planilha" aoClicar={() => toast.success("Exportado (exemplo).")} />
        </MenuSuspenso>
      </CabecalhoTela>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        {q.isLoading ? (
          <Esqueleto />
        ) : itens.length === 0 ? (
          busca ? (
            <Vazio icone={SearchX} titulo={`Nada encontrado para «${busca}»`} texto="Confira a escrita, ou limpe a busca para ver todos." acao={{ texto: "Limpar busca", aoClicar: () => setBusca("") }} />
          ) : (
            <Vazio icone={SearchX} titulo="Nada em aberto" texto="Todos os itens estão concluídos." acao={{ texto: "Ver todos", aoClicar: () => setFiltro("todos") }} />
          )
        ) : modo === "cartoes" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] items-start gap-3.5">
            {itens.map((i, n) => <Cartao key={i.id} i={i} n={n} aoAbrir={() => setAberto(i)} />)}
          </div>
        ) : (
          <TabelaItens itens={itens} aoAbrir={setAberto} />
        )}
      </div>

      <Ficha item={aberto} aoFechar={() => setAberto(null)} />
    </div>
  );
}

/** CARTÃO: sobe 2 px e ganha sombra no hover; borda pega a cor do acento; foco com anel. */
function Cartao({ i, n, aoAbrir }: { i: Item; n: number; aoAbrir: () => void }) {
  return (
    <motion.div
      {...cascata(n)}
      role="button"
      tabIndex={0}
      onClick={aoAbrir}
      onKeyDown={(e) => e.target === e.currentTarget && e.key === "Enter" && aoAbrir()}
      className="group flex cursor-default flex-col overflow-hidden rounded-cartao border border-borda bg-superficie text-left shadow-cartao outline-none transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-acento/40 hover:shadow-cartao-hover focus-visible:ring-4 focus-visible:ring-acento/20"
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <IconeApp nome={i.nome} tamanho={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold tracking-tight">{i.nome}</p>
            <p className="truncate text-[12px] tabular-nums text-texto-2">{i.codigo} · {i.cidade}</p>
          </div>
          <Selo tom={TOM[i.situacao]}>{ROTULO_SITUACAO[i.situacao]}</Selo>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Dado rotulo="Categoria" valor={i.categoria} />
          <Dado rotulo="Prazo" valor={dataBr(i.prazo)} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11.5px] text-texto-3"><span>Progresso</span><span className="tabular-nums">{i.progresso}%</span></div>
          <BarraPartes partes={[{ valor: i.progresso, cor: COR_SITUACAO[i.situacao] }, { valor: 100 - i.progresso, cor: "transparent" }]} altura={6} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-borda bg-campo/40 px-4 py-2">
        <Pessoas nomes={[i.responsavel, ...i.equipe]} />
        <span className="text-[12px] font-medium tabular-nums text-texto-2">{i.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
      </div>
    </motion.div>
  );
}

/** LISTA: cabeçalho fixo, linhas de 44 px, hover suave, números alinhados à direita. */
function TabelaItens({ itens, aoAbrir }: { itens: Item[]; aoAbrir: (i: Item) => void }) {
  return (
    <div className="overflow-hidden rounded-cartao border border-borda bg-superficie shadow-cartao">
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 bg-superficie/95 backdrop-blur">
          <tr className="border-b border-borda text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-texto-3">
            <th className="px-4 py-2.5">Nome</th>
            <th className="px-3 py-2.5">Responsável</th>
            <th className="px-3 py-2.5">Situação</th>
            <th className="px-3 py-2.5">Prazo</th>
            <th className="px-4 py-2.5 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((i) => (
            <tr key={i.id} onClick={() => aoAbrir(i)} className="h-11 border-b border-borda last:border-0 transition hover:bg-campo">
              <td className="px-4">
                <span className="flex items-center gap-2.5"><IconeApp nome={i.nome} tamanho={26} /><span className="font-medium">{i.nome}</span></span>
              </td>
              <td className="px-3 text-texto-2">{i.responsavel}</td>
              <td className="px-3"><Selo tom={TOM[i.situacao]}>{ROTULO_SITUACAO[i.situacao]}</Selo></td>
              <td className="px-3 tabular-nums text-texto-2">{dataBr(i.prazo)}</td>
              <td className="px-4 text-right tabular-nums">{i.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** FICHA: gaveta com véu na cor do item, dados em grupos, ações fixas no rodapé. */
function Ficha({ item: i, aoFechar }: { item: Item | null; aoFechar: () => void }) {
  return (
    <Gaveta
      aberto={!!i}
      aoFechar={aoFechar}
      titulo={i?.nome ?? ""}
      cor={i ? corPorTexto(i.nome) : undefined}
      cabecalho={i && (
        <div className="flex items-start gap-4 pr-8">
          <IconeApp nome={i.nome} tamanho={60} />
          <div className="min-w-0">
            <p className="text-[18px] font-semibold leading-snug tracking-tight">{i.nome}</p>
            <p className="mt-0.5 text-[13px] tabular-nums text-texto-2">{i.codigo}</p>
            <div className="mt-2 flex gap-1.5"><Selo tom={TOM[i.situacao]}>{ROTULO_SITUACAO[i.situacao]}</Selo><Selo>{i.categoria}</Selo></div>
          </div>
        </div>
      )}
      rodape={
        <>
          <Botao className="flex-1" onClick={() => toast("Aqui abre o formulário de edição.")}><Pencil className="size-4" /> Editar</Botao>
          <Botao
            variante="leve"
            className={cn("text-perigo")}
            onClick={async () => {
              if (await confirmar({ titulo: "Apagar este item?", texto: "Ele sai da lista e não dá para desfazer.", botao: "Apagar" })) {
                toast.success("Apagado (exemplo).");
                aoFechar();
              }
            }}
          >
            <Trash2 className="size-4" /> Apagar
          </Botao>
        </>
      }
    >
      {i && (
        <div className="flex flex-col gap-5">
          <div>
            <TituloGrupo>Dados</TituloGrupo>
            <div className="grid grid-cols-2 gap-1.5">
              <Dado rotulo="Cidade" valor={i.cidade} copiavel />
              <Dado rotulo="Prazo" valor={dataBr(i.prazo)} />
              <Dado rotulo="Contato" valor={i.contato} copiavel />
              <Dado rotulo="Valor" valor={i.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            </div>
          </div>
          <div>
            <TituloGrupo>Equipe</TituloGrupo>
            <Pessoas nomes={[i.responsavel, ...i.equipe]} />
          </div>
          <div>
            <TituloGrupo>Observação</TituloGrupo>
            <p className={cn("rounded-xl bg-campo/60 px-3 py-2.5 text-[13px] leading-relaxed", !i.observacao && "text-texto-3")}>{i.observacao || "Nenhuma."}</p>
          </div>
        </div>
      )}
    </Gaveta>
  );
}
