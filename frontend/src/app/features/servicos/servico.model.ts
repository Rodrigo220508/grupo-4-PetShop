export const CATEGORIAS_SERVICO = ['banho', 'tosa', 'veterinario', 'outros'] as const;
export type CategoriaServico = (typeof CATEGORIAS_SERVICO)[number];
export interface Servico {
  _id: string;
  nome: string;
  categoria: CategoriaServico;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
}
export type ServicoEntrada = Omit<Servico, '_id' | 'ativo'>;
