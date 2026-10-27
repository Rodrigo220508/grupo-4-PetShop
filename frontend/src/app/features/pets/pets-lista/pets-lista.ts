import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PetsService } from '../services/pets.service';
import { PetCard } from '../pet-card/pet-card';
import { ESPECIES, Especie, Pet } from '../pet.model';
@Component({
  selector: 'app-pets-lista',
  imports: [RouterLink, PetCard],
  templateUrl: './pets-lista.html',
  styleUrl: './pets-lista.css',
})
export class PetsLista {
  private readonly api = inject(PetsService);
  readonly especies = ESPECIES;
  readonly especieSelecionada = signal<Especie | 'todas'>('todas');
  readonly pets = signal<Pet[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly petsFiltrados = computed(() =>
    this.pets().filter(
      (x) => this.especieSelecionada() === 'todas' || x.especie === this.especieSelecionada(),
    ),
  );
  constructor() {
    this.carregarPets();
  }
  carregarPets(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listar().subscribe({
      next: (xs) => {
        this.pets.set(xs);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  selecionarEspecie(v: string): void {
    this.especieSelecionada.set(v as Especie | 'todas');
  }
  excluirPet(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este pet?')) return;
    this.erro.set('');
    this.sucesso.set('');
    this.api.remover(id).subscribe({
      next: () => {
        this.sucesso.set('Pet excluído com sucesso.');
        this.carregarPets();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
