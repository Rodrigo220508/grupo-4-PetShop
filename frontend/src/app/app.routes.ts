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
          import('./features/produtos/produtos.routes').then((m) => m.PRODUTOS_ROUTES),
      },
      {
        path: 'atendimentos',
        loadChildren: () =>
          import('./features/atendimentos/atendimentos.routes').then((m) => m.ATENDIMENTOS_ROUTES),
      },
      {
        path: 'servicos',
        loadChildren: () =>
          import('./features/servicos/servicos.routes').then((m) => m.SERVICOS_ROUTES),
      },
      {
        path: 'profissionais',
        loadChildren: () =>
          import('./features/profissionais/profissionais.routes').then(
            (m) => m.PROFISSIONAIS_ROUTES,
          ),
      },
      {
        path: 'relatorios',
        loadChildren: () =>
          import('./features/relatorios/relatorios.routes').then((m) => m.RELATORIOS_ROUTES),
      },
      {
        path: 'pets',
        loadChildren: () => import('./features/pets/pets.routes').then((m) => m.PETS_ROUTES),
      },
      {
        path: 'tutores',
        loadChildren: () =>
          import('./features/tutores/services/tutores.routes').then((m) => m.TUTORES_ROUTES),
      },
    ],
  },
  {
    path: '**',
    component: NaoEncontrado,
    title: 'Página não encontrada',
  },
];
