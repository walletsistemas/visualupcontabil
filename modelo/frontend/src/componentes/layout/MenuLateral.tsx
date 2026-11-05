import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronsUpDown, Droplet, LogOut, Moon, MousePointerClick, PanelLeftClose, PanelLeftOpen, Search, Settings2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { cn, iniciais } from "@/lib/utils";
import { aplicarDesfoque, desfoqueReduzido } from "@/lib/desfoque";
import { MOLA } from "@/tema/movimento";
import { useJanelaEstreita } from "@/componentes/ui/pecas";
import { secoesDoUsuario } from "./modulos";

/** Nome do sistema embaixo do logo (no Plus: «Sistema Contábil»). Troque pelo do seu sistema. */
export const NOME_SISTEMA = "Meu Sistema";

function lerSalvo<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave);
    return v === null ? padrao : (JSON.parse(v) as T);
  } catch {
    return padrao;
  }
}
function salvar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem armazenamento: só não lembra */
  }
}

const ABERTO = 256;
const FECHADO = 72;

/**
 * MENU LATERAL — o mesmo do Plus (frontend/src/componentes/layout/MenuLateral.tsx), sem as
 * janelas e contadores que dependem dos módulos de lá (Novidades, Sugestões, Seu dia, e-mail).
 * - Logo da UP + NOME_SISTEMA no topo; busca (Ctrl+K); seções com título em caixa alta que DOBRAM com um clique
 *   (e o menu lembra quais ficaram dobradas).
 * - Item ativo: pílula clara que DESLIZA de um item ao outro (layoutId) + barrinha da marca à esquerda.
 * - Recolhido (só ícones, 72 px): passar o mouse mostra o nome num balão. Ctrl+B recolhe/abre.
 * - «Menu automático»: fica recolhido e abre POR CIMA da tela quando o mouse chega.
 *   Janela estreita (< 1100 px) liga isso sozinho.
 * - Embaixo, a conta: menu com preferências (tema, menu automático, reduzir desfoque) e sair.
 *   SEM LOGIN: não passe `usuario` nem `aoSair` — vira um botão «Preferências» com o mesmo menu.
 */
