export interface Tutor {
  _id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TutorEntrada = Omit<
  Tutor,
  '_id' | 'ativo' | 'createdAt' | 'updatedAt'
> & {
  ativo?: boolean;
};