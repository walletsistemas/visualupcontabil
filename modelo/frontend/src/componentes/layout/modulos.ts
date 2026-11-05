import { FormInput, LayoutDashboard, LayoutGrid, type LucideIcon, Palette, Table2 } from "lucide-react";

/**
 * O MENU LATERAL — mesmo formato do Plus (frontend/src/componentes/layout/modulos.ts).
 * Cada sistema troca as SEÇÕES e os MÓDULOS pelos seus; o formato não muda. Quando os sistemas
 * forem unidos ao Plus, estas linhas entram no SECOES de lá.
 */
export type Modulo = {
  chave: string;
  nome: string;
  icone: LucideIcon;
  descricao: string;
  /** Palavras extras para a busca rápida (Ctrl+K). */
  busca?: string;
  /** Número na bolinha ao lado do nome (pendências). No Plus vem do resumo do dia. */
  contador?: number;
};

export type Secao = { titulo: string; modulos: Modulo[]; soAdmin?: boolean };

export const SECOES: Secao[] = [
  {
    titulo: "Gestão",
    modulos: [
      { chave: "painel", nome: "Painel", icone: LayoutDashboard, descricao: "Indicadores e gráficos do mês.", busca: "inicio dashboard resumo visao geral" },
      { chave: "cadastro", nome: "Cadastro", icone: LayoutGrid, descricao: "Cartões ou lista, busca e ficha lateral.", busca: "itens cartoes ficha", contador: 3 },
    ],
  },
  {
    titulo: "Operação",
    modulos: [{ chave: "tabela", nome: "Tabela", icone: Table2, descricao: "Tabela densa com zebra, ordenação e total.", busca: "planilha grade" }],
  },
  {
    titulo: "Modelos",
    soAdmin: true,
    modulos: [
      { chave: "formulario", nome: "Formulário", icone: FormInput, descricao: "Campos, listas, datas e validação.", busca: "form cadastro novo" },
      { chave: "pecas", nome: "Todas as peças", icone: Palette, descricao: "Catálogo de botões, selos, avisos e janelas.", busca: "componentes catalogo botoes" },
    ],
  },
];

/** Seções que este usuário vê (as de administrador só para quem é). */
export function secoesDoUsuario(usuario?: { perfil: string }) {
  return SECOES.filter((s) => !s.soAdmin || usuario?.perfil === "admin");
}

export function acharModulo(chave: string): Modulo | undefined {
  return SECOES.flatMap((s) => s.modulos).find((m) => m.chave === chave);
}
