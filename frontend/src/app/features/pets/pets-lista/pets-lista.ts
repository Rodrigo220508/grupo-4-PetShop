
import { Component, computed, inject, signal } from '@angular/core';
import { PetsService } from '../services/pets.service';
import { PetCard } from '../pet-card/pet-card';
import { PetForm } from '../pet-form/pet-form';
import { ESPECIES, Especie, Pet } from '../pet.model';

@Component({
  selector: 'app-pets-lista',
  standalone: true,
  imports: [PetCard, PetForm],
  templateUrl: './pets-lista.html',
  styleUrl: './pets-lista.css',
})
export class PetsLista {
  private readonly petsService = inject(PetsService);

  readonly especies = ESPECIES;
  readonly especieSelecionada = signal<Especie | 'todas'>('todas');
  readonly petEmEdicao = signal<Pet | null>(null);
  readonly formularioAberto = signal(false);

  readonly petsFiltrados = computed(() => {
    const especie = this.especieSelecionada();

    if (especie === 'todas') {
      return this.petsService.pets();
    }

    return this.petsService.pets().filter(
      (pet) => pet.especie === especie,
    );
  });

  selecionarEspecie(valor: string): void {
    this.especieSelecionada.set(valor as Especie | 'todas');
  }

  novoPet(): void {
    this.petEmEdicao.set(null);
    this.formularioAberto.set(true);
  }

  editarPet(pet: Pet): void {
    this.petEmEdicao.set(pet);
    this.formularioAberto.set(true);
  }

  excluirPet(id: string): void {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      this.petsService.excluir(id);
    }
  }

  finalizarFormulario(): void {
    this.formularioAberto.set(false);
    this.petEmEdicao.set(null);
  }
}
