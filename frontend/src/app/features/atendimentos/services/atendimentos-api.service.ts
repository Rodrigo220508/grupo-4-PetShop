
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Atendimento, AtendimentoEntrada, Status } from '../atendimento.model';
import { AtendimentosService } from './atendimentos.service';

@Injectable()
export class AtendimentosApiService extends AtendimentosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/atendimentos`;

  listar(status?: Status): Observable<Atendimento[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<RespostaApi<Atendimento[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  buscarPorId(id: string): Observable<Atendimento> {
    return this.http.get<RespostaApi<Atendimento>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  criar(dados: AtendimentoEntrada): Observable<Atendimento> {
    return this.http.post<RespostaApi<Atendimento>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  atualizar(id: string, dados: AtendimentoEntrada): Observable<Atendimento> {
    return this.http.patch<RespostaApi<Atendimento>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  mudarStatus(id: string, status: Status): Observable<Atendimento> {
    return this.http.patch<RespostaApi<Atendimento>>(
      `${this.url}/${id}/status`,
      { status },
    ).pipe(
      map((r) => r.dados),
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
