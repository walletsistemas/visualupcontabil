/**
 * Funções do padrão que no Plus estão dentro de telas específicas (aqui ficam juntas).
 * corPorTexto ↔ corDaEmpresa (rotas/empresas/visual.tsx) e corDaPessoa (componentes/ui/avatar-pessoa.tsx).
 */

// tons escuros o bastante para letras brancas por cima (os mesmos do Plus)
const CORES = ["#34815A", "#976944", "#5B6B8C", "#8C5B7A", "#5F7B6C", "#8B6F38", "#4C7A9A", "#A0574F"];

/** Cor fixa por texto: o mesmo item/pessoa tem sempre a mesma cor. */
export function corPorTexto(texto: string) {
  let h = 0;
  for (const c of texto.normalize("NFD").toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return CORES[h % CORES.length];
}

/** Compara sem acento e sem maiúscula (busca). */
export const semAcento = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
