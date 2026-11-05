import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes do Tailwind sem conflito (padrão do shadcn/ui). */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

/** As duas letras do nome (ex.: «Levi Mota» → «LM»), para quando não há foto. */
export function iniciais(nome: string) {
  const p = nome.split(" ").filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

/** Só números, no máximo 14, já com pontos, barra e traço: 00.000.000/0000-00. */
export function mascaraCnpj(texto: string) {
  const n = texto.replace(/\D/g, "").slice(0, 14);
  return n
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/** 12345678901 → 123.456.789-01 (só para cadastros antigos com CPF). */
export function mascaraCpf(texto: string) {
  const n = texto.replace(/\D/g, "").slice(0, 11);
  return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** «1 pessoa», «2 pessoas», «0 pessoas». */
export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
