import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  icone?: LucideIcon;
  realce?: boolean;
  erro?: boolean;
  /** algo no fim do campo (ex.: o olho de mostrar a senha) */
  fim?: React.ReactNode;
};

/** Campo de texto no estilo macOS: fundo suave, cantos arredondados, foco com anel. */
export const Campo = React.forwardRef<HTMLInputElement, Props>(
  ({ className, icone: Icone, realce, erro, fim, ...props }, ref) => (
    <div
      className={cn(
        "group flex h-12 items-center gap-3 rounded-2xl border bg-campo px-4 transition-all duration-200",
        "border-transparent focus-within:border-verde/50 focus-within:bg-superficie",
        "focus-within:ring-4 focus-within:ring-verde/15",
        realce && "border-verde/40",
        erro && "border-vermelho/50 ring-4 ring-vermelho/10",
        className,
      )}
    >
      {Icone && (
        <Icone
          className={cn(
            "size-[18px] shrink-0 text-texto-3 transition-colors group-focus-within:text-verde",
            realce && "text-verde",
          )}
          strokeWidth={1.75}
        />
      )}
      <input
        ref={ref}
        className="h-full w-full bg-transparent text-[15px] text-texto outline-none placeholder:text-texto-3"
        {...props}
      />
      {fim}
    </div>
  ),
);
Campo.displayName = "Campo";

/** Campo simples (sem ícone) com rótulo em cima, para formulários. */
export const CampoRotulado = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { rotulo: string; dica?: string }
>(({ rotulo, dica, className, id, ...props }, ref) => {
  const auto = React.useId();
  const campo = id ?? auto;
  return (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={campo} className="text-[13px] font-medium text-texto-2">{rotulo}</label>
    <input
      id={campo}
      aria-label={rotulo ? undefined : props.placeholder}
      ref={ref}
      className={cn(
        "h-10 rounded-xl border border-transparent bg-campo px-3 text-[14px] text-texto outline-none transition-all",
        "placeholder:text-texto-3 focus:border-verde/50 focus:bg-superficie focus:ring-4 focus:ring-verde/15",
        "read-only:opacity-60",
        className,
      )}
      {...props}
    />
    {dica && <span className="text-[12px] text-texto-3">{dica}</span>}
  </div>
  );
});
CampoRotulado.displayName = "CampoRotulado";
