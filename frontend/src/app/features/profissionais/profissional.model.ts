export const FUNCOES = ['banhista', 'tosador', 'veterinario'] as const;
export type Funcao = (typeof FUNCOES)[number];
export interface Profissional {
  _id: string;
  nome: string;
  funcao: Funcao;
  telefone: string;
  email: string;
  crmv?: string;
  ativo: boolean;
}
export type ProfissionalEntrada = Omit<Profissional, '_id' | 'ativo'>;
