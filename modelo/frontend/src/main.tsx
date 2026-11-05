import { lazy, StrictMode, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { CancelledError, MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider, useNavigate, useParams } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast, Toaster } from "sonner";
import { JanelaPrincipal } from "@/componentes/layout/JanelaPrincipal";
import { acharModulo } from "@/componentes/layout/modulos";
import { TelaLogin } from "@/rotas/login/TelaLogin";
import { aplicarDesfoque } from "@/lib/desfoque";
import { ligarBarraDiscreta } from "@/lib/rolagem";
import { aplicarTema, temaSalvo } from "@/tema/tema";
import "@fontsource-variable/inter";
import "./index.css";

/*
 * ENTRADA DAS TELAS — mesma organização do Plus (frontend/src/main.tsx):
 * rotas «/» (entrada) e «/app/$modulo» (cada módulo dentro da JanelaPrincipal), histórico na
 * memória (programa de desktop), telas lidas em partes e carregadas ao fundo, todo erro vira balão.
 */
aplicarTema(temaSalvo());
aplicarDesfoque();
ligarBarraDiscreta();

// Cada tela é um pedaço à parte: a janela abre lendo só a entrada, e as telas são lidas
// logo depois, sem ninguém esperar (ver `carregarTelasAoFundo`).
const telas = {
  painel: () => import("@/rotas/painel/TelaPainel").then((m) => ({ default: m.TelaPainel })),
  cadastro: () => import("@/rotas/cadastro/TelaCadastro").then((m) => ({ default: m.TelaCadastro })),
  tabela: () => import("@/rotas/tabela/TelaTabela").then((m) => ({ default: m.TelaTabela })),
  formulario: () => import("@/rotas/formulario/TelaFormulario").then((m) => ({ default: m.TelaFormulario })),
  pecas: () => import("@/rotas/pecas/TelaPecas").then((m) => ({ default: m.TelaPecas })),
};
const TelaPainel = lazy(telas.painel);
const TelaCadastro = lazy(telas.cadastro);
const TelaTabela = lazy(telas.tabela);
const TelaFormulario = lazy(telas.formulario);
const TelaPecas = lazy(telas.pecas);

/** Lê todas as telas quando a janela está à toa, para a troca de tela ser instantânea. */
function carregarTelasAoFundo() {
  const ler = () => Object.values(telas).forEach((t) => t().catch(() => {}));
  if ("requestIdleCallback" in window) window.requestIdleCallback(ler, { timeout: 2000 });
  else setTimeout(ler, 300);
}
carregarTelasAoFundo();

/** Nada falha calado: todo erro vira balão. id = motivo, para a mesma falha não se empilhar. */
const motivo = (e: unknown) => (e as Error)?.message || "erro desconhecido";
const consultas = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
  queryCache: new QueryCache({ onError: (e) => toast.error(`Não foi possível carregar: ${motivo(e)}`, { id: motivo(e) }) }),
  mutationCache: new MutationCache({
    onError: (e, _v, _c, m) => {
      // quem já trata o próprio erro (onError) não ganha balão repetido
      if (!m.options.onError) toast.error(`Não foi possível concluir: ${motivo(e)}`, { id: motivo(e) });
    },
  }),
});
window.addEventListener("unhandledrejection", (ev) => {
  const e = ev.reason;
  if (e instanceof CancelledError || (e as Error)?.name === "AbortError") return;
  toast.error(`Algo deu errado: ${motivo(e)}`, { id: motivo(e) });
});

function Raiz() {
  return (
    // reducedMotion="user": quem pediu ao Windows menos animação, recebe menos (o Plus ainda não tem)
    <MotionConfig reducedMotion="user">
      <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
        <Outlet />
      </Tooltip.Provider>
      <Toaster position="top-center" richColors closeButton toastOptions={{ style: { borderRadius: 16 } }} />
    </MotionConfig>
  );
}

function PaginaLogin() {
  const ir = useNavigate();
  return <TelaLogin aoEntrar={() => ir({ to: "/app/$modulo", params: { modulo: "painel" } })} />;
}

/** Cada módulo, dentro da janela principal. */
function PaginaModulo() {
  const ir = useNavigate();
  const { modulo } = useParams({ from: "/app/$modulo" });
  const m = acharModulo(modulo) ?? acharModulo("painel")!;
  const irPara = (chave: string) => ir({ to: "/app/$modulo", params: { modulo: chave } });
  const tela: Record<string, ReactNode> = {
    painel: <TelaPainel aoIr={irPara} />,
    cadastro: <TelaCadastro aoNovo={() => irPara("formulario")} />,
    tabela: <TelaTabela />,
    formulario: <TelaFormulario aoVoltar={() => irPara("cadastro")} />,
    pecas: <TelaPecas />,
  };
  return (
    // sem login: tire `usuario` e `aoSair` (o rodapé do menu vira «Preferências»)
    <JanelaPrincipal modulo={m.chave} aoIr={irPara} usuario={{ nome: "Ana Souza", cargo: "Administradora", perfil: "admin" }} aoSair={() => ir({ to: "/" })}>
      <Suspense fallback={null}>{tela[m.chave]}</Suspense>
    </JanelaPrincipal>
  );
}

// ?tela=painel no endereço abre direto num módulo (usado pelas fotos automáticas)
const inicio = new URLSearchParams(window.location.search).get("tela");
const raiz = createRootRoute({ component: Raiz });
const roteador = createRouter({
  // Programa de desktop: a navegação fica na memória (o endereço da janela não muda).
  history: createMemoryHistory({ initialEntries: [inicio ? `/app/${inicio}` : "/"] }),
  routeTree: raiz.addChildren([
    createRoute({ getParentRoute: () => raiz, path: "/", component: PaginaLogin }),
    createRoute({ getParentRoute: () => raiz, path: "/app/$modulo", component: PaginaModulo }),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof roteador;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={consultas}>
      <RouterProvider router={roteador} />
    </QueryClientProvider>
  </StrictMode>,
);
