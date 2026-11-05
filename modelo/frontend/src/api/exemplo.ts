import { ITENS, type Item } from "@/dados/exemplo";
import { ABERTO_PELO_SISTEMA, api } from "./cliente";

/**
 * O PADRÃO de toda tela: uma função por porta do Python, usada com TanStack Query
 * (`useQuery({ queryKey: ["itens"], queryFn: exemploApi.itens })`).
 * Aberto só pelo Vite (vitrine, sem Python), devolve os dados inventados.
 */
export const exemploApi = {
  itens: () => (ABERTO_PELO_SISTEMA ? api.get<Item[]>("/api/exemplo/itens") : Promise.resolve(ITENS)),
  salvar: (item: Partial<Item>) =>
    ABERTO_PELO_SISTEMA ? api.post<{ ok: boolean }>("/api/exemplo/itens", item) : Promise.resolve({ ok: true }),
};
