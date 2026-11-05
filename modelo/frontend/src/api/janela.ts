/**
 * O que só a janela do Windows faz. Na janela própria vem do pywebview; aberto pelo atalho do
 * navegador, o Python faz o mesmo (`/api/janela/...`). No navegador de teste, cai num aviso.
 */
import { ABERTO_PELO_SISTEMA, api, MODO_NAVEGADOR } from "./cliente";

type Ponte = {
  escolher_pasta: (inicial: string) => Promise<string>;
  salvar_arquivo: (nome: string, dadosBase64: string) => Promise<string>;
  abrir_pasta_do_arquivo: (caminho: string) => Promise<boolean>;
  abrir_link: (endereco: string) => Promise<boolean>;
  abrir_arquivo: (caminho: string) => Promise<boolean>;
};

/** As mesmas funções, pedidas ao Python (modo navegador). */
const pontePeloPython: Ponte = {
  escolher_pasta: async (caminho) => (await api.post<{ caminho: string }>("/api/janela/escolher-pasta", { caminho })).caminho,
  salvar_arquivo: async (nome, dados) => (await api.post<{ caminho: string }>("/api/janela/salvar-arquivo", { nome, dados })).caminho,
  abrir_pasta_do_arquivo: async (caminho) => (await api.post<{ ok: boolean }>("/api/janela/abrir-pasta", { caminho })).ok,
  abrir_arquivo: async (caminho) => (await api.post<{ ok: boolean }>("/api/janela/abrir-arquivo", { caminho })).ok,
  abrir_link: async (endereco) => (await api.post<{ ok: boolean }>("/api/janela/abrir-link", { endereco })).ok,
};

/** Na janela própria: o pywebview liga as funções um instante depois de a tela abrir. */
const NA_JANELA = ABERTO_PELO_SISTEMA && !MODO_NAVEGADOR;
const ponteDaJanela = () => (window as unknown as { pywebview?: { api: Ponte } }).pywebview?.api ?? null;
let esperando: Promise<void> | null = null;
function esperarJanela(): Promise<void> {
  if (!NA_JANELA || ponteDaJanela()?.escolher_pasta) return Promise.resolve();
  esperando ??= new Promise<void>((pronto) => {
    window.addEventListener("pywebviewready", () => pronto(), { once: true });
    setTimeout(pronto, 5000);
  });
  return esperando;
}

async function ponte(): Promise<Ponte | null> {
  if (MODO_NAVEGADOR) return pontePeloPython;
  await esperarJanela();
  return ponteDaJanela();
}

export async function escolherPasta(inicial = ""): Promise<string> {
  const p = await ponte();
  if (!p) {
    return window.prompt("Fora da janela do sistema. Digite o caminho da pasta:", inicial) ?? "";
  }
  return p.escolher_pasta(inicial);
}

/**
 * Salva um arquivo gerado pelo sistema. Na janela: pergunta onde salvar (Windows) e devolve
 * o caminho ('' = cancelou). No navegador de teste: baixa direto e devolve o nome.
 */
export async function salvarArquivo(nome: string, dadosBase64: string, tipo: string): Promise<string> {
  const p = await ponte();
  if (p) return p.salvar_arquivo(nome, dadosBase64);
  const bytes = Uint8Array.from(atob(dadosBase64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return nome;
}

export async function abrirPastaDoArquivo(caminho: string) {
  await (await ponte())?.abrir_pasta_do_arquivo(caminho);
}

export async function abrirArquivo(caminho: string) {
  await (await ponte())?.abrir_arquivo(caminho);
}

/** Há janela do Windows por trás (própria ou modo navegador)? Aí aparecem «Abrir arquivo» e «Abrir pasta». */
export const temJanela = () => MODO_NAVEGADOR || NA_JANELA || ponteDaJanela() !== null;

/** Abre um link no navegador do Windows (na janela) ou numa aba nova (no navegador). */
export async function abrirLink(endereco: string) {
  const url = /^www\./i.test(endereco) ? `https://${endereco}` : endereco;
  if (!/^https?:\/\//i.test(url)) return; // só http/https: nunca javascript:, file:...
  const p = MODO_NAVEGADOR ? null : await ponte();
  if (!p) {
    window.open(url, "_blank", "noopener");
    return;
  }
  await p.abrir_link(url);
}
