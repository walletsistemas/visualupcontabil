import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GRÁFICOS feitos só com CSS (sem biblioteca): seguem o tema claro/escuro sozinhos e são leves.
 * Regra de cor: cada cor (tokens --g-1..--g-7) diz SEMPRE a mesma coisa em todas as telas.
 */

export const pct = (a: number, b: number) => (b ? Math.round((a * 100) / b) : 0);

/**
 * CARTÃO DE GRÁFICO. Anatomia fixa: título · o que mede · legenda · gráfico · leitura.
 * `leitura` é a frase que interpreta o gráfico («o dia mais cheio é…»), sempre no rodapé.
 */
export function Painel({ titulo, mede, legenda, leitura, acao, children, className }: {
  titulo: string;
  mede: string;
  legenda?: ReactNode;
  leitura?: ReactNode;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-cartao border border-borda bg-superficie shadow-cartao", className)}>
      <header className="flex items-start gap-3 px-5 pt-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] font-semibold tracking-tight">{titulo}</h3>
          <p className="mt-0.5 text-[12px] leading-snug text-texto-3">{mede}</p>
        </div>
        {acao}
      </header>
      {legenda && <div className="flex flex-wrap gap-x-3.5 gap-y-1 px-5 pt-2.5">{legenda}</div>}
      <div className="flex flex-1 flex-col px-5 pb-4 pt-3">{children}</div>
      {leitura && <footer className="border-t border-borda px-5 py-2.5 text-[12px] leading-snug text-texto-2">{leitura}</footer>}
    </section>
  );
}

/** Quadradinho de cor + nome (+ número) das legendas. Clicável quando filtra algo. */
export function Chave({ cor, texto, valor, aoClicar }: { cor: string; texto: string; valor?: ReactNode; aoClicar?: () => void }) {
  return (
    <button type="button" disabled={!aoClicar} onClick={aoClicar} className="flex items-center gap-1.5 rounded-md text-[11.5px] text-texto-2 enabled:hover:text-texto">
      <span className="size-2 shrink-0 rounded-[3px]" style={{ background: cor }} />
      {texto}
      {valor != null && <span className="font-medium tabular-nums text-texto">{valor}</span>}
    </button>
  );
}

/** INDICADOR: número grande + a referência que o torna legível («de 90») + o que significa. */
export function Indicador({ cor, rotulo, valor, referencia, explica, alerta, aoClicar }: {
  cor: string;
  rotulo: string;
  valor: ReactNode;
  referencia?: ReactNode;
  explica: string;
  alerta?: boolean;
  aoClicar?: () => void;
}) {
  return (
    <button type="button" disabled={!aoClicar} onClick={aoClicar} className="group flex min-w-0 flex-col gap-1 px-5 py-4 text-left transition enabled:hover:bg-campo">
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-texto-2">
        <span className="size-2 rounded-[3px]" style={{ background: cor }} />
        {rotulo}
        {aoClicar && <ChevronRight className="ml-auto size-3.5 text-texto-3 opacity-0 transition group-hover:opacity-100" />}
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className={cn("text-[28px] font-semibold leading-none tracking-tight tabular-nums", alerta && "text-perigo")}>{valor}</span>
        {referencia && <span className="text-[12.5px] tabular-nums text-texto-3">{referencia}</span>}
      </span>
      <span className="text-[11.5px] leading-snug text-texto-3">{explica}</span>
    </button>
  );
}

/** Faixa de indicadores num cartão só, com divisórias de 1 px (nada de caixinhas soltas). Quantos couberem por linha. */
export function FaixaIndicadores({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px overflow-hidden rounded-cartao border border-borda bg-borda shadow-cartao [&>*]:bg-superficie">
      {children}
    </section>
  );
}

/** Uma barra só, dividida em partes coloridas (com 2 px de vão entre elas). */
export function BarraPartes({ partes, altura = 10 }: { partes: { valor: number; cor: string; nome?: string }[]; altura?: number }) {
  const total = partes.reduce((a, p) => a + p.valor, 0);
  return (
    <div className="flex gap-[2px] overflow-hidden rounded-full bg-campo" style={{ height: altura }}>
      {total > 0 &&
        partes.map((p, i) => p.valor > 0 && (
          <span key={i} title={p.nome ? `${p.nome}: ${p.valor} (${pct(p.valor, total)}%)` : undefined} style={{ flexGrow: p.valor, background: p.cor }} />
        ))}
    </div>
  );
}

