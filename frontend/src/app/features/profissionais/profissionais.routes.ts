import { Routes } from '@angular/router';
import { ProfissionaisLista } from './profissionais-lista/profissionais-lista';
import { ProfissionalForm } from './profissional-form/profissional-form';
export const PROFISSIONAIS_ROUTES: Routes = [
  { path: '', component: ProfissionaisLista, title: 'Profissionais' },
  { path: 'novo', component: ProfissionalForm, title: 'Novo profissional' },
  { path: ':id/editar', component: ProfissionalForm, title: 'Editar profissional' },
];
