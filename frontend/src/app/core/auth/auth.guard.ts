import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from './auth-mock.service';

/** Guarda apenas a navegação na demonstração; NÃO substitui autorização da API. */
export const authGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  return auth.estaLogado() ? true : router.createUrlTree(['/login'], {
    queryParams: { retorno: estado.url },
  });
};
