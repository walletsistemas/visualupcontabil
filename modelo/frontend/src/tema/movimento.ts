/**
 * MOVIMENTO — as animações usam só estes valores (biblioteca Motion).
 * Mola = o jeito macOS: rápida no começo, assenta sem quicar. Para um visual mais sóbrio,
 * aumente `damping` (menos balanço) e diminua os tempos; para desligar, ver MotionConfig no main.tsx.
 */

/** Padrão: menu lateral, item ativo, seções que dobram. */
export const MOLA = { type: "spring", stiffness: 420, damping: 38 } as const;
/** Janelas (diálogos) entrando. */
export const MOLA_JANELA = { type: "spring", stiffness: 420, damping: 32 } as const;
/** Coisas pequenas e rápidas: busca Ctrl+K, controle segmentado. */
export const MOLA_RAPIDA = { type: "spring", stiffness: 500, damping: 36 } as const;
/** Cartão de entrada (tela de login): mais macio. */
export const MOLA_MACIA = { type: "spring", stiffness: 260, damping: 26 } as const;
/** Curva para o que não é mola (aparecer, sumir). */
export const SUAVE = [0.22, 1, 0.36, 1] as const;

/** Itens de lista/grade entrando em cascata: cada um 25 ms depois do anterior (máx. 12). */
export const cascata = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay: Math.min(i, 12) * 0.025 },
});
