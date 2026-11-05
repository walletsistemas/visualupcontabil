import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialogo } from "@/componentes/ui/dialogo";
import { Botao } from "@/componentes/ui/botao";

type Pedido = { titulo: string; texto?: string; botao?: string; perigo?: boolean };

/**
 * «Tem certeza?» numa janela do app, chamado de qualquer lugar:
 *   if (await confirmar({ titulo: "Apagar?", botao: "Apagar" })) ...
 * Enter confirma, Esc cancela. Substitui o window.confirm (feio) e o QMessageBox.
 */
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
      <div className="flex justify-end gap-2">
        <Botao variante="fantasma" tamanho="p" className="h-9" onClick={() => fechar(false)}>Cancelar</Botao>
        <Botao autoFocus variante={perigo ? "perigo" : "acento"} tamanho="p" className="h-9" onClick={() => fechar(true)}>{botao}</Botao>
      </div>
    </Dialogo>
  );
}
