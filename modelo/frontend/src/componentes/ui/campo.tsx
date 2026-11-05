import * as React from "react";
import { Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  icone?: LucideIcon;
  realce?: boolean;
  erro?: boolean;
  /** algo no fim do campo (ex.: o olho de mostrar a senha) */
  fim?: React.ReactNode;
};

/** Campo GRANDE (48 px) com ícone: telas de entrada e destaques. Fundo suave, foco com anel. */
export const Campo = React.forwardRef<HTMLInputElement, Props>(
  ({ className, icone: Icone, realce, erro, fim, ...props }, ref) => (
    <div
      className={cn(
        "group flex h-12 items-center gap-3 rounded-2xl border bg-campo px-4 transition-all duration-200",
        "border-transparent focus-within:border-acento/50 focus-within:bg-superficie",
        "focus-within:ring-4 focus-within:ring-acento/15",
        realce && "border-acento/40",
        erro && "border-perigo/50 ring-4 ring-perigo/10",
        className,
      )}
    >
      {Icone && (
        <Icone
          className={cn("size-[18px] shrink-0 text-texto-3 transition-colors group-focus-within:text-acento", realce && "text-acento")}
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

/** Campo de FORMULÁRIO (40 px) com rótulo em cima e dica embaixo. */
export const CampoRotulado = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { rotulo: string; dica?: string; erro?: string }
>(({ rotulo, dica, erro, className, id, ...props }, ref) => {
  const auto = React.useId();
  const campo = id ?? auto;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={campo} className="text-[13px] font-medium text-texto-2">{rotulo}</label>
      <input
        id={campo}
        ref={ref}
        aria-invalid={!!erro}
        className={cn(
          "h-10 rounded-xl border border-transparent bg-campo px-3 text-[14px] text-texto outline-none transition-all",
          "placeholder:text-texto-3 focus:border-acento/50 focus:bg-superficie focus:ring-4 focus:ring-acento/15",
          "read-only:opacity-60",
          erro && "border-perigo/50 ring-4 ring-perigo/10 focus:border-perigo/60 focus:ring-perigo/15",
          className,
        )}
        {...props}
      />
      {erro ?<span className="text-[12px] text-perigo">{erro}</span> : dica && <span className="text-[12px] text-texto-3">{dica}</span>}
    </div>
  );
});
CampoRotulado.displayName = "CampoRotulado";

/** Texto longo, mesmo visual do CampoRotulado. */
export const AreaTexto = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rotulo: string }>(
  ({ rotulo, className, id, ...props }, ref) => {
    const auto = React.useId();
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id ?? auto} className="text-[13px] font-medium text-texto-2">{rotulo}</label>
        <textarea
          id={id ?? auto}
          ref={ref}
          className={cn(
            "min-h-24 resize-y rounded-xl border border-transparent bg-campo px-3 py-2.5 text-[14px] leading-relaxed text-texto outline-none transition-all",
            "placeholder:text-texto-3 focus:border-acento/50 focus:bg-superficie focus:ring-4 focus:ring-acento/15",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
AreaTexto.displayName = "AreaTexto";

/** Busca da barra de ferramentas (36 px): lupa à esquerda, X para limpar. */
export function CampoBusca({ valor, aoMudar, placeholder = "Buscar…", className }: {
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-[200px] flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-texto-3" />
      <input
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-transparent bg-campo pl-9 pr-8 text-[13.5px] outline-none transition placeholder:text-texto-3 focus:border-acento/40 focus:bg-superficie focus:ring-4 focus:ring-acento/10"
      />
      {valor && (
        <button type="button" aria-label="Limpar busca" onClick={() => aoMudar("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-texto-3 hover:text-texto">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
