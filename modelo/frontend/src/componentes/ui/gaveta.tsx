import * as React from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GAVETA lateral = a FICHA (padrão do Plus: ficha da empresa, rotas/empresas/FichaEmpresa.tsx).
 * Desliza da direita, flutuando a 8 px das bordas, cantos de 24 px, véu na cor do item no topo,
 * corpo que rola e ações fixas embaixo. Arrastar para a direita também fecha (Vaul).
 */
export function Gaveta({ aberto, aoFechar, titulo, cabecalho, rodape, children, cor }: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  /** o topo (ícone grande, nome, selos); com ele, o título fica só para leitor de tela */
  cabecalho?: React.ReactNode;
  /** ações fixas embaixo */
  rodape?: React.ReactNode;
  children: React.ReactNode;
  /** cor do véu no topo: hex (corPorTexto) ou var(--...) */
  cor?: string;
}) {
  return (
    <Drawer.Root open={aberto} onOpenChange={(v) => !v && aoFechar()} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-2 right-2 top-2 z-50 flex w-[460px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[24px] border border-borda bg-superficie shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] outline-none"
        >
          <div
            className="relative border-b border-borda px-6 pb-5 pt-6"
            style={cor ? { background: `linear-gradient(180deg, color-mix(in srgb, ${cor} 13%, transparent) 0%, transparent 100%)` } : undefined}
          >
            {cabecalho}
            <Drawer.Title className={cn("text-[18px] font-semibold leading-snug tracking-tight", cabecalho && "sr-only")}>{titulo}</Drawer.Title>
            <button type="button" onClick={aoFechar} aria-label="Fechar" className="absolute right-4 top-4 rounded-full p-1.5 text-texto-3 transition hover:bg-campo hover:text-texto">
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {rodape && <div className="flex gap-2 border-t border-borda px-6 py-4">{rodape}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
