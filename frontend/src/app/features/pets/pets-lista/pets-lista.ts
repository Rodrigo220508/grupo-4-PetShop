
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

  readonly pets = signal<Pet[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly sucesso = signal('');

  readonly petsFiltrados = computed(() => {
    const especie = this.especieSelecionada();
    const lista = this.pets();

    if (especie === 'todas') {
      return lista;
    }

    return lista.filter((pet) => pet.especie === especie);
  });

  constructor() {
    this.carregarPets();
  }

  carregarPets(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.petsService.listar().subscribe({
      next: (pets) => {
        this.pets.set(pets);
        this.carregando.set(false);
      },
      error: (erro: Error) => {
        this.erro.set(erro.message || 'Não foi possível carregar os pets.');
        this.carregando.set(false);
      },
    });
  }

  selecionarEspecie(valor: string): void {
    this.especieSelecionada.set(valor as Especie | 'todas');
  }

  novoPet(): void {
    this.sucesso.set('');
    this.erro.set('');
    this.petEmEdicao.set(null);
    this.formularioAberto.set(true);
  }

  editarPet(pet: Pet): void {
    this.sucesso.set('');
    this.erro.set('');
    this.petEmEdicao.set(pet);
    this.formularioAberto.set(true);
  }

  excluirPet(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
      return;
    }

    this.erro.set('');
    this.sucesso.set('');

    this.petsService.remover(id).subscribe({
      next: () => {
        this.sucesso.set('Pet excluído com sucesso.');
        this.carregarPets();
      },
      error: (erro: Error) => {
        this.erro.set(erro.message || 'Não foi possível excluir o pet.');
      },
    });
  }

  finalizarFormulario(): void {
    this.formularioAberto.set(false);
    this.petEmEdicao.set(null);
    this.carregarPets();
  }
}
