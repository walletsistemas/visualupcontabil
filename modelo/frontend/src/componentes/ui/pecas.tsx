import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Copy, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { copiarTexto } from "@/lib/avisos";
import { cn, corPorTexto, iniciais } from "@/lib/utils";
import { Botao } from "./botao";

/** SELO (pílula de status): fundo da cor a 12% + texto na cor. */
export function Selo({ children, tom = "neutro", className }: {
  children: ReactNode;
  tom?: "neutro" | "acento" | "alerta" | "perigo";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-medium whitespace-nowrap",
        tom === "neutro" && "bg-campo text-texto-2",
        tom === "acento" && "bg-acento/12 text-acento-texto",
        tom === "alerta" && "bg-alerta/12 text-alerta",
        tom === "perigo" && "bg-perigo/12 text-perigo",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** AVATAR redondo: foto ou iniciais numa cor fixa por nome. `anel` para empilhar (-space-x-1). */
export function Avatar({ nome, foto, tamanho = 32, anel, className }: {
  nome: string;
  foto?: string;
  tamanho?: number;
  anel?: boolean;
  className?: string;
}) {
  return (
    <span
      title={nome}
      className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white", anel && "ring-2 ring-superficie", className)}
      style={{ width: tamanho, height: tamanho, fontSize: Math.max(8, tamanho * 0.36), background: corPorTexto(nome) }}
    >
      {foto ? <img src={foto} alt="" className="size-full object-cover" /> : tamanho < 22 ? nome.trim()[0]?.toUpperCase() : iniciais(nome)}
    </span>
  );
}

/** Pessoas empilhadas (até 3) + o nome do primeiro. */
export function Pessoas({ nomes }: { nomes: string[] }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex -space-x-1.5">{nomes.slice(0, 3).map((n) => <Avatar key={n} nome={n} tamanho={22} anel />)}</span>
      <span className="truncate text-[12.5px] text-texto-2" title={nomes.join(", ")}>
        {nomes[0]?.split(" ")[0]}{nomes.length > 1 && ` +${nomes.length - 1}`}
      </span>
    </span>
  );
}

/** ÍCONE DE APP: quadrado de cantos 28% com iniciais (identidade visual de cada item da lista). */
export function IconeApp({ nome, tamanho = 44, cor }: { nome: string; tamanho?: number; cor?: string }) {
  const p = nome.toUpperCase().split(/\s+/).filter((x) => x.length > 2 || /\d/.test(x));
  const letras = p.length > 1 ? p[0][0] + p[1][0] : (p[0] ?? nome).slice(0, 2).toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center font-semibold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]"
      style={{ width: tamanho, height: tamanho, borderRadius: tamanho * 0.28, fontSize: tamanho * 0.36, background: cor ?? corPorTexto(nome) }}
    >
      {letras}
    </div>
  );
}

/** Rótulo pequeno em CAIXA ALTA em cima, valor embaixo (fichas). Vazio vira «—». */
export function Dado({ rotulo, valor, copiavel }: { rotulo: string; valor: string; copiavel?: boolean }) {
  const vazio = !valor.trim();
  return (
    <div className="group/item min-w-0 rounded-lg bg-campo/60 px-2.5 py-1.5">
      <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.06em] text-texto-3">{rotulo}</p>
      <div className="flex h-5 min-w-0 items-center gap-1.5">
        <p className={cn("truncate text-[13px]", vazio ? "text-texto-3" : "text-texto")}>{vazio ? "—" : valor}</p>
        {copiavel && !vazio && <BotaoCopiar texto={valor} />}
      </div>
    </div>
  );
}

/** Copiar que aparece só ao passar o mouse sobre o dado (grupo `group/item`). */
export function BotaoCopiar({ texto }: { texto: string }) {
  return (
    <button
      type="button"
      title="Copiar"
      onClick={(e) => {
        e.stopPropagation();
        copiarTexto(texto);
      }}
      className="flex size-5 shrink-0 items-center justify-center rounded-md text-texto-3 opacity-0 transition hover:bg-superficie hover:text-acento-texto group-hover/item:opacity-100"
    >
      <Copy className="size-3" />
    </button>
  );
}

/** Título de grupo dentro de fichas e menus: 10 px, caixa alta, espaçado. */
export function TituloGrupo({ children }: { children: ReactNode }) {
  return <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-texto-3">{children}</p>;
}

