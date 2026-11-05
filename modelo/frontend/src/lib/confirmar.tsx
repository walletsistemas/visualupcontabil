import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialogo } from "@/componentes/ui/dialogo";
import { cn } from "@/lib/utils";

type Pedido = { titulo: string; texto?: string; botao?: string; perigo?: boolean };

/** Pergunta «tem certeza?» numa janela do app e devolve true só se a pessoa confirmar.
 * Enter confirma, Esc cancela. */
export function confirmar(p: Pedido): Promise<boolean> {
  return new Promise((resolver) => {
    const caixa = document.createElement("div");
    document.body.appendChild(caixa);
    const raiz = createRoot(caixa);
    const fim = (sim: boolean) => {
      resolver(sim);
      setTimeout(() => {
        raiz.unmount();
        caixa.remove();
      }, 250);
    };
    raiz.render(<Janela {...p} aoFim={fim} />);
  });
}

function Janela({ titulo, texto, botao = "Confirmar", perigo = true, aoFim }: Pedido & { aoFim: (sim: boolean) => void }) {
  const [aberto, setAberto] = useState(true);
  const fechar = (sim: boolean) => {
    setAberto(false);
    aoFim(sim);
  };
  useEffect(() => {
    const t = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        fechar(true);
      }
    };
    window.addEventListener("keydown", t);
    return () => window.removeEventListener("keydown", t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialogo aberto={aberto} aoFechar={() => fechar(false)} titulo={titulo} descricao={texto} largura="max-w-[400px]">
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={() => fechar(false)} className="h-9 rounded-xl px-4 text-[13.5px] font-medium text-texto-2 hover:bg-campo">
          Cancelar
        </button>
        <button
          autoFocus
          onClick={() => fechar(true)}
          className={cn("h-9 rounded-xl px-4 text-[13.5px] font-medium text-white hover:brightness-105", perigo ? "bg-vermelho" : "bg-verde")}
        >
          {botao}
        </button>
      </div>
    </Dialogo>
  );
}
