import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { MESES_CURTOS, mesPorExtenso } from "@/lib/datas";
import { cn } from "@/lib/utils";

/** Grade de meses (4 × 3), como um calendário compacto. */
export function GradeMeses({ valor, aoEscolher }: { valor: string; aoEscolher: (c: string) => void }) {
  const [ano, setAno] = useState(Number(valor.slice(0, 4)));
  return (
    <div className="w-[264px]">
      <div className="mb-2 flex items-center justify-between">
        <button aria-label="Ano anterior" onClick={() => setAno((a) => a - 1)} className="rounded-lg p-1.5 text-texto-2 hover:bg-campo">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-[14px] font-semibold">{ano}</span>
        <button aria-label="Próximo ano" onClick={() => setAno((a) => a + 1)} className="rounded-lg p-1.5 text-texto-2 hover:bg-campo">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {MESES_CURTOS.map((m, i) => {
          const c = `${ano}-${String(i + 1).padStart(2, "0")}`;
          const sel = c === valor;
          return (
            <button
              key={m}
              onClick={() => aoEscolher(c)}
              className={cn("h-9 rounded-lg text-[13px] capitalize transition", sel ? "bg-acento font-semibold text-sobre-acento" : "text-texto hover:bg-campo")}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * O botão de mês da barra de ferramentas. Acento = o mês de agora; âmbar = outro mês
 * (só um aviso visual, nada fica bloqueado).
 */
export function SeletorMes({ valor, atual, aoMudar }: { valor: string; atual: string; aoMudar: (c: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const agora = valor === atual;
  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger asChild>
        <button
          title={agora ? "Mês atual" : `Fora do mês atual (${mesPorExtenso(atual)})`}
          className={cn(
            "flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-semibold transition",
            agora
              ? "border-acento/30 bg-acento/10 text-acento-texto hover:bg-acento/15"
              : "border-alerta/40 bg-alerta/10 text-alerta hover:bg-alerta/15",
          )}
        >
          <CalendarRange className="size-4" />
          {mesPorExtenso(valor)}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} className="z-50 rounded-2xl border border-borda bg-superficie p-3 shadow-pop">
          <GradeMeses
            valor={valor}
            aoEscolher={(c) => {
              aoMudar(c);
              setAberto(false);
            }}
          />
          {!agora && (
            <button
              onClick={() => {
                aoMudar(atual);
                setAberto(false);
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-[12.5px] font-medium text-acento-texto hover:bg-campo"
            >
              Voltar para {mesPorExtenso(atual)}
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
