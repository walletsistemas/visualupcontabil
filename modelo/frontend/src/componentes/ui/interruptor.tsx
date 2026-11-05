import { cn } from "@/lib/utils";

/**
 * INTERRUPTOR liga/desliga (padrão do Plus: menu da conta → Preferências).
 * No Plus ele está dentro do ItemConta do MenuLateral; aqui virou peça compartilhada.
 */
export function Interruptor({ ligado, aoMudar, rotulo }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo?: string }) {
  return (
    <button type="button" role="switch" aria-checked={ligado} aria-label={rotulo} onClick={() => aoMudar(!ligado)} className="flex items-center gap-2.5 text-[13.5px] text-texto">
      <span className={cn("flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-0.5 transition", ligado ? "bg-verde" : "bg-borda")}>
        <span className={cn("size-[14px] rounded-full bg-white shadow transition", ligado && "translate-x-3")} />
      </span>
      {rotulo}
    </button>
  );
}
