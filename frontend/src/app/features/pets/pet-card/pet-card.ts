
import { Component, input } from '@angular/core';
import { Pet } from '../pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  templateUrl: './pet-card.html',
  styleUrl: './pet-card.css',
})
export class PetCard {
  // Recebe os dados do pet que serão exibidos no card.
  pet = input.required<Pet>();
}
