import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { avisar } from "@/lib/avisos";
import { cn } from "@/lib/utils";
import { hojeIso, MESES } from "@/lib/competencia";

const SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"]; // começa na segunda, como no Brasil
const SEMANA_CURTA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const iso = (a: number, m: number, d: number) => `${a}-${doisDigitos(m)}-${doisDigitos(d)}`;

/** «2026-10-17» → «sex, 17 de outubro de 2026» */
export function dataPorExtenso(v: string) {
  if (!v) return "";
  const [a, m, d] = v.split("-").map(Number);
  return `${SEMANA_CURTA[new Date(a, m - 1, d).getDay()]}, ${d} de ${MESES[m - 1]} de ${a}`;
}

function Gatilho({
  rotulo, texto, vazio, icone: Icone, desligado, aberto, aoLimpar, titulo,
}: {
  rotulo: string;
  texto: string;
  vazio: string;
  icone: typeof Clock;
  desligado?: boolean;
  aberto: boolean;
  aoLimpar?: () => void;
  titulo?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5" title={titulo}>
      <span className="text-[13px] font-medium text-texto-2">{rotulo}</span>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-10 items-center gap-2 rounded-xl border border-transparent bg-campo px-3 text-left text-[14px] outline-none transition",
            "focus-visible:border-verde/50 focus-visible:ring-4 focus-visible:ring-verde/15",
            aberto && "border-verde/50 bg-superficie ring-4 ring-verde/15",
            desligado && "opacity-60",
          )}
        >
          <Icone className={cn("size-4 shrink-0", texto ? "text-verde-texto" : "text-texto-3")} />
          <span className={cn("flex-1 truncate", texto ? "text-texto" : "text-texto-3")}>{texto || vazio}</span>
          {texto && aoLimpar && !desligado && (
            <span
              role="button"
              title="Limpar"
              onClick={(e) => {
                e.stopPropagation();
                aoLimpar();
              }}
              className="flex size-5 items-center justify-center rounded-md text-texto-3 opacity-0 transition hover:bg-campo hover:text-texto group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </span>
          )}
        </button>
      </Popover.Trigger>
    </div>
  );
}

const CAIXA =
  "z-[60] rounded-2xl border border-borda bg-superficie p-3 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.4)] outline-none data-[state=open]:animate-in";

