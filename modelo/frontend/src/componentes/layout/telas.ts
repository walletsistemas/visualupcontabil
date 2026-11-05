import { FormInput, LayoutDashboard, LayoutGrid, type LucideIcon, Palette, Table2 } from "lucide-react";

/**
 * O MAPA do sistema: seções do menu lateral e as telas de cada uma.
 * A busca Ctrl+K e o menu leem daqui. Na cirurgia, cada tela antiga do Qt vira uma linha aqui.
 */
export type Tela = {
  chave: string;
  nome: string;
  icone: LucideIcon;
  descricao: string;
  /** palavras extras para a busca rápida */
  busca?: string;
  /** número na bolinha ao lado do nome (pendências) */
  contador?: number;
};

export type Secao = { titulo: string; telas: Tela[] };

export const SECOES: Secao[] = [
  {
    titulo: "Principal",
    telas: [
      { chave: "painel", nome: "Painel", icone: LayoutDashboard, descricao: "Indicadores e gráficos do mês.", busca: "inicio dashboard resumo" },
      { chave: "lista", nome: "Cadastro", icone: LayoutGrid, descricao: "Cartões ou lista, busca e ficha lateral.", busca: "itens cartoes ficha", contador: 3 },
      { chave: "tabela", nome: "Tabela", icone: Table2, descricao: "Tabela densa com zebra, ordenação e filtro.", busca: "planilha grade" },
    ],
  },
  {
    titulo: "Modelos",
    telas: [
      { chave: "formulario", nome: "Formulário", icone: FormInput, descricao: "Campos, listas, datas e validação.", busca: "form cadastro novo" },
      { chave: "pecas", nome: "Todas as peças", icone: Palette, descricao: "Catálogo de botões, selos, avisos e janelas.", busca: "componentes catalogo botoes" },
    ],
  },
];

export const acharTela = (chave: string) => SECOES.flatMap((s) => s.telas).find((t) => t.chave === chave);
