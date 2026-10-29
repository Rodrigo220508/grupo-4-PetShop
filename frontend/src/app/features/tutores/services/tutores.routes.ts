import { Routes } from '@angular/router';
import { TutoresLista } from '../tutores-lista/tutores-lista';
import { TutoresFormulario } from '../tutores-formulario/tutores-formulario';

export const TUTORES_ROUTES: Routes = [
  {
    path: '',
    component: TutoresLista,
    title: 'Tutores',
  },
  {
    path: 'novo',
    component: TutoresFormulario,
    title: 'Novo tutor',
  },
  {
    path: ':id/editar',
    component: TutoresFormulario,
    title: 'Editar tutor',
  },
];