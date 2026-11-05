import { motion } from "motion/react";

/**
 * Fundo da tela de entrada: clarões suaves (bege, verde, cobre) que se movem devagar,
 * como os papéis de parede do macOS. No tema escuro a base é o grafite da UP; no claro,
 * areia clara com os mesmos clarões mais delicados (cores em `index.css`, «--cena-*»).
 *
 * ⚠ DESEMPENHO: cada clarão já é um degradê radial "pronto" (sem `filter: blur`) e
 * o movimento é só `transform` — a placa de vídeo desliza a camada sem redesenhar.
 * Com `blur()` + `left/top` a tela caía para ~30 quadros por segundo.
 */
const CLAROES = [
  { cor: "221 208 200", tam: 900, x: -280, y: -380, dx: 90, dy: 70, op: 0.3, dur: 26 },
  { cor: "62 154 107", tam: 820, x: 620, y: 300, dx: -80, dy: 70, op: 0.32, dur: 30 },
  { cor: "176 122 79", tam: 720, x: 820, y: -340, dx: 80, dy: 60, op: 0.26, dur: 34 },
  { cor: "110 143 126", tam: 640, x: -220, y: 420, dx: 70, dy: -60, op: 0.22, dur: 28 },
];

export function FundoAnimado() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--cena-2)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--cena-1)_0%,var(--cena-2)_55%,var(--cena-3)_100%)]" />
      {CLAROES.map((c, i) => (
        <motion.div
          key={i}
          className="absolute left-0 top-0 opacity-70 will-change-transform dark:opacity-100"
          style={{
            width: c.tam,
            height: c.tam,
            background: `radial-gradient(circle, rgb(${c.cor} / ${c.op}) 0%, rgb(${c.cor} / ${c.op * 0.45}) 35%, transparent 70%)`,
          }}
          initial={{ x: c.x, y: c.y }}
          animate={{ x: [c.x, c.x + c.dx, c.x], y: [c.y, c.y + c.dy, c.y] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
