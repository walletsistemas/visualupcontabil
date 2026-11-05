import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { Eye, EyeOff, KeyRound, Moon, Sun, User } from "lucide-react";
import { toast } from "sonner";
import { Botao } from "@/componentes/ui/botao";
import { Campo } from "@/componentes/ui/campo";
import { CaixaSelecao } from "@/componentes/ui/marcadores";
import { Marca } from "@/componentes/layout/MenuLateral";
import { aplicarTema, type Tema } from "@/tema/tema";
import { MOLA_MACIA, SUAVE } from "@/tema/movimento";
import { cn, corPorTexto, iniciais } from "@/lib/utils";

/**
 * TELA DE ENTRADA: fundo com clarões que se movem devagar, cartão de VIDRO no centro,
 * a foto/iniciais da pessoa SAINDO por cima do cartão e trocando enquanto ela digita,
 * e o cartão TREME quando falta algo. (Na vitrine qualquer usuário entra.)
 */
export function Entrada({ aoEntrar }: { aoEntrar: () => void }) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [tema, setTema] = useState<Tema>(() => (document.documentElement.classList.contains("escuro") ? "escuro" : "claro"));
  const refSenha = useRef<HTMLInputElement>(null);
  const tremer = useAnimationControls();
  const nome = login.trim().length >= 2 ? login.trim().replace(/^\w/, (c) => c.toUpperCase()) : "";

  function falhar(msg: string) {
    setErro(true);
    tremer.start({ x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.45 } });
    toast.error(msg);
  }

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!login.trim()) return falhar("Informe o usuário.");
    if (!senha) return falhar("Informe a senha.");
    setEntrando(true);
    setTimeout(aoEntrar, 500);
  }

  return (
    <div className="relative flex h-full flex-col">
      <FundoAnimado />

      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={() => {
            const novo = tema === "escuro" ? "claro" : "escuro";
            aplicarTema(novo);
            setTema(novo);
          }}
          title={tema === "escuro" ? "Tema claro" : "Tema escuro"}
          className="flex size-9 items-center justify-center rounded-full bg-tinta/10 text-tinta backdrop-blur-md transition hover:bg-tinta/20"
        >
          {tema === "escuro" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10">
        {/* marca */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SUAVE }} className="mb-7 flex flex-col items-center text-tinta">
          <Marca tamanho={54} className="rounded-2xl" />
          <span className="mt-3 text-[13px] font-medium uppercase tracking-[0.3em] text-tinta/70">Meu Sistema</span>
        </motion.div>

        {/* cartão de vidro, com a foto saindo por cima */}
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...MOLA_MACIA, delay: 0.08 }} className="relative w-full max-w-[420px] pt-12">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <AvatarEntrada nome={nome} />
          </div>

          <motion.form
            animate={tremer}
            onSubmit={entrar}
            className={cn(
              "rounded-[calc(var(--raio-janela)+4px)] border border-white/40 bg-vidro px-8 pb-7 pt-16 backdrop-blur-vidro backdrop-saturate-150",
              "shadow-[0_40px_100px_-30px_rgba(60,45,30,0.35)] dark:border-white/10 dark:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]",
            )}
          >
            <div className="mb-5 h-6 text-center">
              <AnimatePresence mode="wait">
                {nome && (
                  <motion.p key={nome} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[15px] font-semibold tracking-tight text-texto">
                    Olá, {nome.split(" ")[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              <Campo
                icone={User}
                placeholder="Usuário"
                value={login}
                realce={!!nome}
                erro={erro && !login.trim()}
                onChange={(e) => {
                  setLogin(e.target.value);
                  setErro(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    refSenha.current?.focus();
                  }
                }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <Campo
                ref={refSenha}
                icone={KeyRound}
                type={ver ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                erro={erro && !!login.trim() && !senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro(false);
                }}
                fim={
                  <button type="button" tabIndex={-1} onClick={() => setVer((v) => !v)} aria-label={ver ? "Esconder a senha" : "Mostrar a senha"}
                    className="shrink-0 rounded-lg p-1 text-texto-3 transition hover:bg-campo hover:text-texto">
                    {ver ? <EyeOff className="size-[18px]" strokeWidth={1.75} /> : <Eye className="size-[18px]" strokeWidth={1.75} />}
                  </button>
                }
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <CaixaSelecao rotulo="Lembrar meu login" marcado={lembrar} aoMudar={setLembrar} />
              <button type="button" onClick={() => toast("Aqui abre a troca de senha.")} className="text-[13px] font-medium text-acento-texto hover:underline">
                Esqueci a senha
              </button>
            </div>

            <Botao type="submit" tamanho="g" className="mt-6 w-full" carregando={entrando}>
              Entrar
            </Botao>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-texto-3">
              <span className="size-1.5 rounded-full bg-acento" /> Conectado
            </p>
          </motion.form>
        </motion.div>
      </div>

      <span className="absolute bottom-3 right-4 z-10 text-[11px] text-tinta/45">v1.0.0</span>
    </div>
  );
}

/** A bolinha acima do cartão: iniciais (ou foto) quando acha a pessoa; contorno neutro antes. */
function AvatarEntrada({ nome, tamanho = 96 }: { nome: string; tamanho?: number }) {
  return (
    <div className="relative rounded-full p-[3px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]" style={{ width: tamanho, height: tamanho, background: "rgba(255,255,255,0.85)" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={nome ? iniciais(nome) : "ninguem"}
          className="flex size-full items-center justify-center overflow-hidden rounded-full"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          style={{ background: nome ? corPorTexto(nome) : "var(--primario)" }}
        >
          {nome ? (
            <span className="font-semibold tracking-wide text-white" style={{ fontSize: tamanho / 3 }}>{iniciais(nome)}</span>
          ) : (
            <User className="text-primario-texto/70" style={{ width: tamanho / 2.4, height: tamanho / 2.4 }} strokeWidth={1.5} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Fundo da entrada: clarões suaves que se movem devagar (papel de parede do macOS).
 * ⚠ DESEMPENHO: cada clarão é um degradê radial PRONTO (sem `filter: blur`) e o movimento é só
 * `transform` — a placa de vídeo desliza a camada sem redesenhar. Com blur() + left/top cai a ~30 fps.
 */
const CLAROES = [
  { cor: "221 208 200", tam: 900, x: -280, y: -380, dx: 90, dy: 70, op: 0.3, dur: 26 },
  { cor: "62 154 107", tam: 820, x: 620, y: 300, dx: -80, dy: 70, op: 0.32, dur: 30 },
  { cor: "176 122 79", tam: 720, x: 820, y: -340, dx: 80, dy: 60, op: 0.26, dur: 34 },
  { cor: "110 143 126", tam: 640, x: -220, y: 420, dx: 70, dy: -60, op: 0.22, dur: 28 },
];

export function FundoAnimado() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--cena-2)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--cena-1)_0%,var(--cena-2)_55%,var(--cena-3)_100%)]" />
      {CLAROES.map((c, i) => (
        <motion.div
          key={i}
          className="absolute left-0 top-0 opacity-70 will-change-transform dark:opacity-100"
          style={{
            width: c.tam,
            height: c.tam,
            background: `radial-gradient(circle, rgb(${c.cor} / ${c.op}) 0%, rgb(${c.cor} / ${c.op * 0.45}) 35%, transparent 70%)`,
          }}
          initial={{ x: c.x, y: c.y }}
          animate={{ x: [c.x, c.x + c.dx, c.x], y: [c.y, c.y + c.dy, c.y] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
