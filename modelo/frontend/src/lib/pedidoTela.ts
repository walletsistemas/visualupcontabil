import { useEffect, useRef } from "react";

/**
 * Pedido de ação vindo da busca rápida (Ctrl+K) para uma tela: «nova tarefa», «abrir esta empresa»…
 * Se a tela já está aberta, ela recebe na hora; se não, recebe assim que abrir.
 */
/** `voltar`: de onde veio o pedido, para a tela mostrar «Voltar para…» (ex.: a Visão geral) */
/** `pessoa`/`titulo`: estudo aberto já no andamento de uma pessoa (vindo da Visão geral) */
export type PedidoTela = { tela: string; acao: string; id?: number; uid?: string; pessoa?: string; titulo?: string; voltar?: { para: string; rotulo: string } };

let pendente: PedidoTela | null = null;

export function pedirTela(p: PedidoTela) {
  pendente = p;
  window.dispatchEvent(new Event("pedido-tela"));
}

export function usePedidoTela(tela: string, fazer: (p: PedidoTela) => void) {
  const ref = useRef(fazer);
  ref.current = fazer;
  useEffect(() => {
    const ver = () => {
      if (pendente?.tela !== tela) return;
      const p = pendente;
      pendente = null;
      ref.current(p);
    };
    ver();
    window.addEventListener("pedido-tela", ver);
    return () => window.removeEventListener("pedido-tela", ver);
  }, [tela]);
}
