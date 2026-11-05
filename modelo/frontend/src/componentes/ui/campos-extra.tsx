import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Campos do padrão que no Plus estão escritos dentro das telas (mesmas classes):
 * CampoBusca = a busca da barra de ferramentas (rotas/empresas/TelaEmpresas.tsx);
 * AreaTexto = texto longo com o visual do CampoRotulado (componentes/ui/campo.tsx).
 */
export function CampoBusca({ valor, aoMudar, placeholder = "Buscar…", className }: {
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-[240px] flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-texto-3" />
      <input
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-transparent bg-campo pl-9 pr-8 text-[13.5px] outline-none transition focus:border-verde/40 focus:bg-superficie focus:ring-4 focus:ring-verde/10"
      />
      {valor && (
        <button type="button" aria-label="Limpar busca" onClick={() => aoMudar("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-texto-3 hover:text-texto">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

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
            "placeholder:text-texto-3 focus:border-verde/50 focus:bg-superficie focus:ring-4 focus:ring-verde/15",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
AreaTexto.displayName = "AreaTexto";
