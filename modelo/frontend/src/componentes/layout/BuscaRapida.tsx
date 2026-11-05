import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, LogOut, Moon, Plus, Search, type LucideIcon } from "lucide-react";
import { ITENS } from "@/dados/exemplo";
import { semAcento } from "@/lib/extras";
import { pedirTela } from "@/lib/pedidoTela";
import { MOLA_BUSCA } from "@/tema/movimento";
import { secoesDoUsuario } from "./modulos";

const GRUPO =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-texto-3";

// cada palavra digitada precisa aparecer (começo de palavra vale mais); nada de letras soltas
function filtrar(valor: string, busca: string) {
  const v = semAcento(valor);
  const termos = semAcento(busca).split(/\s+/).filter(Boolean);
  if (!termos.every((t) => v.includes(t))) return 0;
  return termos.every((t) => v.startsWith(t) || v.includes(` ${t}`)) ? 1 : 0.5;
}

type Acao = { chave: string; nome: string; busca: string; icone: LucideIcon; onde?: string; fazer: () => void };

/**
 * BUSCA RÁPIDA — a mesma do Plus (componentes/layout/BuscaRapida.tsx), estilo Spotlight (Ctrl+K):
 * ações do dia a dia, itens (depois de 2 letras) e todas as telas. Painel de VIDRO.
 */
export function BuscaRapida({ usuario, aoIr, aoTrocarTema, aoSair }: { usuario?: { perfil: string }; aoIr: (chave: string) => void; aoTrocarTema: () => void; aoSair?: () => void }) {
  const [aberta, setAberta] = useState(false);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAberta((a) => !a);
      }
    };
    const pedido = () => setAberta(true);
    window.addEventListener("keydown", tecla);
    window.addEventListener("abrir-busca", pedido);
    return () => {
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("abrir-busca", pedido);
    };
  }, []);
  useEffect(() => {
    if (!aberta) setTexto("");
  }, [aberta]);

  const executar = (f: () => void) => {
    setAberta(false);
    f();
  };
  const acoes: Acao[] = [
    { chave: "novo", nome: "Novo cadastro", busca: "criar adicionar", icone: Plus, onde: "Formulário", fazer: () => aoIr("formulario") },
    { chave: "tema", nome: "Trocar tema (claro / escuro)", busca: "tema claro escuro", icone: Moon, fazer: aoTrocarTema },
    ...(aoSair ? [{ chave: "sair", nome: "Sair", busca: "trocar usuario", icone: LogOut, fazer: aoSair }] : []),
  ];
  const itens = texto.trim().length >= 2 ? ITENS : [];

  return (
    <AnimatePresence>
      {aberta && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 pt-[14vh] backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={() => setAberta(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={MOLA_BUSCA}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] overflow-hidden rounded-[20px] border border-borda bg-vidro shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <Command label="Busca rápida" loop filter={filtrar}>
              <div className="flex items-center gap-3 border-b border-borda px-5">
                <Search className="size-5 text-texto-3" strokeWidth={1.75} />
                <Command.Input
                  autoFocus
                  value={texto}
                  onValueChange={setTexto}
                  placeholder="Tela, ação ou item…"
                  className="h-14 w-full bg-transparent text-[16px] text-texto outline-none placeholder:text-texto-3"
                  onKeyDown={(e) => e.key === "Escape" && setAberta(false)}
                />
                <kbd className="rounded-md bg-campo px-1.5 py-0.5 text-[11px] font-medium text-texto-3">Esc</kbd>
              </div>
              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-[14px] text-texto-3">Nada encontrado.</Command.Empty>

                <Command.Group heading="Ações" className={GRUPO}>
                  {acoes.map((a) => (
                    <Item key={a.chave} valor={`${a.nome} ${a.busca}`} aoEscolher={() => executar(a.fazer)}>
                      <a.icone className="size-[18px] text-texto-2" strokeWidth={1.75} />
                      <span className="text-texto">{a.nome}</span>
                      {a.onde && <span className="ml-auto pl-4 text-[12px] text-texto-3">{a.onde}</span>}
                    </Item>
                  ))}
                </Command.Group>

                {itens.length > 0 && (
                  <Command.Group heading="Abrir item" className={GRUPO}>
                    {itens.map((i) => (
                      <Item key={i.id} valor={`${i.nome} ${i.codigo} #${i.id}`} aoEscolher={() => executar(() => { aoIr("cadastro"); pedirTela({ tela: "cadastro", acao: "abrir", id: i.id }); })}>
                        <LayoutGrid className="size-[18px] text-texto-2" strokeWidth={1.75} />
                        <span className="truncate text-texto">{i.nome}</span>
                        <span className="ml-auto shrink-0 pl-4 text-[12px] tabular-nums text-texto-3">{i.codigo}</span>
                      </Item>
                    ))}
                  </Command.Group>
                )}

                {secoesDoUsuario(usuario).map((s) => (
                  <Command.Group key={s.titulo} heading={`Ir para · ${s.titulo}`} className={GRUPO}>
                    {s.modulos.map((t) => (
                      <Item key={t.chave} valor={`${t.nome} ${t.busca ?? ""}`} aoEscolher={() => executar(() => aoIr(t.chave))}>
                        <t.icone className="size-[18px] text-texto-2" strokeWidth={1.75} />
                        <span className="text-texto">{t.nome}</span>
                        <span className="ml-auto truncate pl-4 text-[12px] text-texto-3">{t.descricao}</span>
                      </Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({ valor, aoEscolher, children }: { valor: string; aoEscolher: () => void; children: React.ReactNode }) {
  return (
    <Command.Item
      value={valor}
      onSelect={aoEscolher}
      className="flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] data-[selected=true]:bg-verde/12 data-[selected=true]:[&_svg]:text-verde"
    >
      {children}
    </Command.Item>
  );
}
