import { useState } from "react";
import { motion } from "motion/react";
import { FileDown } from "lucide-react";
import { CabecalhoTela } from "@/componentes/layout/JanelaPrincipal";
import { Botao } from "@/componentes/ui/botao";
import { Segmentado } from "@/componentes/ui/marcadores";
import { SeletorMes } from "@/componentes/ui/seletor-mes";
import { Avatar } from "@/componentes/ui/pecas";
import { BarraPartes, Barras, Chave, Colunas, FaixaIndicadores, Indicador, Painel as Cartao, Rosca, pct } from "@/componentes/graficos/graficos";
import { COR_SITUACAO, ITENS, PESSOAS_EXEMPLO, ROTULO_SITUACAO, type Situacao } from "@/dados/exemplo";
import { mesAtual } from "@/lib/datas";
import { cascata } from "@/tema/movimento";
import type { IrPara } from "@/componentes/layout/telas";

const ORDEM: Situacao[] = ["concluido", "andamento", "atrasado", "pendente"];

/**
 * PAINEL (dashboard): saudação, faixa de indicadores, e uma grade de cartões de gráfico
 * que se reorganiza pela largura disponível (@container).
 */
export function Painel({ aoIr }: { aoIr: IrPara }) {
  const [mes, setMes] = useState(mesAtual());
  const [visao, setVisao] = useState<"eu" | "equipe">("equipe");
  const cont = Object.fromEntries(ORDEM.map((s) => [s, ITENS.filter((i) => i.situacao === s).length])) as Record<Situacao, number>;
  const total = ITENS.length;
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="pb-10">
      <CabecalhoTela
        titulo={`${saudacao}, Ana`}
        subtitulo="Este é o resumo do mês. Clique num número para ver a lista."
        acoes={<Botao variante="leve" tamanho="p" className="h-9"><FileDown className="size-4" /> Relatório</Botao>}
      >
        <SeletorMes valor={mes} atual={mesAtual()} aoMudar={setMes} />
        <Segmentado valor={visao} opcoes={[["eu", "Só eu"], ["equipe", "Equipe"]]} aoMudar={setVisao} />
      </CabecalhoTela>

      <div className="flex flex-col gap-3.5 px-6">
        <motion.div {...cascata(0)}>
          <FaixaIndicadores>
            <Indicador cor="var(--g-1)" rotulo="Concluídos" valor={cont.concluido} referencia={`de ${total}`} explica="entregues neste mês" aoClicar={() => aoIr("lista")} />
            <Indicador cor="var(--g-5)" rotulo="Em andamento" valor={cont.andamento} referencia={`${pct(cont.andamento, total)}%`} explica="com alguém trabalhando" aoClicar={() => aoIr("lista", { filtro: "abertos" })} />
            <Indicador cor="var(--g-3)" rotulo="Atrasados" valor={cont.atrasado} explica="passaram do prazo" alerta aoClicar={() => aoIr("lista", { filtro: "abertos" })} />
            <Indicador cor="var(--g-4)" rotulo="Pendentes" valor={cont.pendente} explica="ainda não começaram" />
          </FaixaIndicadores>
        </motion.div>

        <div className="grid gap-3.5 @4xl:grid-cols-2">
          <motion.div {...cascata(1)}>
            <Cartao
              titulo="Situação geral"
              mede="Todos os itens do mês, pela situação."
              legenda={ORDEM.map((s) => <Chave key={s} cor={COR_SITUACAO[s]} texto={ROTULO_SITUACAO[s]} valor={cont[s]} />)}
              leitura={<>Mais da metade já saiu do lugar: <b>{pct(total - cont.pendente, total)}%</b> concluídos ou em andamento.</>}
              className="h-full"
            >
              <div className="flex items-center gap-6">
                <Rosca partes={ORDEM.map((s) => ({ valor: cont[s], cor: COR_SITUACAO[s] }))} centro={`${pct(cont.concluido, total)}%`} centroSub="concluído" />
                <div className="flex flex-1 flex-col gap-3">
                  {ORDEM.map((s) => (
                    <div key={s}>
                      <div className="mb-1 flex justify-between text-[12px]"><span className="text-texto-2">{ROTULO_SITUACAO[s]}</span><span className="tabular-nums">{cont[s]}</span></div>
                      <BarraPartes partes={[{ valor: cont[s], cor: COR_SITUACAO[s] }, { valor: total - cont[s], cor: "transparent" }]} altura={6} />
                    </div>
                  ))}
                </div>
              </div>
            </Cartao>
          </motion.div>

          <motion.div {...cascata(2)}>
            <Cartao titulo="Por pessoa" mede="Itens de cada responsável, pela situação." leitura="Quem tem mais vermelho precisa de ajuda primeiro." className="h-full">
              <Barras
                itens={PESSOAS_EXEMPLO.map((p) => {
                  const meus = ITENS.filter((i) => i.responsavel === p);
                  return {
                    nome: p,
                    detalhe: `${meus.length} itens`,
                    escala: 4,
                    valor: `${pct(meus.filter((i) => i.situacao === "concluido").length, meus.length)}% feito`,
                    partes: ORDEM.map((s) => ({ valor: meus.filter((i) => i.situacao === s).length, cor: COR_SITUACAO[s] })),
                  };
                })}
              />
            </Cartao>
          </motion.div>
        </div>

        <motion.div {...cascata(3)}>
          <Cartao
            titulo="Entregas por dia"
            mede="Quantos itens foram entregues em cada dia útil das duas últimas semanas."
            legenda={<><Chave cor="var(--g-1)" texto="No prazo" /><Chave cor="var(--g-2)" texto="Com atraso" /></>}
            leitura="O dia mais cheio foi a quinta-feira da semana passada."
          >
            <Colunas
              colunas={Array.from({ length: 14 }, (_, d) => ({
                rotulo: String(d + 1).padStart(2, "0"),
                fundo: d % 7 >= 5,
                destaque: d === 10,
                partes: [
                  { nome: "No prazo", cor: "var(--g-1)", valor: d % 7 >= 5 ? 0 : ((d * 7) % 9) + 2 },
                  { nome: "Com atraso", cor: "var(--g-2)", valor: d % 7 >= 5 ? 0 : (d * 3) % 4 },
                ],
              }))}
            />
          </Cartao>
        </motion.div>

        <motion.div {...cascata(4)} className="flex items-center gap-3 rounded-cartao border border-borda bg-superficie px-5 py-4 shadow-cartao">
          <span className="flex -space-x-2">{PESSOAS_EXEMPLO.slice(0, 4).map((p) => <Avatar key={p} nome={p} tamanho={30} anel />)}</span>
          <p className="text-[13px] text-texto-2"><b className="text-texto">4 pessoas</b> mexeram em itens hoje.</p>
        </motion.div>
      </div>
    </div>
  );
}
