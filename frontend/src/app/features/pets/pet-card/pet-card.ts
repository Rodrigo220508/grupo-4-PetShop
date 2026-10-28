
import { Component, input, output } from '@angular/core';
import { Pet } from '../pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  templateUrl: './pet-card.html',
  styleUrl: './pet-card.css',
})
export class PetCard {
  // Recebe os dados do pet.
  readonly pet = input.required<Pet>();

  // Comunica à página pai que o usuário quer editar o pet.
  readonly editar = output<Pet>();

  // Comunica à página pai que o usuário quer excluir o pet.
  readonly excluir = output<string>();
}
