import { useEffect } from "react";
import { toast } from "sonner";

/*
 * Mesmas funções do Plus (frontend/src/lib/avisos.ts). Lá também moram os textos de motivo de
 * cada módulo (MOTIVO_EMPRESA, MOTIVO_TAREFA...); cada sistema cria os seus no mesmo formato.
 */

/**
 * Balão explicando por que algo não pode ser feito. A tela não esconde nem trava em silêncio:
 * a pessoa clica e o sistema conta o motivo. O mesmo texto não se empilha (id = texto).
 */
export function avisar(texto: string) {
  toast.warning(texto, { id: texto });
}

/** Erro ao carregar uma lista: avisa uma vez (não se repete a cada nova tentativa). */
export function useAvisoDeErro(q: { isError: boolean; error: unknown }, oque: string) {
  const motivo = q.isError ? ((q.error as Error)?.message || "erro desconhecido") : "";
  useEffect(() => {
    if (motivo) {
      const texto = `Não foi possível carregar ${oque}: ${motivo}`;
      toast.error(texto, { id: motivo }); // mesmo id do aviso geral (main.tsx): troca, não duplica
    }
  }, [motivo, oque]);
}

/** Copia para a área de transferência e sempre conta se deu certo. */
export function copiarTexto(texto: string, sucesso = "Copiado.") {
  if (!navigator.clipboard) return void toast.error("Não foi possível copiar.");
  navigator.clipboard.writeText(texto).then(
    () => toast.success(sucesso),
    () => toast.error("Não foi possível copiar."),
  );
}
