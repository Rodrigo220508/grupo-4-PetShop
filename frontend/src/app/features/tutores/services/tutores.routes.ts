import { Routes } from '@angular/router';
import { TutoresLista } from '../tutores-lista/tutores-lista';

export const TUTORES_ROUTES: Routes = [
  {
    path: '',
    component: TutoresLista,
    title: 'Tutores',
  },
];