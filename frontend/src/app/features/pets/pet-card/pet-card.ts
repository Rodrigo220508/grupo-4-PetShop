
import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Pet } from '../pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './pet-card.html',
  styleUrl: './pet-card.css',
})
export class PetCard {
  // Recebe os dados do pet.
  readonly pet = input.required<Pet>();

  // Nome do tutor (se não vier, mostra o ID).
  readonly tutorNome = input<string>();

  // Comunica à página pai que o usuário quer editar o pet.
  readonly editar = output<Pet>();

  // Comunica à página pai que o usuário quer excluir o pet.
  readonly excluir = output<string>();
}
