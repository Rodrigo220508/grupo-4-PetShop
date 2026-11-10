import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Coloca o token em toda requisição para a API.
 * Se a API responder 401 (token vencido ou inválido), encerra a sessão.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      const rotaDeAcesso = req.url.includes('/auth/login') || req.url.includes('/auth/cadastro');
      if (erro.status === 401 && !rotaDeAcesso) {
        auth.sair();
      }
      return throwError(() => erro);
    }),
  );
};
