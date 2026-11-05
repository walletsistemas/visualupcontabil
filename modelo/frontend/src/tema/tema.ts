export type Tema = "claro" | "escuro";

/*
 * Mesmas funções do Plus (frontend/src/tema/tema.ts). A diferença: o Plus guarda a escolha no
 * Python (sessaoApi.tema, por usuário do Windows); aqui fica no localStorage. Na cirurgia,
 * guarde do jeito do Plus quando o sistema tiver sessão no Python.
 */
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
}

/** Troca e guarda a escolha neste computador. */
export function trocarTema(atual: Tema): Tema {
  const novo: Tema = atual === "escuro" ? "claro" : "escuro";
  aplicarTema(novo);
  try {
    localStorage.setItem(CHAVE, novo);
  } catch {
    /* só não lembra */
  }
  return novo;
}
