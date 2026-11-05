import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaixaSelecao({
  rotulo,
  marcado,
  aoMudar,
  className,
}: {
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
          "data-[state=checked]:border-verde data-[state=checked]:bg-verde focus-visible:ring-4 focus-visible:ring-verde/20",
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-3 text-white" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {rotulo}
    </label>
  );
}
