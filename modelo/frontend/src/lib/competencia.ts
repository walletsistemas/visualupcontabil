import { useSyncExternalStore } from "react";

/** Competência = mês de trabalho, guardado como «AAAA-MM». */

export const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
  "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** «2026-09» → «Setembro de 2026». */
export function compPorExtenso(c: string) {
  const [a, m] = c.split("-").map(Number);
  const nome = MESES[m - 1] ?? "";
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${a}`;
}

/** «2026-09» → «09/2026». */
export function compCurta(c: string) {
  const [a, m] = c.split("-");
  return `${m}/${a}`;
}

/** «2026-02» → «2026-02-28» (o último dia do mês, já contando ano bissexto). */
export function ultimoDia(c: string) {
  const [a, m] = c.split("-").map(Number);
  return `${c}-${String(new Date(a, m, 0).getDate()).padStart(2, "0")}`;
}

/** Hoje, «AAAA-MM-DD», no fuso deste computador (toISOString daria o dia de Londres depois das 21h). */
export const hojeIso = (d = new Date()) => d.toLocaleDateString("sv-SE");

/** O mês de hoje, «AAAA-MM». */
export const mesAtual = (d = new Date()) => hojeIso(d).slice(0, 7);

export function somarMeses(c: string, n: number) {
  const [a, m] = c.split("-").map(Number);
  const t = a * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

// ---------------------------------------------------------------- o mês escolhido, igual em todas as telas
// Pedido do Levi (17/10/2026): mudou o mês numa tela (ex.: agosto em Empresas), as outras
// (Rotinas, Equipe…) abrem no mesmo mês. "" = ninguém escolheu ainda: cada tela usa o seu padrão.

let escolhida = "";
const ouvintes = new Set<() => void>();

export function definirCompetencia(c: string) {
  if (c === escolhida) return;
  escolhida = c;
  ouvintes.forEach((f) => f());
}

export function useCompetencia(): [string, (c: string) => void] {
  const c = useSyncExternalStore(
    (f) => (ouvintes.add(f), () => ouvintes.delete(f)),
    () => escolhida,
  );
  return [c, definirCompetencia];
}