/** ROSCA desenhada com conic-gradient, com o número no meio. */
export function Rosca({ partes, centro, centroSub, tamanho = 136 }: { partes: { valor: number; cor: string }[]; centro: string; centroSub: string; tamanho?: number }) {
  const total = partes.reduce((a, p) => a + p.valor, 0) || 1;
  let ac = 0;
  const fatias = partes.map((p) => {
    const ini = (ac / total) * 360;
    ac += p.valor;
    return `${p.cor} ${ini}deg ${(ac / total) * 360}deg`;
  });
  return (
    <div className="relative shrink-0 rounded-full" style={{ width: tamanho, height: tamanho, background: `conic-gradient(${fatias.join(",")})` }}>
      <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-superficie">
        <span className="text-[22px] font-semibold leading-none tabular-nums">{centro}</span>
        <span className="mt-1 text-[10.5px] text-texto-3">{centroSub}</span>
      </div>
    </div>
  );
}

/** BARRAS horizontais: rótulo | barra | número, alinhados em colunas. */
export function Barras({ itens }: {
  itens: { nome: string; detalhe?: string; partes: { valor: number; cor: string }[]; escala: number; valor: ReactNode; aoClicar?: () => void }[];
}) {
  return (
    <ul className="-mx-2 flex flex-col">
      {itens.map((it, i) => {
        const soma = it.partes.reduce((a, p) => a + p.valor, 0);
        return (
          <li key={i}>
            <button type="button" disabled={!it.aoClicar} onClick={it.aoClicar}
              className="grid w-full grid-cols-[minmax(0,38%)_1fr_auto] items-center gap-3 rounded-lg px-2 py-[7px] text-left enabled:hover:bg-campo">
              <span className="min-w-0">
                <span className="block truncate text-[12.5px]">{it.nome}</span>
                {it.detalhe && <span className="block truncate text-[11px] text-texto-3">{it.detalhe}</span>}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-campo">
                <span className="flex h-full gap-[2px]" style={{ width: `${Math.min(100, (soma / (it.escala || 1)) * 100)}%` }}>
                  {it.partes.map((p, j) => p.valor > 0 && <span key={j} className="h-full first:rounded-l-full last:rounded-r-full" style={{ flexGrow: p.valor, background: p.cor }} />)}
                </span>
              </span>
              <span className="w-[72px] text-right text-[12px] tabular-nums text-texto-2">{it.valor}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** COLUNAS lado a lado, empilhadas por cor. `fundo` marca uma coluna (fim de semana, mês atual). */
export function Colunas({ colunas, altura = 132 }: {
  colunas: { rotulo: string; partes: { valor: number; cor: string; nome: string }[]; fundo?: boolean; destaque?: boolean }[];
  altura?: number;
}) {
  const mx = Math.max(1, ...colunas.map((c) => c.partes.reduce((a, p) => a + p.valor, 0)));
  return (
    <div className="flex items-end gap-1.5">
      {colunas.map((c, i) => {
        const soma = c.partes.reduce((a, p) => a + p.valor, 0);
        return (
          <div key={i} title={[c.rotulo, ...c.partes.map((p) => `${p.nome}: ${p.valor}`)].join("\n")}
            className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-0.5 pb-1 pt-1.5 hover:bg-campo", c.fundo && "bg-campo/40")}>
            <span className="h-4 text-[11px] font-medium tabular-nums text-texto-2">{soma || ""}</span>
            <span className="flex w-full max-w-[34px] flex-col-reverse overflow-hidden rounded-[6px]" style={{ height: altura }}>
              {soma === 0 && <span className="h-[3px] rounded-full bg-campo" />}
              {c.partes.map((p, j) => p.valor > 0 && (
                <span key={j} className="w-full border-t border-superficie first:border-t-0" style={{ height: `${(p.valor / mx) * 100}%`, background: p.cor }} />
              ))}
            </span>
            <span className={cn("text-[10.5px] leading-tight tabular-nums text-texto-3", c.destaque && "font-semibold text-texto")}>{c.rotulo}</span>
          </div>
        );
      })}
    </div>
  );
}