export function MenuLateral({ usuario, modulo, tema, aoIr, aoTrocarTema, aoSair }: {
  usuario?: { nome: string; cargo: string; perfil: string };
  modulo: string;
  tema: "claro" | "escuro";
  aoIr: (chave: string) => void;
  aoTrocarTema: () => void;
  aoSair?: () => void;
}) {
  const [semDesfoque, setSemDesfoque] = useState(desfoqueReduzido);
  const [fixoRecolhido, setFixoRecolhido] = useState(() => lerSalvo("menu_recolhido", false));
  const [autoEscolhido, setAutomatico] = useState(() => lerSalvo("menu_automatico", false));
  const estreita = useJanelaEstreita(1100);
  const automatico = autoEscolhido || estreita;
  const [mouseDentro, setMouseDentro] = useState(false);
  const [contaAberta, setContaAberta] = useState(false);
  // quem recolheu na mão com o mouse em cima: só volta a abrir depois que o mouse sair
  const [esperaSair, setEsperaSair] = useState(false);
  const relogio = useRef<number>(undefined);
  const recolhido = automatico ? !(mouseDentro && !esperaSair) && !contaAberta : fixoRecolhido;
  const [dobradas, setDobradas] = useState<string[]>(() => lerSalvo("menu_dobradas", []));

  useEffect(() => salvar("menu_recolhido", fixoRecolhido), [fixoRecolhido]);
  useEffect(() => salvar("menu_automatico", autoEscolhido), [autoEscolhido]);
  useEffect(() => salvar("menu_dobradas", dobradas), [dobradas]);
  useEffect(() => () => window.clearTimeout(relogio.current), []);

  const entrou = () => {
    window.clearTimeout(relogio.current);
    setMouseDentro(true);
  };
  const saiu = () => {
    window.clearTimeout(relogio.current);
    setEsperaSair(false);
    // um respiro antes de recolher: passar de raspão não fecha o menu
    relogio.current = window.setTimeout(() => setMouseDentro(false), 350);
  };
  const alternar = () => {
    if (automatico) setEsperaSair(!recolhido);
    else setFixoRecolhido((r) => !r);
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        alternar();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  const alternarSecao = (t: string) => setDobradas((d) => (d.includes(t) ? d.filter((x) => x !== t) : [...d, t]));

  return (
    <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
      {/* o ESPAÇO do menu: no automático vale sempre o recolhido e o menu abre por cima,
          assim o conteúdo não pula para o lado a cada passada do mouse */}
      <motion.div animate={{ width: automatico || fixoRecolhido ? FECHADO : ABERTO }} transition={MOLA} className="relative z-30 shrink-0">
        <motion.aside
          animate={{ width: recolhido ? FECHADO : ABERTO }}
          transition={MOLA}
          onMouseEnter={automatico ? entrou : undefined}
          onMouseLeave={automatico ? saiu : undefined}
          className={cn(
            "absolute inset-y-0 left-0 flex flex-col overflow-hidden bg-menu text-tinta transition-shadow",
            automatico && !recolhido && "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
          )}
        >
          {/* brilho suave nos cantos, como o vidro do macOS */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,var(--menu-brilho-1),transparent_60%),radial-gradient(90%_40%_at_100%_100%,var(--menu-brilho-2),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-tinta/[0.06]" />

          {/* marca + recolher */}
          <div className={cn("relative flex h-[72px] shrink-0 items-center pl-5 pr-3", recolhido && "justify-center px-0")}>
            <AnimatePresence mode="popLayout" initial={false}>
              {recolhido ? (
                <motion.button
                  key="mini"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => (automatico ? setEsperaSair(false) : setFixoRecolhido(false))}
                  title="Abrir o menu (Ctrl+B)"
                  aria-label="Abrir o menu"
                  className="group relative flex h-12 w-[52px] items-center justify-center rounded-xl transition hover:bg-tinta/[0.08]"
                >
                  <img src="/logo_simbolo.png" alt="UP Contábil" draggable={false} className="hidden w-[42px] transition duration-200 group-hover:scale-90 group-hover:opacity-0 dark:block" />
                  <img src="/logo_simbolo_escura.png" alt="UP Contábil" draggable={false} className="w-[42px] transition duration-200 group-hover:scale-90 group-hover:opacity-0 dark:hidden" />
                  <PanelLeftOpen className="absolute size-5 text-tinta/80 opacity-0 transition duration-200 group-hover:opacity-100" />
                </motion.button>
              ) : (
                <motion.div key="cheio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img src="/logo_simbolo.png" alt="UP" className="hidden h-7 opacity-95 dark:block" draggable={false} />
                    <img src="/logo_simbolo_escura.png" alt="UP" className="h-7 opacity-90 dark:hidden" draggable={false} />
                    <span className="mt-1.5 text-[9.5px] font-medium uppercase tracking-[0.26em] text-tinta/65 dark:text-tinta/55">{NOME_SISTEMA}</span>
                  </div>
                  <button
                    onClick={alternar}
                    title="Recolher o menu (Ctrl+B)"
                    aria-label="Recolher o menu"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-tinta/35 transition hover:bg-tinta/10 hover:text-tinta"
                  >
                    <PanelLeftClose className="size-[18px]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* busca rápida */}
          <div className={cn("relative px-3 pb-2", recolhido && "px-[14px]")}>
            <DicaMenu texto="Buscar (Ctrl+K)" ativa={recolhido}>
              <button
                onClick={() => window.dispatchEvent(new Event("abrir-busca"))}
                aria-label="Buscar (Ctrl+K)"
                className={cn(
                  "flex h-9 w-full items-center gap-2.5 rounded-xl bg-tinta/[0.06] px-3 text-[13px] text-tinta/70 ring-1 ring-inset ring-tinta/[0.06] transition hover:bg-tinta/[0.1] dark:text-tinta/50",
                  recolhido && "justify-center px-0",
                )}
              >
                <Search className="size-4 shrink-0" />
                {!recolhido && (
                  <>
                    <span>Buscar…</span>
                    <kbd className="ml-auto rounded-md bg-tinta/[0.08] px-1.5 py-px text-[10.5px] font-medium text-tinta/70 dark:text-tinta/50">Ctrl K</kbd>
                  </>
                )}
              </button>
            </DicaMenu>
          </div>

          {/* seções */}
          <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 [scrollbar-width:none]">
            {secoesDoUsuario(usuario).map((s) => {
              const dobrada = !recolhido && dobradas.includes(s.titulo);
              const temAtivo = s.modulos.some((m) => m.chave === modulo);
              return (
                <div key={s.titulo} className="mt-2">
                  {recolhido ? (
                    <div className="mx-auto my-2 h-px w-6 bg-tinta/10" />
                  ) : (
                    <button
                      onClick={() => alternarSecao(s.titulo)}
                      className="group flex h-8 w-full items-center gap-1 rounded-lg px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-tinta/65 transition hover:text-tinta/80 dark:text-tinta/45"
                    >
                      {s.titulo}
                      {dobrada && temAtivo && <span className="ml-1.5 size-1.5 rounded-full bg-destaque" />}
                      <ChevronDown className={cn("ml-auto size-3.5 opacity-0 transition group-hover:opacity-100", dobrada && "-rotate-90 opacity-100")} />
                    </button>
                  )}
                  <motion.div initial={false} animate={{ height: dobrada ? 0 : "auto", opacity: dobrada ? 0 : 1 }} transition={MOLA} className="overflow-hidden">
                    <div className="flex flex-col gap-0.5">
                      {s.modulos.map((m) => {
                        const ativo = m.chave === modulo;
                        return (
                          <DicaMenu key={m.chave} texto={m.nome} ativa={recolhido}>
                            <button
                              onClick={() => aoIr(m.chave)}
                              aria-label={m.nome}
                              aria-current={ativo ? "page" : undefined}
                              className={cn(
                                "group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[14px] outline-none transition-colors",
                                ativo ? "text-tinta" : "text-tinta/75 hover:text-tinta dark:text-tinta/65",
                                recolhido && "justify-center px-0",
                              )}
                            >
                              {ativo ? (
                                <motion.span
                                  layoutId="menu-ativo"
                                  transition={MOLA}
                                  className="absolute inset-0 rounded-xl bg-white/80 shadow-[0_1px_2px_rgba(60,45,30,0.08),0_6px_16px_-10px_rgba(60,45,30,0.35)] dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.16] dark:to-white/[0.09] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_6px_16px_-8px_rgba(0,0,0,0.6)]"
                                />
                              ) : (
                                <span className="absolute inset-0 rounded-xl bg-tinta/0 transition group-hover:bg-tinta/[0.05]" />
                              )}
                              {ativo && !recolhido && (
                                <motion.span layoutId="menu-barra" transition={MOLA} className="absolute -left-3 top-2.5 h-5 w-[3px] rounded-r-full bg-destaque" />
                              )}
                              <m.icone className={cn("relative size-[19px] shrink-0 transition-transform group-active:scale-90", ativo && "text-destaque")} strokeWidth={ativo ? 2 : 1.75} />
                              {!recolhido && <span className={cn("relative truncate", ativo && "font-medium")}>{m.nome}</span>}
                              {!!m.contador &&
                                (recolhido ? (
                                  <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destaque px-1 text-[9.5px] font-semibold tabular-nums text-white dark:text-[#1b1a18]">
                                    {m.contador}
                                  </span>
                                ) : (
                                  <span
                                    className={cn(
                                      "relative ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                                      ativo ? "bg-destaque text-white dark:text-[#1b1a18]" : "bg-tinta/[0.08] text-tinta/75",
                                    )}
                                  >
                                    {m.contador}
                                  </span>
                                ))}
                            </button>
                          </DicaMenu>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </nav>

          {/* conta */}
          <div className="relative border-t border-tinta/[0.07] p-3">
            <Popover.Root onOpenChange={setContaAberta}>
              <Popover.Trigger asChild>
                <button
                  aria-label={usuario ? `Conta de ${usuario.nome}` : "Preferências"}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2 text-left outline-none transition hover:bg-tinta/[0.06] data-[state=open]:bg-tinta/[0.08]",
                    recolhido && "justify-center p-1",
                  )}
                >
                  {usuario ? (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-verde text-[13px] font-semibold text-white ring-2 ring-tinta/15">
                      {iniciais(usuario.nome)}
                    </div>
                  ) : (
                    <Settings2 className="size-[19px] shrink-0 text-tinta/70" strokeWidth={1.75} />
                  )}
                  {!recolhido && (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">{usuario?.nome ?? "Preferências"}</p>
                        {usuario && <p className="truncate text-[11.5px] text-tinta/70 dark:text-tinta/50">{usuario.cargo}</p>}
                      </div>
                      <ChevronsUpDown className="size-4 text-tinta/35" />
                    </>
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side={recolhido ? "right" : "top"}
                  align={recolhido ? "end" : "start"}
                  sideOffset={10}
                  className="z-50 w-[256px] rounded-2xl border border-borda bg-superficie p-1.5 text-texto shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]"
                >
                  {usuario && (
                    <>
                      <div className="px-3 py-2">
                        <p className="truncate text-[13px] font-semibold">{usuario.nome}</p>
                        <p className="truncate text-[12px] text-texto-3">{usuario.cargo}</p>
                      </div>
                      <div className="my-1 h-px bg-borda" />
                      <ItemConta icone={UserRound} texto="Meu perfil" aoClicar={() => toast("Aqui abre a janela de perfil.")} />
                      <div className="my-1 h-px bg-borda" />
                    </>
                  )}
                  <p className="px-3 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-texto-3">Preferências</p>
                  <ItemConta
                    icone={MousePointerClick}
                    texto="Menu automático"
                    marcado={autoEscolhido}
                    aoClicar={() => {
                      toast.success(autoEscolhido ? "Menu automático desligado." : "Menu automático ligado: abre ao chegar com o mouse.");
                      setAutomatico((a) => !a);
                      setEsperaSair(false);
                      setMouseDentro(false);
                    }}
                  />
                  <ItemConta icone={Moon} texto="Tema escuro" marcado={tema === "escuro"} aoClicar={aoTrocarTema} />
                  <ItemConta
                    icone={Droplet}
                    texto="Reduzir desfoque"
                    marcado={semDesfoque}
                    aoClicar={() => {
                      aplicarDesfoque(!semDesfoque);
                      setSemDesfoque(!semDesfoque);
                    }}
                  />
                  {aoSair && (
                    <>
                      <div className="my-1 h-px bg-borda" />
                      <ItemConta icone={LogOut} texto="Sair" aoClicar={aoSair} />
                    </>
                  )}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </motion.aside>
      </motion.div>
    </Tooltip.Provider>
  );
}

function ItemConta({ icone: Icone, texto, marcado, aoClicar }: {
  icone: typeof Moon;
  texto: string;
  /** com valor, mostra um interruptor à direita */
  marcado?: boolean;
  aoClicar: () => void;
}) {
  return (
    <Popover.Close asChild>
      <button onClick={aoClicar} className="flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-left text-[13.5px] transition hover:bg-campo">
        <Icone className="size-4 shrink-0 text-texto-2" />
        <span className="flex-1 whitespace-nowrap">{texto}</span>
        {marcado !== undefined && (
          <span className={cn("flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-0.5 transition", marcado ? "bg-verde" : "bg-borda")}>
            <span className={cn("size-[14px] rounded-full bg-white shadow transition", marcado && "translate-x-3")} />
          </span>
        )}
      </button>
    </Popover.Close>
  );
}

/** Balão com o nome — só quando o menu está recolhido. */
function DicaMenu({ texto, ativa, children }: { texto: string; ativa: boolean; children: React.ReactElement }) {
  if (!ativa) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="right" sideOffset={12} className="z-50 rounded-lg bg-[#1b1a18] px-2.5 py-1.5 text-[12.5px] font-medium text-white shadow-lg">
          {texto}
          <Tooltip.Arrow className="fill-[#1b1a18]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
