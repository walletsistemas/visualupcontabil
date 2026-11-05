import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { MESES_CURTOS, compPorExtenso } from "@/lib/competencia";
import { cn } from "@/lib/utils";

/** Grade de meses, como um calendário compacto. Usada no botão de competência e em «a partir de…». */
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
              className={cn(
                "h-9 rounded-lg text-[13px] capitalize transition",
                sel ? "bg-verde font-semibold text-white" : "text-texto hover:bg-campo",
              )}
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
 * O botão de competência do topo das telas. Verde = mês de trabalho de agora;
 * âmbar = outro mês (só um aviso, nada fica bloqueado — como no sistema antigo).
 */
export function SeletorCompetencia({
  valor,
  atual,
  aoMudar,
}: {
  valor: string;
  atual: string;
  aoMudar: (c: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const noMesDeAgora = valor === atual;
  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger asChild>
        <button
          title={
            noMesDeAgora
              ? "Você está na competência do trabalho de agora."
              : `Você NÃO está na competência de agora (${compPorExtenso(atual)}). Nada está bloqueado — é só um aviso.`
          }
          className={cn(
            "flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-semibold transition",
            noMesDeAgora
              ? "border-verde/30 bg-verde/10 text-verde-texto hover:bg-verde/15"
              : "border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300",
          )}
        >
          <Clock className="size-4" />
          {compPorExtenso(valor)}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-2xl border border-borda bg-superficie p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] data-[state=open]:animate-in"
        >
          <GradeMeses
            valor={valor}
            aoEscolher={(c) => {
              aoMudar(c);
              setAberto(false);
            }}
          />
          {!noMesDeAgora && (
            <button
              onClick={() => {
                aoMudar(atual);
                setAberto(false);
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-[12.5px] font-medium text-verde-texto hover:bg-campo"
            >
              Voltar para {compPorExtenso(atual)}
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
