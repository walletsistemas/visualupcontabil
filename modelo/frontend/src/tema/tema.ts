export type Tema = "claro" | "escuro";

const CHAVE = "tema";

/** O tema guardado neste computador (sem nada guardado: segue o Windows). */
export function temaSalvo(): Tema {
  try {
    const t = localStorage.getItem(CHAVE);
    if (t === "claro" || t === "escuro") return t;
  } catch {
    /* sem armazenamento */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

export function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle("escuro", tema === "escuro");
  try {
    localStorage.setItem(CHAVE, tema);
  } catch {
    /* só não lembra */
  }
}
