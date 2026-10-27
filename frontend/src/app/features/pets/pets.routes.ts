
import { Routes } from '@angular/router';
import { PetsLista } from './pets-lista/pets-lista';

export const PETS_ROUTES: Routes = [
  {
    path: '',
    component: PetsLista,
    title: 'Pets cadastrados',
  },
];
