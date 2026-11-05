import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOLA_SEGMENTO } from "@/tema/movimento";

/**
 * CONTROLE SEGMENTADO (padrão do Plus: Empresas «Ativas/Inativadas» e «cartões/lista»).
 * A pílula branca DESLIZA até a opção escolhida. Para 2–4 opções exclusivas.
 * No Plus ele mora dentro de rotas/empresas/TelaEmpresas.tsx; aqui virou peça compartilhada.
 */
export function Segmentado<T extends string>({ valor, opcoes, aoMudar }: {
  valor: T;
  opcoes: [T, React.ReactNode][];
  aoMudar: (v: T) => void;
}) {
  const grupo = useId(); // cada Segmentado tem a sua pílula (dois na mesma tela não se misturam)
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
          {valor === v && <motion.span layoutId={`seg-${grupo}`} className="absolute inset-0 rounded-[10px] bg-superficie shadow-sm" transition={MOLA_SEGMENTO} />}
          <span className="relative">{rot}</span>
        </button>
      ))}
    </div>
  );
}
