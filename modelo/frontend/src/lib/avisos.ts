import { toast } from "sonner";

/**
 * Regra de ouro: NADA falha calado. Botão que não pode ser usado não some nem trava em
 * silêncio — a pessoa clica e um balão conta o motivo. O mesmo texto não se empilha (id = texto).
 */
export function avisar(texto: string) {
  toast.warning(texto, { id: texto });
}

/** Copia para a área de transferência e sempre conta se deu certo. */
export function copiarTexto(texto: string, sucesso = "Copiado.") {
  if (!navigator.clipboard) return void toast.error("Não foi possível copiar.");
  navigator.clipboard.writeText(texto).then(
    () => toast.success(sucesso),
    () => toast.error("Não foi possível copiar."),
  );
}
