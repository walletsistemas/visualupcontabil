import { useState, type ReactNode } from "react";
import { trocarTema, type Tema } from "@/tema/tema";
import { cn } from "@/lib/utils";
import { BuscaRapida } from "./BuscaRapida";
import { MenuLateral } from "./MenuLateral";

/**
 * A JANELA PRINCIPAL — a mesma do Plus (componentes/layout/JanelaPrincipal.tsx), sem a sincronia
 * de 20 s e os avisos que dependem do servidor de lá: menu lateral à esquerda e a tela no resto.
 * SEM faixa de título em cima: a tela usa o espaço todo (a barra de título é a do Windows).
 */
export function JanelaPrincipal({ modulo, aoIr, aoSair, usuario, children }: {
  modulo: string;
  aoIr: (chave: string) => void;
  /** sem login: não passe `aoSair` nem `usuario` (o menu mostra só «Preferências») */
  aoSair?: () => void;
  usuario?: { nome: string; cargo: string; perfil: string };
  children: ReactNode;
}) {
  const [tema, setTema] = useState<Tema>(() => (document.documentElement.classList.contains("escuro") ? "escuro" : "claro"));
  const mudarTema = () => setTema((t) => trocarTema(t));

  return (
    <div className="flex h-full bg-fundo">
      <MenuLateral usuario={usuario} modulo={modulo} tema={tema} aoIr={aoIr} aoTrocarTema={mudarTema} aoSair={aoSair} />
      {/* @container: as telas se ajustam à LARGURA DISPONÍVEL (@3xl:...), não à da janela */}
      <main className="@container min-w-0 flex-1 overflow-auto">{children}</main>
      <BuscaRapida usuario={usuario} aoIr={aoIr} aoTrocarTema={mudarTema} aoSair={aoSair} />
    </div>
  );
}

/**
 * Cabeçalho padrão das telas: título + subtítulo à esquerda, ações à direita.
 * Abaixo dele, a BARRA DE FERRAMENTAS (filtros, busca, contagem, botão principal).
 */
export function CabecalhoTela({ titulo, subtitulo, acoes, children, className }: {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
  /** a barra de ferramentas */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 pb-3 pt-6", className)}>
      <div className="flex items-end gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[24px] font-semibold leading-tight tracking-tight">{titulo}</h1>
          {subtitulo && <p className="mt-1 text-[13.5px] text-texto-2">{subtitulo}</p>}
        </div>
        {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
      </div>
      {children && <div className="mt-4 flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
