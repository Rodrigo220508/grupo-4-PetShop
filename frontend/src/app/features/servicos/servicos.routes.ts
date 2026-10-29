import { Routes } from '@angular/router';
import { ServicosLista } from './servicos-lista/servicos-lista';
import { ServicoForm } from './servico-form/servico-form';
export const SERVICOS_ROUTES: Routes = [
  { path: '', component: ServicosLista, title: 'Serviços' },
  { path: 'novo', component: ServicoForm, title: 'Novo serviço' },
  { path: ':id/editar', component: ServicoForm, title: 'Editar serviço' },
];
