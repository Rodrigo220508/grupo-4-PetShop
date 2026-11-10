
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Especie, Pet, PetEntrada } from '../pet.model';
import { PetsService } from './pets.service';

/**
 * Serviço que conversa com a API NestJS de Pets.
 * Será utilizado quando environment.usarMock = false
 * e quando o backend disponibilizar as rotas de Pets.
 */
@Injectable()
export class PetsApiService extends PetsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pets`;

  listar(especie?: Especie): Observable<Pet[]> {
    const params = especie
      ? new HttpParams().set('especie', especie)
      : undefined;

    return this.http
      .get<RespostaApi<Pet[]>>(this.url, { params })
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  buscarPorId(id: string): Observable<Pet> {
    return this.http
      .get<RespostaApi<Pet>>(`${this.url}/${id}`)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  criar(dados: PetEntrada): Observable<Pet> {
    return this.http
      .post<RespostaApi<Pet>>(this.url, dados)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  atualizar(id: string, dados: Partial<PetEntrada>): Observable<Pet> {
    return this.http
      .patch<RespostaApi<Pet>>(`${this.url}/${id}`, dados)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  remover(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem = 'Não foi possível falar com o servidor. Tente novamente.';
    const corpo = erro.error as { message?: string | string[] } | null;

    if (erro.status > 0 && corpo?.message) {
      mensagem = Array.isArray(corpo.message)
        ? corpo.message.join(' · ')
        : corpo.message;
    }

    return throwError(() => new Error(mensagem));
  }
}