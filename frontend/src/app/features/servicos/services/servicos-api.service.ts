import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Servico, ServicoEntrada } from '../servico.model';
import { ServicosService } from './servicos.service';

@Injectable()
export class ServicosApiService extends ServicosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/servicos`;

  listar(): Observable<Servico[]> {
    return this.http.get<RespostaApi<Servico[]>>(this.url).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  listarTodos(): Observable<Servico[]> {
    return this.listar();
  }

  buscarPorId(id: string): Observable<Servico> {
    return this.http.get<RespostaApi<Servico>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  criar(dados: ServicoEntrada): Observable<Servico> {
    return this.http.post<RespostaApi<Servico>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  atualizar(id: string, dados: ServicoEntrada): Observable<Servico> {
    return this.http.patch<RespostaApi<Servico>>(`${this.url}/${id}`, dados).pipe(
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