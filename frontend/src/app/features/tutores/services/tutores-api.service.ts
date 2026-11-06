import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Tutor, TutorEntrada } from '../tutor.model';
import { TutoresService } from './tutores.service';

@Injectable()
export class TutoresApiService extends TutoresService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/tutores`;

  listar(busca?: string): Observable<Tutor[]> {
    const params = busca?.trim()
      ? { params: { busca: busca.trim() } }
      : {};

    return this.http
      .get<RespostaApi<Tutor[]>>(this.url, params)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  buscarPorId(id: string): Observable<Tutor> {
    return this.http
      .get<RespostaApi<Tutor>>(`${this.url}/${id}`)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  criar(dados: TutorEntrada): Observable<Tutor> {
    return this.http
      .post<RespostaApi<Tutor>>(this.url, dados)
      .pipe(
        map((resposta) => resposta.dados),
        catchError(this.tratarErro),
      );
  }

  atualizar(
    id: string,
    dados: Partial<TutorEntrada>,
  ): Observable<Tutor> {
    return this.http
      .patch<RespostaApi<Tutor>>(`${this.url}/${id}`, dados)
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

  private tratarErro(
    erro: HttpErrorResponse,
  ): Observable<never> {
    let mensagem =
      'Não foi possível comunicar com o servidor. Tente novamente.';

    const corpo = erro.error as {
      message?: string | string[];
    } | null;

    if (erro.status > 0 && corpo?.message) {
      mensagem = Array.isArray(corpo.message)
        ? corpo.message.join(' · ')
        : corpo.message;
    }

    return throwError(() => new Error(mensagem));
  }
}