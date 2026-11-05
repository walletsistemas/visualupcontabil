import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast, Toaster } from "sonner";
import { JanelaPrincipal } from "@/componentes/layout/JanelaPrincipal";
import { acharTela, type Pedido } from "@/componentes/layout/telas";
import { aplicarDesfoque } from "@/lib/desfoque";
import { ligarBarraDiscreta } from "@/lib/rolagem";
import { aplicarTema, temaSalvo } from "@/tema/tema";
import { Entrada } from "@/telas/Entrada";
import { Formulario } from "@/telas/Formulario";
import { Lista } from "@/telas/Lista";
import { Painel } from "@/telas/Painel";
import { Pecas } from "@/telas/Pecas";
import { Tabela } from "@/telas/Tabela";
import "@fontsource-variable/inter";
import "./index.css";

aplicarTema(temaSalvo());
aplicarDesfoque();
ligarBarraDiscreta();

/** Nada falha calado: todo erro vira balão. id = motivo, para a mesma falha não se empilhar. */
const motivo = (e: unknown) => (e as Error)?.message || "erro desconhecido";
const consultas = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
  queryCache: new QueryCache({ onError: (e) => toast.error(`Não foi possível carregar: ${motivo(e)}`, { id: motivo(e) }) }),
  mutationCache: new MutationCache({
    onError: (e, _v, _c, m) => {
      if (!m.options.onError) toast.error(`Não foi possível concluir: ${motivo(e)}`, { id: motivo(e) });
    },
  }),
});

function Raiz() {
  return (
    // reducedMotion="user": quem pediu ao Windows menos animação, recebe menos animação
    <MotionConfig reducedMotion="user">
      <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
        <Outlet />
      </Tooltip.Provider>
      <Toaster position="top-center" richColors closeButton toastOptions={{ style: { borderRadius: 16, fontFamily: "var(--fonte)" } }} />
    </MotionConfig>
  );
}

function PaginaEntrada() {
  const ir = useNavigate();
  return <Entrada aoEntrar={() => ir({ to: "/app/$tela", params: { tela: "painel" } })} />;
}

function PaginaTela() {
  const ir = useNavigate();
  const { tela } = useParams({ from: "/app/$tela" });
  const pedido = useSearch({ from: "/app/$tela" });
  const chave = acharTela(tela)?.chave ?? "painel";
  const irPara = (c: string, p: Pedido = {}) => ir({ to: "/app/$tela", params: { tela: c }, search: p });
  const telas: Record<string, ReactNode> = {
    painel: <Painel aoIr={irPara} />,
    // key: um pedido novo (outro filtro, outro item) recomeça a tela com ele
    lista: <Lista key={JSON.stringify(pedido)} pedido={pedido} aoNovo={() => irPara("formulario")} />,
    tabela: <Tabela />,
    formulario: <Formulario aoVoltar={() => irPara("lista")} />,
    pecas: <Pecas />,
  };
  return (
    <JanelaPrincipal tela={chave} aoIr={irPara} usuario={{ nome: "Ana Souza", cargo: "Administradora" }} aoSair={() => ir({ to: "/" })}>
      {telas[chave]}
    </JanelaPrincipal>
  );
}

// ?tela=painel no endereço abre direto numa tela (usado pelas fotos automáticas)
const inicio = new URLSearchParams(window.location.search).get("tela");
const raiz = createRootRoute({ component: Raiz });
const roteador = createRouter({
  // programa de desktop: a navegação fica na memória (o endereço da janela não muda)
  history: createMemoryHistory({ initialEntries: [inicio ? `/app/${inicio}` : "/"] }),
  routeTree: raiz.addChildren([
    createRoute({ getParentRoute: () => raiz, path: "/", component: PaginaEntrada }),
    createRoute({ getParentRoute: () => raiz, path: "/app/$tela", component: PaginaTela, validateSearch: (s): Pedido => ({ filtro: typeof s.filtro === "string" ? s.filtro : undefined, abrir: typeof s.abrir === "number" ? s.abrir : undefined }) }),
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
