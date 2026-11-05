import * as React from "react";
import * as D from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Janela por cima da tela, no estilo das folhas do macOS: entra com mola e fundo desfocado. */
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
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] rounded-[24px] border border-borda",
                  "max-h-[calc(100vh-32px)] overflow-y-auto bg-superficie p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
                  largura,
                )}
                initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-48%" }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                <D.Close className="absolute right-4 top-4 rounded-full p-1.5 text-texto-3 transition hover:bg-campo hover:text-texto">
                  <X className="size-4" />
                </D.Close>
                <D.Title className="pr-8 text-[19px] font-semibold tracking-tight text-texto">
                  {titulo}
                </D.Title>
                {descricao && (
                  <D.Description asChild>
                    <div className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-texto-2">
                      {descricao}
                    </div>
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

/** Pergunta de sim/não (substitui as caixas «Sim / Não» do sistema antigo). */
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
    <Dialogo aberto={aberto} aoFechar={() => aoResponder(false)} titulo={titulo} descricao={texto}>
      <div className="flex justify-end gap-2">
        <button
          autoFocus
          onClick={() => aoResponder(false)}
          className="h-10 rounded-xl bg-campo px-4 text-sm font-medium text-texto transition hover:bg-borda"
        >
          {nao}
        </button>
        <button
          onClick={() => aoResponder(true)}
          className={cn(
            "h-10 rounded-xl px-4 text-sm font-medium text-white transition hover:brightness-110",
            perigoso ? "bg-vermelho" : "bg-verde",
          )}
        >
          {sim}
        </button>
      </div>
    </Dialogo>
  );
}