/** DICA (tooltip) escura, com setinha. */
export function Dica({ texto, lado = "top", children }: { texto: string; lado?: "top" | "right" | "bottom" | "left"; children: React.ReactElement }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={lado} sideOffset={8} className="z-50 rounded-lg bg-texto px-2.5 py-1.5 text-[12.5px] font-medium text-superficie shadow-pop">
          {texto}
          <Tooltip.Arrow className="fill-texto" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** MENU SUSPENSO (os «…» da barra): caixa flutuante com itens de ícone + texto. */
export function MenuSuspenso({ gatilho, children, alinhar = "end" }: { gatilho: React.ReactElement; children: ReactNode; alinhar?: "start" | "end" }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{gatilho}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align={alinhar} sideOffset={8} className="z-50 w-56 rounded-2xl border border-borda bg-superficie p-1.5 text-texto shadow-pop">
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function ItemMenu({ icone: Icone, texto, perigo, aoClicar }: { icone: LucideIcon; texto: string; perigo?: boolean; aoClicar: () => void }) {
  return (
    <Popover.Close asChild>
      <button type="button" onClick={aoClicar} className={cn("flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-left text-[13.5px] transition hover:bg-campo", perigo && "text-perigo")}>
        <Icone className={cn("size-4 shrink-0", perigo ? "text-perigo" : "text-texto-2")} />
        {texto}
      </button>
    </Popover.Close>
  );
}

export const Divisoria = () => <div className="my-1 h-px bg-borda" />;

// ---------------------------------------------------------------- estados da tela

/** VAZIO: ícone fino grande + frase em negrito + explicação + (opcional) a ação que resolve. */
export function Vazio({ icone: Icone, titulo, texto, acao }: { icone: LucideIcon; titulo: string; texto: string; acao?: { texto: string; aoClicar: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icone className="size-10 text-texto-3" strokeWidth={1.4} />
      <p className="mt-4 text-[16px] font-semibold">{titulo}</p>
      <p className="mt-1 max-w-sm text-[13px] text-texto-2">{texto}</p>
      {acao && (
        <Botao variante="leve" tamanho="p" className="mt-4" onClick={acao.aoClicar}>
          {acao.texto}
        </Botao>
      )}
    </div>
  );
}

/**
 * ESQUELETO: blocos pulsando no formato do que vai chegar (nunca um giro solto no meio da tela).
 * forma "cartoes" = grade de cartões · "linhas" = lista/tabela (linhas de `altura` px).
 */
export function Esqueleto({ quantos = 6, altura = 180, forma = "cartoes", className }: { quantos?: number; altura?: number; forma?: "cartoes" | "linhas"; className?: string }) {
  if (forma === "linhas")
    return (
      <div className={cn("overflow-hidden rounded-cartao border border-borda bg-superficie", className)}>
        {Array.from({ length: quantos }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-borda px-4 last:border-0" style={{ height: altura }}>
            <div className="size-6 animate-pulse rounded-lg bg-campo" />
            <div className="h-3 flex-1 animate-pulse rounded-full bg-campo" style={{ maxWidth: `${40 + ((i * 17) % 35)}%` }} />
            <div className="h-3 w-16 animate-pulse rounded-full bg-campo" />
          </div>
        ))}
      </div>
    );
  return (
    <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3.5", className)}>
      {Array.from({ length: quantos }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-cartao bg-campo" style={{ height: altura }} />
      ))}
    </div>
  );
}

/** Barra fina «indo e vindo» (trabalho sem saber quanto falta). */
export function BarraOcupada({ className }: { className?: string }) {
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-campo", className)}>
      <div className="h-full w-1/3 rounded-full bg-acento" style={{ animation: "deslizar 1.2s ease-in-out infinite" }} />
    </div>
  );
}

/** Erro no fim do formulário: rola até ele e repete num balão. */
export function AvisoErro({ texto, className }: { texto: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!texto) return;
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    toast.error(texto);
  }, [texto]);
  if (!texto) return null;
  return <p ref={ref} role="alert" className={cn("rounded-xl bg-perigo/10 px-3 py-2 text-[13px] text-perigo", className)}>{texto}</p>;
}

/** true enquanto a janela tiver menos que `limite` px de largura. */
export function useJanelaEstreita(limite: number) {
  const [estreita, setEstreita] = useState(() => window.innerWidth < limite);
  useEffect(() => {
    const ver = () => setEstreita(window.innerWidth < limite);
    window.addEventListener("resize", ver);
    return () => window.removeEventListener("resize", ver);
  }, [limite]);
  return estreita;
}
