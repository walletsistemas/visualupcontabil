/**
 * Números no jeito brasileiro. Use no lugar do QDoubleSpinBox/QSpinBox: um CampoRotulado de texto
 * (`inputMode="decimal"`) + `lerNumeroBr` ao salvar. `type="number"` não entende vírgula.
 * Limites que o widget Qt tinha (setMaximum, casas decimais) são REGRA: confira de novo no Python.
 */

/** «1.234,56» · «1234,56» · «1234.56» · «R$ 10» → número; null se não for número. */
export function lerNumeroBr(texto: string): number | null {
  let t = texto.replace(/[R$\s]/g, "");
  if (!t) return null;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", "."); // vírgula decide: ponto é milhar
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** 1234.5 → «1.234,50» (com `moeda`: «R$ 1.234,50»). */
export function formatarBr(n: number, { casas = 2, moeda = false } = {}) {
  return n.toLocaleString("pt-BR", moeda ? { style: "currency", currency: "BRL" } : { minimumFractionDigits: casas, maximumFractionDigits: casas });
}
