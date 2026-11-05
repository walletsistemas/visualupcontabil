import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Erro no fim do formulário: rola até ele e repete num toast, para não parecer que «Salvar» não fez nada. */
export function AvisoErro({ texto, className }: { texto: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!texto) return;
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    toast.error(texto);
  }, [texto]);
  if (!texto) return null;
  return <p ref={ref} role="alert" className={cn("rounded-xl bg-vermelho/10 px-3 py-2 text-[13px] text-vermelho", className)}>{texto}</p>;
}
