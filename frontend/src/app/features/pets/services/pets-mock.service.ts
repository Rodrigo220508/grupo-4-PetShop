
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { ESPECIES, Especie, Pet, PetEntrada } from '../pet.model';
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
    const erro = this.validar(dados);

    if (erro) {
      return throwError(() => new Error(erro));
    }

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

    const atualizado = {
      ...this.pets[indice],
      ...dados,
      _id: id,
    };

    const erro = this.validar(atualizado);

    if (erro) {
      return throwError(() => new Error(erro));
    }

    this.pets[indice] = atualizado;

    return of({ ...atualizado }).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const existe = this.pets.some((pet) => pet._id === id);

    if (!existe) {
      return throwError(() => new Error(`Pet ${id} não encontrado`));
    }

    this.pets = this.pets.filter((pet) => pet._id !== id);

    return of(undefined).pipe(delay(this.atraso));
  }

  private validar(dados: PetEntrada): string | null {
    if (!dados.nome || dados.nome.trim().length < 2 || dados.nome.length > 60) {
      return 'Informe um nome entre 2 e 60 caracteres.';
    }

    if (!ESPECIES.includes(dados.especie)) {
      return 'Selecione uma espécie válida.';
    }

    if ((dados.raca ?? '').length > 60) {
      return 'A raça deve ter no máximo 60 caracteres.';
    }

    if (!dados.tutor) {
      return 'Selecione um tutor.';
    }

    if (typeof dados.ativo !== 'boolean') {
      return 'Informe se o pet está ativo.';
    }

    if (dados.dataNascimento) {
      const hoje = new Date();
      const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

      if (
        Number.isNaN(new Date(dados.dataNascimento).getTime()) ||
        dados.dataNascimento > dataHoje
      ) {
        return 'A data de nascimento não pode ser futura.';
      }
    }

    return null;
  }
}
