
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Profissional, ProfissionalEntrada } from '../profissional.model';
import { ProfissionaisService } from './profissionais.service';

@Injectable()
export class ProfissionaisApiService extends ProfissionaisService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/profissionais`;

  listar(): Observable<Profissional[]> {
    return this.http.get<RespostaApi<Profissional[]>>(this.url).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  buscarPorId(id: string): Observable<Profissional> {
    return this.http.get<RespostaApi<Profissional>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  criar(dados: ProfissionalEntrada): Observable<Profissional> {
    return this.http.post<RespostaApi<Profissional>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  atualizar(id: string, dados: ProfissionalEntrada): Observable<Profissional> {
    return this.http.patch<RespostaApi<Profissional>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(this.tratarErro),
    );
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
