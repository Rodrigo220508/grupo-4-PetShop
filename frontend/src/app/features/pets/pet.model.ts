// Espécies permitidas pelo manual do projeto.
export const ESPECIES = ['cachorro', 'gato', 'ave', 'outro'] as const;

export type Especie = (typeof ESPECIES)[number];

// Representa um pet cadastrado no sistema.
export interface Pet {
  _id: string;
  nome: string;
  especie: Especie;
  raca?: string;
  dataNascimento?: string;
  tutor: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Dados enviados para criar ou editar um pet.
// O ID e as datas são gerenciados pelo sistema.
export type PetEntrada = Omit<
  Pet,
  '_id' | 'createdAt' | 'updatedAt'
>;