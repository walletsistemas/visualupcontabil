import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { Database, Eye, EyeOff, KeyRound, Moon, Sun, User } from "lucide-react";
import { toast } from "sonner";
import { Botao } from "@/componentes/ui/botao";
import { Campo } from "@/componentes/ui/campo";
import { CaixaSelecao } from "@/componentes/ui/caixa-selecao";
import { NOME_SISTEMA } from "@/componentes/layout/MenuLateral";
import { trocarTema, type Tema } from "@/tema/tema";
import { cn, iniciais } from "@/lib/utils";
import { Avatar, type UsuarioAchado } from "./Avatar";
import { FundoAnimado } from "./FundoAnimado";

/**
 * TELA DE ENTRADA — o MESMO desenho do Plus (frontend/src/rotas/login/TelaLogin.tsx):
 * fundo com clarões, logo + nome do sistema em caixa alta, cartão de vidro com a foto/iniciais
 * SAINDO por cima e trocando enquanto a pessoa digita, «Olá, Fulano», campos de 48 px, aviso de
 * Caps Lock, «Lembrar meu login», «Mudar minha senha», Entrar, «Base de Dados» e a linha de estado
 * da base embaixo. O cartão TREME quando falta algo.
 * Aqui a lógica é de mentira (qualquer usuário entra); na cirurgia, ligue nas portas do Python
 * como no Plus (sessaoApi.info, .usuario, .entrar).
 */
export function TelaLogin({ aoEntrar }: { aoEntrar: () => void }) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [caps, setCaps] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erroCampo, setErroCampo] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [tema, setTema] = useState<Tema>(() => (document.documentElement.classList.contains("escuro") ? "escuro" : "claro"));
  const refSenha = useRef<HTMLInputElement>(null);
  const tremer = useAnimationControls();
  // no Plus a pessoa é achada no Python pelo login (com foto); aqui, qualquer nome com 2+ letras
  const nome = login.trim().length >= 2 ? login.trim().replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : "";
  const achado: UsuarioAchado | null = nome ? { login: login.trim().toLowerCase(), nome, iniciais: iniciais(nome) } : null;

  function falhar(mensagem: string) {
    setErroCampo(true);
    tremer.start({ x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.45 } });
    toast.error(mensagem);
  }

  function entrar(e?: React.FormEvent) {
    e?.preventDefault();
    if (!login.trim()) return falhar("Informe o usuário.");
    if (!senha) return falhar("Informe a senha.");
    setEntrando(true);
    setErroCampo(false);
    setTimeout(aoEntrar, 500);
  }

  return (
    <div className="relative flex h-full flex-col">
      <FundoAnimado />

      {/* topo: botão de tema */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={() => setTema(trocarTema(tema))}
          title={tema === "escuro" ? "Tema claro" : "Tema escuro"}
          className="flex size-9 items-center justify-center rounded-full bg-tinta/10 text-tinta backdrop-blur-md transition hover:bg-tinta/20"
        >
          {tema === "escuro" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10">
        {/* marca */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 flex flex-col items-center"
        >
          <img src="/logo_simbolo.png" alt="UP" className="hidden h-[54px] select-none dark:block" draggable={false} />
          <img src="/logo_simbolo_escura.png" alt="UP" className="h-[54px] select-none dark:hidden" draggable={false} />
          <span className="mt-3 text-[13px] font-medium uppercase tracking-[0.3em] text-tinta/70">{NOME_SISTEMA}</span>
        </motion.div>

        {/* cartão de vidro, com a foto saindo por cima */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.08 }}
          className="relative w-full max-w-[420px] pt-12"
        >
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <Avatar usuario={achado} />
          </div>

          <motion.form
            animate={tremer}
            onSubmit={entrar}
            className={cn(
              "rounded-[28px] border border-white/40 bg-vidro px-8 pb-7 pt-16 backdrop-blur-2xl backdrop-saturate-150",
              "shadow-[0_40px_100px_-30px_rgba(60,45,30,0.35)] dark:border-white/10 dark:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]",
            )}
          >
            <div className="mb-5 h-6 text-center">
              <AnimatePresence mode="wait">
                {achado && (
                  <motion.p
                    key={achado.login}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[15px] font-semibold tracking-tight text-texto"
                  >
                    Olá, {achado.nome.split(" ")[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              <Campo
                icone={User}
                placeholder="Usuário"
                value={login}
                realce={!!achado}
                erro={erroCampo && !login.trim()}
                onChange={(e) => {
                  setLogin(e.target.value);
                  setErroCampo(false);
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
              <div className="relative">
                <Campo
                  ref={refSenha}
                  icone={KeyRound}
                  type={verSenha ? "text" : "password"}
                  onKeyDown={(e) => setCaps(e.getModifierState("CapsLock"))}
                  onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
                  onBlur={() => setCaps(false)}
                  fim={
                    <button type="button" tabIndex={-1} onClick={() => setVerSenha((v) => !v)}
                      title={verSenha ? "Esconder a senha" : "Mostrar a senha"} aria-label={verSenha ? "Esconder a senha" : "Mostrar a senha"}
                      className="shrink-0 rounded-lg p-1 text-texto-3 transition hover:bg-campo hover:text-texto">
                      {verSenha ? <EyeOff className="size-[18px]" strokeWidth={1.75} /> : <Eye className="size-[18px]" strokeWidth={1.75} />}
                    </button>
                  }
                  placeholder="Senha"
                  value={senha}
                  erro={erroCampo && !!login.trim()}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    setErroCampo(false);
                  }}
                />
                <AnimatePresence>
                  {caps && (
                    <motion.div role="status" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute left-3 top-full z-10 mt-2 rounded-xl bg-texto px-3 py-1.5 text-[12.5px] font-medium text-superficie shadow-lg">
                      <span className="absolute -top-1 left-5 size-2 rotate-45 bg-texto" />
                      Caps Lock está ligado
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <CaixaSelecao rotulo="Lembrar meu login" marcado={lembrar} aoMudar={setLembrar} />
              <button type="button" onClick={() => toast("No Plus, aqui abre a troca de senha.")} className="text-[13px] font-medium text-verde-texto hover:underline">
                Mudar minha senha
              </button>
            </div>

            <Botao type="submit" tamanho="g" className="mt-6 w-full" carregando={entrando}>
              Entrar
            </Botao>

            <div className="mt-3 flex gap-2">
              <Botao type="button" variante="leve" className="flex-1" onClick={() => toast("No Plus, aqui escolhe a pasta da base de dados.")}>
                <Database className="size-4" /> Base de Dados
              </Botao>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[12px] text-texto-3">
              <span className="size-1.5 shrink-0 rounded-full bg-verde" />
              Base de dados conectada
            </p>
          </motion.form>
        </motion.div>
      </div>

      <span className="absolute bottom-3 right-4 z-10 text-[11px] text-tinta/45">v1.0.0</span>
    </div>
  );
}
