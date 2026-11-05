import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import { CampoBusca } from "@/componentes/ui/campo";
import { Selo } from "@/componentes/ui/pecas";
import { ITENS, ROTULO_SITUACAO, type Item } from "@/dados/exemplo";
import { cn, semAcento } from "@/lib/utils";

// 600 linhas inventadas: mostra que a tabela continua leve com muita coisa (só desenha o que aparece)
const LINHAS = Array.from({ length: 600 }, (_, n) => ({ ...ITENS[n % ITENS.length], id: n + 1, valor: ITENS[n % ITENS.length].valor + n * 13 }));
type Coluna = { campo: keyof Item; nome: string; largura: string; direita?: boolean };
const COLUNAS: Coluna[] = [
  { campo: "id", nome: "Nº", largura: "w-16", direita: true },
  { campo: "nome", nome: "Nome", largura: "flex-1 min-w-[180px]" },
  { campo: "categoria", nome: "Categoria", largura: "w-32" },
  { campo: "responsavel", nome: "Responsável", largura: "w-40" },
  { campo: "situacao", nome: "Situação", largura: "w-36" },
  { campo: "prazo", nome: "Prazo", largura: "w-28" },
  { campo: "valor", nome: "Valor", largura: "w-32", direita: true },
];

/**
 * TABELA DENSA estilo planilha: linhas de 32 px em ZEBRA, cabeçalho fixo que ordena ao clicar,
 * linha marcada em acento, números em `tabular-nums` à direita. Virtualizada (TanStack Virtual).
 */
export function Tabela() {
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<{ campo: keyof Item; desc: boolean }>({ campo: "id", desc: false });
  const [marcada, setMarcada] = useState<number | null>(null);
  const caixa = useRef<HTMLDivElement>(null);

  const linhas = useMemo(() => {
    const f = busca ? LINHAS.filter((l) => semAcento(`${l.nome} ${l.responsavel}`).includes(semAcento(busca))) : LINHAS;
    return [...f].sort((a, b) => {
      const x = a[ordem.campo], y = b[ordem.campo];
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR");
      return ordem.desc ? -r : r;
    });
  }, [busca, ordem]);

  const virtual = useVirtualizer({ count: linhas.length, getScrollElement: () => caixa.current, estimateSize: () => 32, overscan: 12 });
  const total = linhas.reduce((a, l) => a + l.valor, 0);

  return (
    <div className="flex h-full flex-col">
      <CabecalhoTela titulo="Tabela" subtitulo="Muitas linhas, leitura rápida. Clique no cabeçalho para ordenar.">
        <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Filtrar por nome ou responsável…" className="max-w-md" />
        <span className="px-1 text-[12.5px] tabular-nums text-texto-3">{linhas.length} linhas</span>
      </CabecalhoTela>

      <div className="mx-6 mb-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-cartao border border-borda bg-superficie shadow-cartao">
        <div className="flex h-9 shrink-0 items-center border-b border-borda bg-campo/50 text-[11px] font-semibold uppercase tracking-[0.06em] text-texto-3">
          {COLUNAS.map((c) => (
            <button
              key={c.campo}
              onClick={() => setOrdem((o) => ({ campo: c.campo, desc: o.campo === c.campo ? !o.desc : false }))}
              className={cn("flex h-full items-center gap-1 px-3 hover:text-texto", c.largura, c.direita && "justify-end")}
            >
              {c.nome}
              {ordem.campo === c.campo && (ordem.desc ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />)}
            </button>
          ))}
        </div>
        <div ref={caixa} className="min-h-0 flex-1 overflow-auto">
          <div className="relative" style={{ height: virtual.getTotalSize() }}>
            {virtual.getVirtualItems().map((v) => {
              const l = linhas[v.index];
              const sel = marcada === l.id;
              return (
                <div
                  key={l.id}
                  onClick={() => setMarcada(sel ? null : l.id)}
                  className={cn(
                    "absolute inset-x-0 flex items-center text-[13px]",
                    v.index % 2 ? "bg-zebra" : "",
                    sel ? "bg-acento/15 shadow-[inset_3px_0_0_var(--acento)]" : "hover:bg-campo",
                  )}
                  style={{ top: v.start, height: v.size }}
                >
                  <span className={cn("w-16 px-3 text-right tabular-nums text-texto-3")}>{l.id}</span>
                  <span className="min-w-[180px] flex-1 truncate px-3 font-medium">{l.nome}</span>
                  <span className="w-32 truncate px-3 text-texto-2">{l.categoria}</span>
                  <span className="w-40 truncate px-3 text-texto-2">{l.responsavel}</span>
                  <span className="w-36 px-3"><Selo tom={l.situacao === "atrasado" ? "perigo" : l.situacao === "concluido" ? "acento" : "neutro"} className="h-5">{ROTULO_SITUACAO[l.situacao]}</Selo></span>
                  <span className="w-28 px-3 tabular-nums text-texto-2">{l.prazo.split("-").reverse().join("/")}</span>
                  <span className="w-32 px-3 text-right tabular-nums">{l.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex h-9 shrink-0 items-center justify-end gap-2 border-t border-borda bg-campo/50 px-3 text-[12.5px]">
          <span className="text-texto-3">Total</span>
          <span className="w-32 text-right font-semibold tabular-nums">{total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
