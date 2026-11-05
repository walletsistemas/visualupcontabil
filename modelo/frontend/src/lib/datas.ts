export const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
  "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Hoje, «AAAA-MM-DD», no fuso deste computador (toISOString daria o dia de Londres à noite). */
export const hojeIso = (d = new Date()) => d.toLocaleDateString("sv-SE");

/** O mês de hoje, «AAAA-MM». */
export const mesAtual = (d = new Date()) => hojeIso(d).slice(0, 7);

/** «2026-09» → «Setembro de 2026». */
export function mesPorExtenso(c: string) {
  const [a, m] = c.split("-").map(Number);
  const nome = MESES[m - 1] ?? "";
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${a}`;
}

export function somarMeses(c: string, n: number) {
  const [a, m] = c.split("-").map(Number);
  const t = a * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}
