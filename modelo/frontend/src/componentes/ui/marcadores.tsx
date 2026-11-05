import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOLA_RAPIDA } from "@/tema/movimento";

/** Caixa de marcar (18 px, cantos de 6 px, enche de acento). */
export function CaixaSelecao({ rotulo, marcado, aoMudar, className }: {
  rotulo: string;
  marcado: boolean;
  aoMudar: (v: boolean) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2 text-[13px] text-texto-2", className)}>
      <CheckboxPrimitive.Root
        checked={marcado}
        onCheckedChange={(v) => aoMudar(v === true)}
        className={cn(
          "flex size-[18px] items-center justify-center rounded-[6px] border border-borda bg-superficie transition-all",
          "data-[state=checked]:border-acento data-[state=checked]:bg-acento focus-visible:ring-4 focus-visible:ring-acento/20",
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-3 text-sobre-acento" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {rotulo}
    </label>
  );
}

/** Interruptor liga/desliga (estilo iOS), para preferências. */
export function Interruptor({ ligado, aoMudar, rotulo }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => aoMudar(!ligado)}
      className="flex items-center gap-2.5 text-[13.5px] text-texto"
    >
      <span className={cn("flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-0.5 transition", ligado ? "bg-acento" : "bg-borda")}>
        <span className={cn("size-[14px] rounded-full bg-white shadow transition", ligado && "translate-x-3")} />
      </span>
      {rotulo}
    </button>
  );
}

/**
 * Controle segmentado (estilo macOS): a pílula branca DESLIZA até a opção escolhida.
 * Para 2–4 opções exclusivas (Ativos/Inativos, Cartões/Lista).
 */
export function Segmentado<T extends string>({ valor, opcoes, aoMudar }: {
  valor: T;
  opcoes: [T, React.ReactNode][];
  aoMudar: (v: T) => void;
}) {
  const grupo = opcoes.map((o) => o[0]).join();
  return (
    <div className="flex h-9 items-center rounded-xl bg-campo p-0.5">
      {opcoes.map(([v, rot]) => (
        <button
          key={v}
          type="button"
          onClick={() => aoMudar(v)}
          className={cn(
            "relative flex h-8 items-center justify-center rounded-[10px] px-3 text-[13px] font-medium transition-colors",
            valor === v ? "text-texto" : "text-texto-3 hover:text-texto-2",
          )}
        >
          {valor === v && (
            <motion.span layoutId={`seg-${grupo}`} className="absolute inset-0 rounded-[10px] bg-superficie shadow-sm" transition={MOLA_RAPIDA} />
          )}
          <span className="relative">{rot}</span>
        </button>
      ))}
    </div>
  );
}
