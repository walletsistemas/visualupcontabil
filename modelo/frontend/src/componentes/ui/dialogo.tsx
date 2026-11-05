import * as React from "react";
import * as D from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOLA_JANELA } from "@/tema/movimento";
import { Botao } from "./botao";

/**
 * JANELA por cima da tela, no estilo das folhas do macOS: o fundo escurece e desfoca,
 * a janela entra crescendo de 94% com mola. Esc ou clique fora fecham.
 */
export function Dialogo({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  largura = "max-w-md",
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: React.ReactNode;
  children: React.ReactNode;
  largura?: string;
}) {
  return (
    <D.Root open={aberto} onOpenChange={(v) => !v && aoFechar()}>
      <AnimatePresence>
        {aberto && (
          <D.Portal forceMount>
            <D.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </D.Overlay>
            <D.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] rounded-janela border border-borda",
                  "max-h-[calc(100vh-32px)] overflow-y-auto bg-superficie p-7 shadow-janela",
                  largura,
                )}
                initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-48%" }}
                transition={MOLA_JANELA}
              >
                <D.Close className="absolute right-4 top-4 rounded-full p-1.5 text-texto-3 transition hover:bg-campo hover:text-texto">
                  <X className="size-4" />
                </D.Close>
                <D.Title className="pr-8 text-[19px] font-semibold tracking-tight text-texto">{titulo}</D.Title>
                {descricao && (
                  <D.Description asChild>
                    <div className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-texto-2">{descricao}</div>
                  </D.Description>
                )}
                <div className="mt-5">{children}</div>
              </motion.div>
            </D.Content>
          </D.Portal>
        )}
      </AnimatePresence>
    </D.Root>
  );
}

/** Pergunta sim/não. O botão "sim" fica vermelho quando a ação é perigosa (apagar). */
export function Confirmacao({
  aberto,
  titulo,
  texto,
  sim,
  nao = "Cancelar",
  perigoso,
  aoResponder,
}: {
  aberto: boolean;
  titulo: string;
  texto: React.ReactNode;
  sim: string;
  nao?: string;
  perigoso?: boolean;
  aoResponder: (sim: boolean) => void;
}) {
  return (
    <Dialogo aberto={aberto} aoFechar={() => aoResponder(false)} titulo={titulo} descricao={texto} largura="max-w-[400px]">
      <div className="flex justify-end gap-2">
        <Botao autoFocus variante="leve" onClick={() => aoResponder(false)}>{nao}</Botao>
        <Botao variante={perigoso ? "perigo" : "acento"} onClick={() => aoResponder(true)}>{sim}</Botao>
      </div>
    </Dialogo>
  );
}

/**
 * GAVETA lateral (ficha): desliza da direita, flutuando a 8 px das bordas, com cantos
 * arredondados. Arrastar para a direita também fecha (Vaul).
 */
export function Gaveta({ aberto, aoFechar, titulo, cabecalho, rodape, children, cor }: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  /** o que vai no topo, abaixo do título (ícone, subtítulo...) */
  cabecalho?: React.ReactNode;
  /** ações fixas embaixo */
  rodape?: React.ReactNode;
  children: React.ReactNode;
  /** cor do véu no topo (identidade do item aberto) */
  cor?: string;
}) {
  return (
    <Drawer.Root open={aberto} onOpenChange={(v) => !v && aoFechar()} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-2 right-2 top-2 z-50 flex w-[460px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-janela border border-borda bg-superficie shadow-janela outline-none"
        >
          <div
            className="relative border-b border-borda px-6 pb-5 pt-6"
            style={cor ? { background: `linear-gradient(180deg, ${cor}22 0%, transparent 100%)` } : undefined}
          >
            {cabecalho}
            <Drawer.Title className={cn("text-[18px] font-semibold leading-snug tracking-tight", cabecalho && "sr-only")}>{titulo}</Drawer.Title>
            <button onClick={aoFechar} aria-label="Fechar" className="absolute right-4 top-4 rounded-full p-1.5 text-texto-3 transition hover:bg-campo hover:text-texto">
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
