import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';
import { adminGuard, authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Inicio, title: 'Início' },
      { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login), title: 'Entrar no PetShop' },
      { path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.Cadastro), title: 'Cadastrar usuário' },
      // A API exige token em todas estas rotas: sem login, vai para a tela de login.
      { path: 'produtos', canActivate: [authGuard], loadChildren: () => import('./features/produtos/produtos.routes').then(m => m.PRODUTOS_ROUTES) },
      { path: 'pets', canActivate: [authGuard], loadChildren: () => import('./features/pets/pets.routes').then(m => m.PETS_ROUTES) },
      { path: 'tutores', canActivate: [authGuard], loadChildren: () => import('./features/tutores/services/tutores.routes').then(m => m.TUTORES_ROUTES) },
      { path: 'atendimentos', canActivate: [authGuard], loadChildren: () => import('./features/atendimentos/atendimentos.routes').then(m => m.ATENDIMENTOS_ROUTES) },
      { path: 'servicos', canActivate: [authGuard], loadChildren: () => import('./features/servicos/servicos.routes').then(m => m.SERVICOS_ROUTES) },
      { path: 'profissionais', canActivate: [authGuard], loadChildren: () => import('./features/profissionais/profissionais.routes').then(m => m.PROFISSIONAIS_ROUTES) },
      // Relatórios: só o perfil admin (a API também devolve 403 para os outros)
      { path: 'relatorios', canActivate: [adminGuard], loadChildren: () => import('./features/relatorios/relatorios.routes').then(m => m.RELATORIOS_ROUTES) },
    ],
  },
  { path: '**', component: NaoEncontrado, title: 'Página não encontrada' },
];
