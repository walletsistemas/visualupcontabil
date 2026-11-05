import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes do Tailwind sem conflito (padrão do shadcn/ui). */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

/** As duas letras do nome («Ana Souza» → «AS»), para quando não há foto. */
export function iniciais(nome: string) {
  const p = nome.split(" ").filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

// tons escuros o bastante para letras brancas por cima
const CORES = ["#34815A", "#976944", "#5B6B8C", "#8C5B7A", "#5F7B6C", "#8B6F38", "#4C7A9A", "#A0574F"];

/** Cor fixa por texto: a mesma pessoa/item tem sempre a mesma cor. */
export function corPorTexto(texto: string) {
  let h = 0;
  for (const c of texto.normalize("NFD").toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return CORES[h % CORES.length];
}

/** Compara sem acento e sem maiúscula (busca). */
export const semAcento = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** «1 item», «2 itens». */
export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
