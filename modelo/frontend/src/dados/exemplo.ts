/**
 * Dados INVENTADOS, só para a vitrine ter o que mostrar. Na cirurgia, cada tela troca isto
 * pela chamada ao Python (ver `api/exemplo.ts`).
 */
export type Situacao = "concluido" | "andamento" | "atrasado" | "pendente";

export type Item = {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  responsavel: string;
  equipe: string[];
  situacao: Situacao;
  progresso: number;
  prazo: string;
  valor: number;
  cidade: string;
  contato: string;
  observacao: string;
};

const NOMES = [
  "Projeto Alfa", "Horizonte Azul", "Vale Verde", "Aurora Norte", "Pedra Branca", "Rio Claro",
  "Monte Sereno", "Brisa do Mar", "Campo Aberto", "Serra Alta", "Lago Sul", "Porto Novo",
  "Estrela Guia", "Ponte Leste", "Jardim Real", "Cais do Sol", "Mirante Oeste", "Bosque Antigo",
];
const PESSOAS = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes"];
const CATEGORIAS = ["Categoria A", "Categoria B", "Categoria C"];
const CIDADES = ["Curitiba", "Recife", "Belém", "Goiânia", "Natal", "Vitória"];
const SITUACOES: Situacao[] = ["concluido", "andamento", "atrasado", "pendente"];

export const ITENS: Item[] = NOMES.map((nome, i) => ({
  id: i + 1,
  nome,
  codigo: `${String(1000 + i * 37).padStart(4, "0")}-${(i * 7) % 10}`,
  categoria: CATEGORIAS[i % 3],
  responsavel: PESSOAS[i % PESSOAS.length],
  equipe: [PESSOAS[(i + 1) % 6], PESSOAS[(i + 3) % 6], ...(i % 2 ? [PESSOAS[(i + 4) % 6]] : [])],
  situacao: SITUACOES[(i * 5) % 4],
  progresso: { concluido: 100, andamento: [64, 30, 82][i % 3], atrasado: [45, 70, 20][i % 3], pendente: 0 }[SITUACOES[(i * 5) % 4]],
  prazo: `2026-${String((i % 11) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
  valor: 1200 + ((i * 7919) % 48000),
  cidade: CIDADES[i % CIDADES.length],
  contato: `contato${i + 1}@exemplo.com`,
  observacao: i % 3 ? "" : "Texto livre de observação, para mostrar como fica um campo longo dentro da ficha.",
}));

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  concluido: "Concluído",
  andamento: "Em andamento",
  atrasado: "Atrasado",
  pendente: "Pendente",
};

/** Cada situação tem uma cor fixa de gráfico (tokens --g-*). */
export const COR_SITUACAO: Record<Situacao, string> = {
  concluido: "var(--g-1)",
  andamento: "var(--g-5)",
  atrasado: "var(--g-3)",
  pendente: "var(--g-4)",
};

export const PESSOAS_EXEMPLO = PESSOAS;
