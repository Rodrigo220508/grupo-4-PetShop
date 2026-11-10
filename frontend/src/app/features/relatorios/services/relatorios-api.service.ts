import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';

export interface Resumo {
  tutores: number;
  pets: number;
  atendimentosAgendados: number;
}

export interface QuantidadePorStatus {
  _id: string;
  quantidade: number;
}

export interface FaturamentoPorServico {
  servico: string;
  quantidade: number;
  faturamento: number;
}

/** Consultas agregadas do módulo F (calculadas no MongoDB pela API). */
@Injectable({ providedIn: 'root' })
export class RelatoriosApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/relatorios`;

  resumo(): Observable<Resumo> {
    return this.buscar<Resumo>('resumo');
  }

  atendimentosPorStatus(): Observable<QuantidadePorStatus[]> {
    return this.buscar<QuantidadePorStatus[]>('atendimentos-por-status');
  }

  faturamentoPorServico(): Observable<FaturamentoPorServico[]> {
    return this.buscar<FaturamentoPorServico[]>('faturamento-por-servico');
  }

  private buscar<T>(rota: string): Observable<T> {
    return this.http.get<RespostaApi<T>>(`${this.url}/${rota}`).pipe(
      map((r) => r.dados),
      catchError((erro: HttpErrorResponse) => {
        let mensagem = 'Não foi possível falar com o servidor. Tente novamente.';
        const corpo = erro.error as { message?: string | string[] } | null;
        if (erro.status > 0 && corpo?.message) {
          mensagem = Array.isArray(corpo.message) ? corpo.message.join(' · ') : corpo.message;
        }
        return throwError(() => new Error(mensagem));
      }),
    );
  }
}
