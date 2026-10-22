
import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ESPECIES, Pet } from '../pet.model';
import { PetsService } from '../services/pets.service';

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

  readonly especies = ESPECIES;
  readonly petInicial = input<Pet | null>(null);
  readonly salvo = output<void>();
  readonly cancelar = output<void>();

  readonly formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    especie: ['cachorro', Validators.required],
    raca: ['', Validators.maxLength(60)],
    dataNascimento: [''],
    tutor: ['', Validators.required],
    ativo: [true],
  });

    constructor() {
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
    });
  }

  dataFutura(): boolean {
    const data = this.formulario.controls.dataNascimento.value;

    if (!data) {
      return false;
    }

    return data > new Date().toISOString().slice(0, 10);
  }

  salvar(): void {
    if (this.formulario.invalid || this.dataFutura()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();
    const pet = this.petInicial();

    
const entrada = {
  ...dados,
  especie: dados.especie as (typeof ESPECIES)[number],
  raca: dados.raca || undefined,
  dataNascimento: dados.dataNascimento || undefined,
};


    if (pet) {
      this.petsService.atualizar(pet._id, entrada);
    } else {
      this.petsService.criar(entrada);
    }

    this.salvo.emit();
  }
}
