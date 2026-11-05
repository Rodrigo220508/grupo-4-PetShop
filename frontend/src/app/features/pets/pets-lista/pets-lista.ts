import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PetsService } from '../services/pets.service';
import { PetCard } from '../pet-card/pet-card';
import { ConfirmacaoService } from '../../../core/ui/confirmacao.service';
import { ESPECIES, Especie, Pet } from '../pet.model';

@Component({
  selector: 'app-pets-lista',
  imports: [PetCard, RouterLink],
  templateUrl: './pets-lista.html',
  styleUrl: './pets-lista.css',
})
export class PetsLista {
  private readonly api = inject(PetsService);
  private readonly confirmacao = inject(ConfirmacaoService);
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
  async excluirPet(id: string): Promise<void> {
    const nome = this.pets().find((pet) => pet._id === id)?.nome ?? 'este pet';
    const aceitou = await this.confirmacao.confirmar({
      titulo: 'Excluir pet?',
      descricao: `Tem certeza que deseja excluir ${nome}? Esta ação não pode ser desfeita.`,
      textoConfirmar: 'Sim, excluir',
      tipo: 'perigo',
    });
    if (!aceitou) return;
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
