import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { idDe } from '../../../core/models/referencia';
import { PetsService } from '../../pets/services/pets.service';
import { ServicosService } from '../../servicos/services/servicos.service';
import { ProfissionaisService } from '../../profissionais/services/profissionais.service';
import { Pet } from '../../pets/pet.model';
import { Servico } from '../../servicos/servico.model';
import { Profissional } from '../../profissionais/profissional.model';
import { AtendimentosService } from '../services/atendimentos.service';
@Component({
  selector: 'app-atendimento-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './atendimento-form.html',
})
export class AtendimentoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AtendimentosService);
  private readonly petsService = inject(PetsService);
  private readonly servicosService = inject(ServicosService);
  private readonly profissionaisService = inject(ProfissionaisService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly pets = signal<Pet[]>([]);
  protected readonly servicos = signal<Servico[]>([]);
  protected readonly profissionais = signal<Profissional[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  protected readonly form = this.fb.nonNullable.group({
    pet: ['', Validators.required],
    servico: ['', Validators.required],
    profissional: ['', Validators.required],
    dataHora: ['', Validators.required],
    observacoes: ['', Validators.maxLength(300)],
  });
  ngOnInit(): void {
    forkJoin({
      pets: this.petsService.listar(),
      servicos: this.servicosService.listar(),
      profissionais: this.profissionaisService.listar(),
    }).subscribe({
      next: ({ pets, servicos, profissionais }) => {
        this.pets.set(pets);
        this.servicos.set(servicos);
        this.profissionais.set(profissionais.filter((x) => x.ativo));
        const id = this.id();
        if (!id) {
          this.carregando.set(false);
          return;
        }
        this.api.buscarPorId(id).subscribe({
          next: (a) => {
            this.form.patchValue({
              pet: idDe(a.pet),
              servico: idDe(a.servico),
              profissional: idDe(a.profissional),
              dataHora: this.paraLocal(a.dataHora),
              observacoes: a.observacoes ?? '',
            });
            this.carregando.set(false);
          },
          error: (e: Error) => {
            this.erro.set(e.message);
            this.carregando.set(false);
          },
        });
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  protected invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }
  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    if (
      Number.isNaN(new Date(dados.dataHora).getTime()) ||
      new Date(dados.dataHora) <= new Date()
    ) {
      this.erro.set('Selecione data e hora futuras.');
      return;
    }
    this.salvando.set(true);
    this.erro.set('');
    const req = this.id() ? this.api.atualizar(this.id()!, dados) : this.api.criar(dados);
    req.subscribe({
      next: () => void this.router.navigate(['/atendimentos']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
  private paraLocal(iso: string): string {
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) return iso.slice(0, 16);
    return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
