import { Routes } from '@angular/router';
import { PetsLista } from './pets-lista/pets-lista';
import { PetFormPagina } from './pet-form-pagina/pet-form-pagina';
export const PETS_ROUTES: Routes = [
  { path: '', component: PetsLista, title: 'Pets cadastrados' },
  { path: 'novo', component: PetFormPagina, title: 'Novo pet' },
  { path: ':id/editar', component: PetFormPagina, title: 'Editar pet' },
];