/** Escolher um dia: calendário do sistema, em português, no lugar do do Windows. */
export function SeletorData({
  rotulo, valor, aoMudar, desligado, titulo, vazio = "Sem prazo", motivo, gatilho,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  desligado?: boolean;
  titulo?: string;
  vazio?: string;
  /** travado: o balão que explica por quê, ao clicar */
  motivo?: string;
  /** botão próprio no lugar do campo com rótulo (ex.: a etapa da rotina) */
  gatilho?: React.ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const base = valor || hojeIso();
  const [visto, setVisto] = useState({ a: +base.slice(0, 4), m: +base.slice(5, 7) });
  const hoje = hojeIso();

  const abrir = (v: boolean) => {
    if (v && desligado) return motivo && avisar(motivo);
    if (v) setVisto({ a: +(valor || hoje).slice(0, 4), m: +(valor || hoje).slice(5, 7) });
    setAberto(v);
  };
  const passo = (p: number) =>
    setVisto(({ a, m }) => (m + p < 1 ? { a: a - 1, m: 12 } : m + p > 12 ? { a: a + 1, m: 1 } : { a, m: m + p }));

  const primeiro = (new Date(visto.a, visto.m - 1, 1).getDay() + 6) % 7;
  const total = new Date(visto.a, visto.m, 0).getDate();
  const anterior = new Date(visto.a, visto.m - 1, 0).getDate();
  const celulas: { d: number; chave: string; fora: boolean }[] = [];
  for (let i = primeiro - 1; i >= 0; i--) {
    const pm = visto.m === 1 ? { a: visto.a - 1, m: 12 } : { a: visto.a, m: visto.m - 1 };
    celulas.push({ d: anterior - i, chave: iso(pm.a, pm.m, anterior - i), fora: true });
  }
  for (let d = 1; d <= total; d++) celulas.push({ d, chave: iso(visto.a, visto.m, d), fora: false });
  const pm = visto.m === 12 ? { a: visto.a + 1, m: 1 } : { a: visto.a, m: visto.m + 1 };
  for (let d = 1; celulas.length % 7 || celulas.length < 42; d++) celulas.push({ d, chave: iso(pm.a, pm.m, d), fora: true });

  const atalhos: [string, number][] = [["Hoje", 0], ["Amanhã", 1], ["Em 7 dias", 7]];
  const somar = (n: number) => {
    const h = new Date();
    h.setDate(h.getDate() + n);
    return hojeIso(h);
  };
  const escolher = (v: string) => {
    aoMudar(v);
    setAberto(false);
  };

  return (
    <Popover.Root open={aberto} onOpenChange={abrir}>
      {gatilho ? <Popover.Trigger asChild>{gatilho}</Popover.Trigger> : <Gatilho
        rotulo={rotulo}
        texto={dataPorExtenso(valor)}
        vazio={vazio}
        icone={CalendarDays}
        desligado={desligado}
        aberto={aberto}
        aoLimpar={() => aoMudar("")}
        titulo={titulo}
      />}
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} className={cn(CAIXA, "w-[300px]")}>
          <div className="mb-2 flex items-center justify-between">
            <p className="pl-1 text-[14px] font-semibold capitalize">
              {MESES[visto.m - 1]} <span className="font-normal text-texto-3">{visto.a}</span>
            </p>
            <div className="flex">
              <button aria-label="Mês anterior" type="button" onClick={() => passo(-1)} className="flex size-8 items-center justify-center rounded-lg text-texto-2 hover:bg-campo">
                <ChevronLeft className="size-4" />
              </button>
              <button aria-label="Próximo mês" type="button" onClick={() => passo(1)} className="flex size-8 items-center justify-center rounded-lg text-texto-2 hover:bg-campo">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-texto-3">
            {SEMANA.map((s, i) => <span key={i} className="py-1">{s}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {celulas.map((c) => {
              const sel = c.chave === valor;
              const eHoje = c.chave === hoje;
              return (
                <button
                  type="button"
                  key={c.chave}
                  onClick={() => escolher(c.chave)}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-xl text-[13px] tabular-nums transition",
                    sel ? "bg-verde font-semibold text-white shadow-[0_4px_12px_-4px_rgba(62,154,107,0.7)]" : "hover:bg-campo",
                    !sel && c.fora && "text-texto-3/50",
                    !sel && !c.fora && "text-texto",
                    !sel && eHoje && "font-semibold text-verde-texto",
                  )}
                >
                  {c.d}
                  {eHoje && !sel && <span className="absolute bottom-1 size-1 rounded-full bg-verde" />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-1.5 border-t border-borda pt-3">
            {atalhos.map(([r, n]) => (
              <button
                type="button"
                key={r}
                onClick={() => escolher(somar(n))}
                className="h-8 flex-1 rounded-lg bg-campo text-[12px] font-medium text-texto-2 transition hover:bg-verde/12 hover:text-verde-texto"
              >
                {r}
              </button>
            ))}
            {valor && (
              <button
                type="button"
                onClick={() => escolher("")}
                className="h-8 rounded-lg px-2.5 text-[12px] font-medium text-texto-3 transition hover:bg-campo hover:text-vermelho"
              >
                Limpar
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** «9» → 09:00 · «930» → 09:30 · «9:30» → 09:30 · «1745» → 17:45 (null se não for hora). */
function lerHora(v: string): [number, number] | null {
  let h: number, m: number;
  if (v.includes(":") || v.includes("h")) {
    const [a, b = "0"] = v.split(/[:h]/);
    h = +a;
    m = +(b || 0);
  } else {
    const n = v.replace(/\D/g, "");
    if (!n || n.length > 4) return null;
    h = n.length <= 2 ? +n : +n.slice(0, n.length - 2);
    m = n.length <= 2 ? 0 : +n.slice(-2);
  }
  return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h < 24 && m >= 0 && m < 60 ? [h, m] : null;
}

/** Escolher a hora: horários comuns num toque e, se precisar, o minuto exato. Sempre 24 h. */
export function SeletorHora({
  rotulo, valor, aoMudar, desligado, titulo, motivo,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  desligado?: boolean;
  titulo?: string;
  motivo?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const abrir = (v: boolean) => (v && desligado ? motivo && avisar(motivo) : setAberto(v));
  const [h, m] = valor ? valor.split(":").map(Number) : [NaN, NaN];
  const horas = Array.from({ length: 15 }, (_, i) => i + 7); // 07h às 21h
  const minutos = [0, 15, 30, 45];
  const definir = (hh: number, mm: number) => aoMudar(`${doisDigitos(hh)}:${doisDigitos(mm)}`);

  return (
    <Popover.Root open={aberto} onOpenChange={abrir}>
      <Gatilho
        rotulo={rotulo}
        texto={valor}
        vazio="Sem hora"
        icone={Clock}
        desligado={desligado}
        aberto={aberto}
        aoLimpar={() => aoMudar("")}
        titulo={titulo}
      />
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className={cn(CAIXA, "w-[296px]")}>
          <p className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-texto-3">Hora</p>
          <div className="grid grid-cols-5 gap-1">
            {horas.map((hh) => (
              <button
                type="button"
                key={hh}
                onClick={() => definir(hh, Number.isNaN(m) ? 0 : m)}
                className={cn(
                  "h-9 rounded-xl text-[13px] font-medium tabular-nums transition",
                  hh === h ? "bg-verde text-white" : "bg-campo/60 text-texto-2 hover:bg-campo hover:text-texto",
                )}
              >
                {doisDigitos(hh)}h
              </button>
            ))}
          </div>
          <p className="mb-2 mt-3 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-texto-3">Minutos</p>
          <div className="grid grid-cols-4 gap-1">
            {minutos.map((mm) => (
              <button
                type="button"
                key={mm}
                disabled={Number.isNaN(h)}
                onClick={() => {
                  definir(h, mm);
                  setAberto(false);
                }}
                className={cn(
                  "h-9 rounded-xl text-[13px] font-medium tabular-nums transition disabled:opacity-40",
                  mm === m ? "bg-verde text-white" : "bg-campo/60 text-texto-2 hover:bg-campo hover:text-texto",
                )}
              >
                :{doisDigitos(mm)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-borda pt-3">
            <span className="text-[12px] text-texto-3">Outro horário</span>
            <input
              inputMode="numeric"
              placeholder="00:00"
              defaultValue={valor}
              key={valor}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (!v || v === valor) return;
                const hm = lerHora(v);
                if (hm) definir(hm[0], hm[1]);
                else avisar(`«${v}» não é um horário válido. Use, por exemplo, 9, 9:30 ou 1745.`);
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), (e.target as HTMLInputElement).blur(), setAberto(false))}
              className="h-8 w-[72px] rounded-lg bg-campo px-2 text-center text-[13px] tabular-nums outline-none focus:ring-2 focus:ring-verde/30"
            />
            {valor && (
              <button
                type="button"
                onClick={() => {
                  aoMudar("");
                  setAberto(false);
                }}
                className="ml-auto h-8 rounded-lg px-2.5 text-[12px] font-medium text-texto-3 hover:bg-campo hover:text-vermelho"
              >
                Limpar
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
