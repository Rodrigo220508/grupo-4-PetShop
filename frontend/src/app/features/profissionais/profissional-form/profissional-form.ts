import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FUNCOES, Funcao } from '../profissional.model';
import { ProfissionaisService } from '../services/profissionais.service';
@Component({
  selector: 'app-profissional-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profissional-form.html',
})
export class ProfissionalForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProfissionaisService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly funcoes = FUNCOES;
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    funcao: ['' as Funcao | '', Validators.required],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]],
    crmv: ['', Validators.maxLength(20)],
  });
  ngOnInit(): void {
    if (!this.id()) return;
    this.carregando.set(true);
    this.api.buscarPorId(this.id()!).subscribe({
      next: (p) => {
        this.form.patchValue(p);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  protected invalido(k: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[k];
    return c.invalid && (c.touched || c.dirty);
  }
  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    if (dados.funcao === 'veterinario' && !dados.crmv.trim()) {
      this.erro.set('O CRMV é obrigatório para veterinários.');
      return;
    }
    this.salvando.set(true);
    this.erro.set('');
    const entrada = { ...dados, funcao: dados.funcao as Funcao, crmv: dados.crmv || undefined };
    const req = this.id() ? this.api.atualizar(this.id()!, entrada) : this.api.criar(entrada);
    req.subscribe({
      next: () => void this.router.navigate(['/profissionais']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
