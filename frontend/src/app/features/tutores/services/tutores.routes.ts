import { Routes } from '@angular/router';
import { TutoresLista } from '../tutores-lista/tutores-lista';
import { TutorForm } from '../tutor-form/tutor-form';
export const TUTORES_ROUTES: Routes = [
  { path: '', component: TutoresLista, title: 'Tutores' },
  { path: 'novo', component: TutorForm, title: 'Novo tutor' },
  { path: ':id/editar', component: TutorForm, title: 'Editar tutor' },
];
