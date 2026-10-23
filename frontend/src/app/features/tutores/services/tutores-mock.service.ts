
import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { Tutor, TutorEntrada } from '../tutor.model';
import { TutoresService } from './tutores.service';

@Injectable({
  providedIn: 'root',
})
export class TutoresMockService extends TutoresService {
  private tutores: Tutor[] = [
    {
      _id: '1',
      nome: 'João Silva',
      telefone: '(51) 99999-1111',
      email: 'joao@email.com',
      endereco: 'Rua das Flores, 100',
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Maria Souza',
      telefone: '(51) 99999-2222',
      email: 'maria@email.com',
      endereco: 'Rua Central, 200',
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Pedro Santos',
      telefone: '(51) 99999-3333',
      email: 'pedro@email.com',
      ativo: true,
    },
  ];

  private proximoId = 4;
  private readonly atraso = 400;

  listar(): Observable<Tutor[]> {
    return of([...this.tutores]).pipe(delay(this.atraso));
  }

  buscarPorId(id: string): Observable<Tutor> {
    const tutor = this.tutores.find((t) => t._id === id);

    return tutor
      ? of({ ...tutor }).pipe(delay(this.atraso))
      : throwError(() => new Error(`Tutor ${id} não encontrado`));
  }

  criar(dados: TutorEntrada): Observable<Tutor> {
    const emailExiste = this.tutores.some(
      (t) => t.email.toLowerCase() === dados.email.toLowerCase(),
    );

    if (emailExiste) {
      return throwError(() => new Error('Já existe um tutor com esse e-mail'));
    }

    const novo: Tutor = {
      ...dados,
      _id: String(this.proximoId++),
      ativo: dados.ativo ?? true,
    };

    this.tutores.push(novo);

    return of({ ...novo }).pipe(delay(this.atraso));
  }

  atualizar(
    id: string,
    dados: Partial<TutorEntrada>,
  ): Observable<Tutor> {
    const indice = this.tutores.findIndex((t) => t._id === id);

    if (indice < 0) {
      return throwError(() => new Error(`Tutor ${id} não encontrado`));
    }

    if (
      dados.email &&
      this.tutores.some(
        (t) =>
          t._id !== id &&
          t.email.toLowerCase() === dados.email!.toLowerCase(),
      )
    ) {
      return throwError(() => new Error('Já existe um tutor com esse e-mail'));
    }

    this.tutores[indice] = { ...this.tutores[indice], ...dados };

    return of({ ...this.tutores[indice] }).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const existe = this.tutores.some((t) => t._id === id);

    if (!existe) {
      return throwError(() => new Error(`Tutor ${id} não encontrado`));
    }

    this.tutores = this.tutores.filter((t) => t._id !== id);

    return of(undefined).pipe(delay(this.atraso));
  }
}
