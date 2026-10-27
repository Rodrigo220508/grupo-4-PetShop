import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Inicio,
        title: 'Início',
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./features/produtos/produtos.routes').then(
            (m) => m.PRODUTOS_ROUTES,
          ),
      },
      {
        path: 'tutores',
        loadChildren: () =>
          import('./features/tutores/services/tutores.routes').then(
            (m) => m.TUTORES_ROUTES,
          ),
      },
    ],
  },
  {
    path: '**',
    component: NaoEncontrado,
    title: 'Página não encontrada',
  },
];