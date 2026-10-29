import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TutoresService } from '../services/tutores.service';
@Component({
  selector: 'app-tutor-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tutor-form.html',
})
export class TutorForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TutoresService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]],
    endereco: ['', Validators.maxLength(150)],
  });
  ngOnInit(): void {
    if (!this.id()) return;
    this.carregando.set(true);
    this.api.buscarPorId(this.id()!).subscribe({
      next: (x) => {
        this.form.patchValue(x);
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
    return c.invalid && (c.dirty || c.touched);
  }
  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.erro.set('');
    this.salvando.set(true);
    const dados = this.form.getRawValue();
    const req = this.id() ? this.api.atualizar(this.id()!, dados) : this.api.criar(dados);
    req.subscribe({
      next: () => void this.router.navigate(['/tutores']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
