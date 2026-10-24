
import { Injectable, signal } from '@angular/core';
import { Pet, PetEntrada } from '../pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  // Lista inicial fictícia para desenvolver o módulo sem o backend.
  private readonly petsSignal = signal<Pet[]>([
    {
      _id: '1',
      nome: 'Rex',
      especie: 'cachorro',
      raca: 'Labrador',
      dataNascimento: '2022-05-10',
      tutor: '1',
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Mimi',
      especie: 'gato',
      raca: 'Siamês',
      dataNascimento: '2023-08-15',
      tutor: '2',
      ativo: true,
    },
  ]);

  // Expõe a lista como um signal somente para leitura.
  readonly pets = this.petsSignal.asReadonly();

  // Retorna um pet específico pelo ID.
  buscarPorId(id: string): Pet | undefined {
    return this.petsSignal().find((pet) => pet._id === id);
  }

  // Cadastra um novo pet.
  criar(dados: PetEntrada): void {
    const novoPet: Pet = {
      ...dados,
      _id: crypto.randomUUID(),
    };

    this.petsSignal.update((pets) => [...pets, novoPet]);
  }

  // Atualiza os dados de um pet existente.
  atualizar(id: string, dados: PetEntrada): void {
    this.petsSignal.update((pets) =>
      pets.map((pet) =>
        pet._id === id ? { ...pet, ...dados, _id: id } : pet,
      ),
    );
  }

  // Exclui um pet da lista.
  excluir(id: string): void {
    this.petsSignal.update((pets) =>
      pets.filter((pet) => pet._id !== id),
    );
  }
}
