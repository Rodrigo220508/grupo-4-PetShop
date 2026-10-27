import { Routes } from '@angular/router';
import { AtendimentosLista } from './atendimentos-lista/atendimentos-lista';
import { AtendimentoForm } from './atendimento-form/atendimento-form';
export const ATENDIMENTOS_ROUTES: Routes = [
  { path: '', component: AtendimentosLista, title: 'Atendimentos' },
  { path: 'novo', component: AtendimentoForm, title: 'Agendar atendimento' },
  { path: ':id/editar', component: AtendimentoForm, title: 'Editar atendimento' },
];
