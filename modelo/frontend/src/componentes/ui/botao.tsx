import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variantes = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all " +
    "duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-default " +
    "focus-visible:ring-4 focus-visible:ring-verde/25",
  {
    variants: {
      variante: {
        primario: "bg-primario text-primario-texto shadow-sm hover:brightness-110",
        verde: "bg-verde text-white shadow-sm hover:brightness-105",
        leve: "bg-campo text-texto hover:bg-borda",
        fantasma: "text-texto-2 hover:bg-campo hover:text-texto",
        link: "text-verde-texto hover:underline px-0 h-auto",
      },
      tamanho: {
        p: "h-8 px-3 text-[13px] rounded-lg",
        m: "h-10 px-4 text-sm rounded-xl",
        g: "h-12 px-5 text-[15px] rounded-2xl",
        icone: "size-9 rounded-full",
      },
    },
    defaultVariants: { variante: "primario", tamanho: "m" },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variantes> & { asChild?: boolean; carregando?: boolean };

export const Botao = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variante, tamanho, asChild, carregando, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(variantes({ variante, tamanho }), className)}
        disabled={disabled || carregando}
        {...props}
      >
        {carregando && <Loader2 className="size-4 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Botao.displayName = "Botao";
