import { AnimatePresence, motion } from "motion/react";
import { User } from "lucide-react";
/** No Plus este tipo vem de api/sessao.ts (a pessoa achada pelo login, com foto e iniciais). */
export type UsuarioAchado = { login: string; nome: string; iniciais: string; foto?: string };

const CORES = ["#3E9A6B", "#B07A4F", "#5B6B8C", "#8C5B7A", "#6E8F7E", "#9A7B3E"];

function corDoLogin(login: string) {
  let h = 0;
  for (const c of login) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return CORES[h % CORES.length];
}

/** A bolinha acima do cartão: foto, iniciais ou o contorno neutro. Troca com animação. */
export function Avatar({ usuario, tamanho = 96 }: { usuario: UsuarioAchado | null; tamanho?: number }) {
  const chave = usuario ? usuario.login : "ninguem";
  return (
    <div
      className="relative rounded-full p-[3px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
      style={{ width: tamanho, height: tamanho, background: "rgba(255,255,255,0.85)" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={chave}
          className="flex size-full items-center justify-center overflow-hidden rounded-full"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          style={{ background: usuario ? corDoLogin(usuario.login) : "#2B2A28" }}
        >
          {usuario?.foto ? (
            <img src={usuario.foto} alt="" className="size-full object-cover" />
          ) : usuario ? (
            <span className="font-semibold tracking-wide text-white" style={{ fontSize: tamanho / 3 }}>
              {usuario.iniciais}
            </span>
          ) : (
            <User className="text-bege" style={{ width: tamanho / 2.4, height: tamanho / 2.4 }} strokeWidth={1.5} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
