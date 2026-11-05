/**
 * Conversa com o Python (FastAPI).
 * O endereço e a senha interna chegam no fim do endereço da janela (#api=...&t=...),
 * colocados pelo `backend/app.py`. Depois do # não sai do computador.
 */
const parametros = new URLSearchParams(window.location.hash.slice(1));
// Sem «api» no endereço: o mesmo endereço da tela. No Vite (5173), o Python de teste na 8765.
const API = parametros.get("api") ?? (window.location.port === "5173" ? "http://127.0.0.1:8765" : window.location.origin);
// Sem senha no endereço = teste no navegador (python app.py --sem-janela, senha «dev»).
const TOKEN = parametros.get("t") ?? "dev";
/** Aberto pelo atalho do navegador (`--navegador`): o Python faz o papel da janela. */
export const MODO_NAVEGADOR = parametros.get("m") === "navegador";
/** Aberto pelo `app.py` (janela ou navegador), e não direto pelo Vite. */
export const ABERTO_PELO_SISTEMA = parametros.has("t");

export class ErroDaApi extends Error {}

async function chamar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(API + caminho, {
      method: metodo,
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Token": TOKEN },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi("O sistema não respondeu. Feche e abra o programa de novo.");
  }
  if (!resposta.ok) {
    // O Python manda o motivo em «detail»: a tela mostra esse texto num balão.
    let motivo = `Erro ${resposta.status} ao falar com o sistema.`;
    try {
      const d = await resposta.json();
      if (typeof d?.detail === "string") motivo = d.detail;
    } catch {
      /* sem corpo: fica a mensagem genérica */
    }
    throw new ErroDaApi(motivo);
  }
  return resposta.json() as Promise<T>;
}

export const api = {
  get: <T>(caminho: string) => chamar<T>("GET", caminho),
  post: <T>(caminho: string, corpo?: unknown) => chamar<T>("POST", caminho, corpo ?? {}),
  put: <T>(caminho: string, corpo?: unknown) => chamar<T>("PUT", caminho, corpo ?? {}),
  del: <T>(caminho: string) => chamar<T>("DELETE", caminho),
};
