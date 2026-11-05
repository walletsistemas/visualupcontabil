/** «Reduzir desfoque»: tira o embaçado atrás das janelas (fica guardado neste computador). */
const CHAVE = "reduzir-desfoque";

export function desfoqueReduzido() {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

export function aplicarDesfoque(reduzir = desfoqueReduzido()) {
  document.documentElement.classList.toggle("sem-desfoque", reduzir);
  try {
    localStorage.setItem(CHAVE, reduzir ? "1" : "0");
  } catch {
    /* sem problema */
  }
}
