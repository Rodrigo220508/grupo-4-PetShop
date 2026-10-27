import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ESPECIES, Pet } from '../pet.model';
import { PetsService } from '../services/pets.service';
import { TutoresService } from '../../tutores/services/tutores.service';
import { Tutor } from '../../tutores/tutor.model';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm {
  private readonly fb = inject(FormBuilder);
  private readonly petsService = inject(PetsService);
  private readonly tutoresService = inject(TutoresService);
  readonly tutores = signal<Tutor[]>([]);

  readonly especies = ESPECIES;
  readonly petInicial = input<Pet | null>(null);
  readonly salvo = output<void>();
  readonly cancelar = output<void>();

  readonly salvando = signal(false);
  readonly erro = signal('');

  readonly formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    especie: ['cachorro', Validators.required],
    raca: ['', Validators.maxLength(60)],
    dataNascimento: [''],
    tutor: ['', Validators.required],
    ativo: [true],
  });

  constructor() {
    this.tutoresService.listar().subscribe({
      next: (tutores) => this.tutores.set(tutores),
      error: () => this.erro.set('Não foi possível carregar os tutores.'),
    });
    effect(() => {
      const pet = this.petInicial();

      if (pet) {
        this.formulario.patchValue({
          nome: pet.nome,
          especie: pet.especie,
          raca: pet.raca ?? '',
          dataNascimento: pet.dataNascimento ?? '',
          tutor: pet.tutor,
          ativo: pet.ativo,
        });
      } else {
        this.formulario.reset({
          nome: '',
          especie: 'cachorro',
          raca: '',
          dataNascimento: '',
          tutor: '',
          ativo: true,
        });
      }

      this.erro.set('');
    });
  }

  dataFutura(): boolean {
    const data = this.formulario.controls.dataNascimento.value;

    return !!data && data > new Date().toISOString().slice(0, 10);
  }

  salvar(): void {
    if (this.formulario.invalid || this.dataFutura()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set('');

    const dados = this.formulario.getRawValue();
    const pet = this.petInicial();

    const entrada = {
      ...dados,
      especie: dados.especie as (typeof ESPECIES)[number],
      raca: dados.raca || undefined,
      dataNascimento: dados.dataNascimento || undefined,
    };

    const operacao = pet
      ? this.petsService.atualizar(pet._id, entrada)
      : this.petsService.criar(entrada);

    operacao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.salvo.emit();
      },
      error: (erro: Error) => {
        this.salvando.set(false);
        this.erro.set(erro.message || 'Não foi possível salvar o pet.');
      },
    });
  }
}
