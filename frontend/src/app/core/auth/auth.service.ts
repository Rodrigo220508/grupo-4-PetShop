import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../models/resposta-api';

export type Perfil = 'admin' | 'atendente' | 'consulta';

export interface UsuarioLogado {
  _id: string;
  nome: string;
  email: string;
  perfil: Perfil;
}

interface Sessao {
  accessToken: string;
  usuario: UsuarioLogado;
}

// sessionStorage (e não localStorage): a sessão some ao fechar a aba (aula 13, slide 9)
const CHAVE_SESSAO = 'petshop.sessao';

/** Login real com a API: guarda o token JWT e os dados do usuário logado. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly sessao = signal<Sessao | null>(this.lerSessao());

  readonly usuario = computed(() => this.sessao()?.usuario ?? null);
  readonly token = computed(() => this.sessao()?.accessToken ?? null);
  readonly estaLogado = computed(() => this.sessao() !== null);

  // Só melhoram a tela: quem garante a permissão é a API (401/403)
  readonly ehAdmin = computed(() => this.usuario()?.perfil === 'admin');
  readonly podeEditar = computed(() => {
    const perfil = this.usuario()?.perfil;
    return perfil === 'admin' || perfil === 'atendente';
  });
  readonly podeExcluir = this.ehAdmin;

  entrar(email: string, senha: string): Observable<UsuarioLogado> {
    return this.http
      .post<RespostaApi<Sessao>>(`${this.url}/login`, { email: email.trim(), senha })
      .pipe(
        map((r) => r.dados),
        tap((sessao) => this.salvarSessao(sessao)),
        map((sessao) => sessao.usuario),
        catchError((erro: HttpErrorResponse) => this.tratarErro(erro)),
      );
  }

  cadastrar(nome: string, email: string, senha: string): Observable<void> {
    return this.http
      .post<RespostaApi<unknown>>(`${this.url}/cadastro`, {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      })
      .pipe(
        map(() => undefined),
        catchError((erro: HttpErrorResponse) => this.tratarErro(erro)),
      );
  }

  sair(): void {
    this.salvarSessao(null);
    void this.router.navigate(['/login']);
  }

  private salvarSessao(sessao: Sessao | null): void {
    this.sessao.set(sessao);
    try {
      if (sessao) sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
      else sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      // sem sessionStorage (modo privado): a sessão fica só na memória
    }
  }

  private lerSessao(): Sessao | null {
    try {
      const texto = sessionStorage.getItem(CHAVE_SESSAO);
      if (!texto) return null;
      const sessao = JSON.parse(texto) as Sessao;
      return this.tokenExpirado(sessao.accessToken) ? null : sessao;
    } catch {
      return null;
    }
  }

  /** Lê o "exp" do token para não reabrir uma sessão já vencida. */
  private tokenExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem = 'Não foi possível falar com o servidor. Tente novamente.';
    const corpo = erro.error as { message?: string | string[] } | null;
    if (erro.status > 0 && corpo?.message) {
      mensagem = Array.isArray(corpo.message) ? corpo.message.join(' · ') : corpo.message;
    }
    return throwError(() => new Error(mensagem));
  }
}
