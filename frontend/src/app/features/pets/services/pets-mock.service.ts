
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Especie, Pet, PetEntrada } from '../pet.model';
import { PetsService } from './pets.service';

/**
 * Serviço MOCK de pets.
 * Guarda os dados em memória e simula o tempo de resposta da API.
 */
@Injectable()
export class PetsMockService extends PetsService {
  private pets: Pet[] = [
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
    {
      _id: '3',
      nome: 'Pipoca',
      especie: 'ave',
      raca: 'Calopsita',
      tutor: '1',
      ativo: true,
    },
  ];

  private proximoId = 4;
  private readonly atraso = 400;

  listar(especie?: Especie): Observable<Pet[]> {
    const lista = especie
      ? this.pets.filter((pet) => pet.especie === especie)
      : this.pets;

    return of(
      [...lista].sort((a, b) => a.nome.localeCompare(b.nome)),
    ).pipe(delay(this.atraso));
  }

  buscarPorId(id: string): Observable<Pet> {
    const pet = this.pets.find((item) => item._id === id);

    return pet
      ? of({ ...pet }).pipe(delay(this.atraso))
      : throwError(() => new Error(`Pet ${id} não encontrado`));
  }

  criar(dados: PetEntrada): Observable<Pet> {
    const novo: Pet = {
      ...dados,
      _id: String(this.proximoId++),
    };

    this.pets.push(novo);

    return of({ ...novo }).pipe(delay(this.atraso));
  }

  atualizar(
    id: string,
    dados: Partial<PetEntrada>,
  ): Observable<Pet> {
    const indice = this.pets.findIndex((pet) => pet._id === id);

    if (indice < 0) {
      return throwError(() => new Error(`Pet ${id} não encontrado`));
    }

    this.pets[indice] = {
      ...this.pets[indice],
      ...dados,
      _id: id,
    };

    return of({ ...this.pets[indice] }).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const existe = this.pets.some((pet) => pet._id === id);

    if (!existe) {
      return throwError(() => new Error(`Pet ${id} não encontrado`));
    }

    this.pets = this.pets.filter((pet) => pet._id !== id);

    return of(undefined).pipe(delay(this.atraso));
  }
}
