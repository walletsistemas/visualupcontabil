import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ItemLista<T> = { valor: T; rotulo: string; detalhe?: string };

/**
 * Lista suspensa com o visual do sistema (no lugar do <select> do Windows).
 * `multipla`: dá para marcar mais de um; a lista fica aberta enquanto se marca.
 */
export function Lista<T extends string | number>({
  rotulo,
  itens,
  valor,
  aoMudar,
  multipla = false,
  vazio = "Escolher…",
  semItens = "Nada para escolher.",
  buscavel = false,
  compacto = false,
  classe,
}: {
  rotulo: string;
  itens: ItemLista<T>[];
  valor: T[];
  aoMudar: (v: T[]) => void;
  multipla?: boolean;
  vazio?: string;
  /** o que dizer quando não há nada na lista */
  semItens?: string;
  buscavel?: boolean;
  /** menor (h-9, letra 13px), para formulários densos */
  compacto?: boolean;
  /** classes do bloco todo (ex.: a largura) */
  classe?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const visiveis = busca ? itens.filter((i) => semAcento(i.rotulo).includes(semAcento(busca))) : itens;
  const marcados = itens.filter((i) => valor.includes(i.valor));
  const texto = marcados.length ? marcados.map((i) => i.rotulo).join(", ") : vazio;

  function clicar(v: T) {
    if (!multipla) {
      aoMudar([v]);
      setAberto(false);
      return;
    }
    aoMudar(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", classe)}>
      {rotulo && <span className="text-[13px] font-medium text-texto-2">{rotulo}</span>}
      <Popover.Root open={aberto} onOpenChange={setAberto}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={rotulo ? `${rotulo}: ${texto}` : undefined}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl border border-transparent bg-campo px-3 text-left outline-none transition",
              compacto ? "h-9 text-[13px]" : "h-10 text-[14px]",
              "focus-visible:border-acento/50 focus-visible:ring-4 focus-visible:ring-acento/15",
              aberto && "border-acento/50 ring-4 ring-acento/15",
            )}
          >
            <span className={cn("truncate", marcados.length ? "text-texto" : "text-texto-3")}>{texto}</span>
            <ChevronDown className={cn("size-4 shrink-0 text-texto-3 transition", aberto && "rotate-180")} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-[60] max-h-[280px] min-w-[var(--radix-popover-trigger-width)] max-w-[420px] overflow-y-auto rounded-2xl border border-borda bg-superficie p-1.5 shadow-pop"
          >
            {buscavel && (
              <input
                autoFocus
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Procurar…"
                className="mb-1 h-9 w-full rounded-xl bg-campo px-3 text-[13px] outline-none placeholder:text-texto-3"
              />
            )}
            {visiveis.length === 0 && <p className="px-3 py-2 text-[13px] text-texto-3">{busca ? "Nada para escolher." : semItens}</p>}
            {visiveis.map((i) => {
              const sim = valor.includes(i.valor);
              return (
                <button
                  type="button"
                  key={String(i.valor)}
                  onClick={() => clicar(i.valor)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 text-left transition hover:bg-campo",
                    compacto ? "py-1.5 text-[13px]" : "py-2 text-[14px]",
                    sim ? "text-texto" : "text-texto-2",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center",
                      multipla && "rounded-[5px] border",
                      multipla && (sim ? "border-acento bg-acento text-sobre-acento" : "border-borda"),
                      !multipla && "text-acento",
                    )}
                  >
                    {sim && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 truncate">{i.rotulo}</span>
                  {i.detalhe && <span className="text-[12px] text-texto-3">{i.detalhe}</span>}
                </button>
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

/** A mesma lista para escolher UM valor só (o caso comum no lugar do <select>). */
export function Escolha<T extends string | number>({
  valor,
  aoMudar,
  rotulo = "",
  ...resto
}: Omit<Parameters<typeof Lista<T>>[0], "valor" | "aoMudar" | "multipla" | "rotulo"> & { rotulo?: string; valor: T; aoMudar: (v: T) => void }) {
  return <Lista<T> rotulo={rotulo} {...resto} valor={[valor]} aoMudar={(v) => v.length > 0 && aoMudar(v[0])} />;
}
