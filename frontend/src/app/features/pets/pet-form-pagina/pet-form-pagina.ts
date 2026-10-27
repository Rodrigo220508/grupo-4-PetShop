import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Pet } from '../pet.model';
import { PetForm } from '../pet-form/pet-form';
import { PetsService } from '../services/pets.service';
@Component({
  selector: 'app-pet-form-pagina',
  imports: [PetForm, RouterLink],
  template: `
    <h1>{{ id() ? 'Editar pet' : 'Cadastrar pet' }}</h1>
    @if (erro()) {
      <p role="alert" class="alerta erro">{{ erro() }}</p>
    }
    @if (carregando()) {
      <p role="status">Carregando pet...</p>
    } @else {
      <div class="cartao formulario">
        <app-pet-form [petInicial]="pet()" (salvo)="voltar()" (cancelar)="voltar()" />
      </div>
    }
    <a routerLink="/pets">Voltar à lista</a>
  `,
})
export class PetFormPagina implements OnInit {
  private readonly api = inject(PetsService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly pet = signal<Pet | null>(null);
  protected readonly erro = signal('');
  protected readonly carregando = signal(false);
  ngOnInit(): void {
    if (!this.id()) return;
    this.carregando.set(true);
    this.api.buscarPorId(this.id()!).subscribe({
      next: (x) => {
        this.pet.set(x);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  protected voltar(): void {
    void this.router.navigate(['/pets']);
  }
}
