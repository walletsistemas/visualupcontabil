/**
 * MOVIMENTO — os valores das animações do Sistema Contábil Plus, num lugar só.
 * No Plus eles estão escritos em cada componente (MenuLateral, dialogo, BuscaRapida, TelaLogin...);
 * os números são os mesmos. NÃO mude: é o padrão do escritório.
 * Quem pediu ao Windows "menos animação" já recebe menos (MotionConfig reducedMotion="user").
 */

/** Menu lateral (abrir/recolher, item ativo deslizando, seções dobrando). */
export const MOLA = { type: "spring", stiffness: 420, damping: 38 } as const;
/** Janelas (diálogos) entrando. */
export const MOLA_JANELA = { type: "spring", stiffness: 420, damping: 32 } as const;
/** Busca rápida (Ctrl+K) entrando. */
export const MOLA_BUSCA = { type: "spring", stiffness: 500, damping: 34 } as const;
/** Pílula do controle segmentado. */
export const MOLA_SEGMENTO = { type: "spring", stiffness: 500, damping: 38 } as const;
/** Cartão da tela de entrada. */
export const MOLA_MACIA = { type: "spring", stiffness: 260, damping: 26 } as const;
/** Foto/iniciais trocando na entrada. */
export const MOLA_AVATAR = { type: "spring", stiffness: 380, damping: 26 } as const;
/** Avisos que entram por cima (atualização, avisos do dia). */
export const MOLA_AVISO = { type: "spring", stiffness: 380, damping: 30 } as const;
/** Curva para o que não é mola (a marca da entrada aparecendo). */
export const SUAVE = [0.22, 1, 0.36, 1] as const;

/** Cartões entrando em cascata: cada um 25 ms depois do anterior (máx. 12). Igual aos cartões do Plus. */
export const cascata = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay: Math.min(i, 12) * 0.025 },
});
