import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Exige login para abrir a página. A proteção de verdade é a da API. */
export const authGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaLogado()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { retorno: estado.url } });
};

/** Exige perfil admin (ex.: relatórios). Outros perfis voltam ao início. */
export const adminGuard: CanActivateFn = (rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estaLogado()) return authGuard(rota, estado);
  return auth.ehAdmin() ? true : router.createUrlTree(['/']);
};
