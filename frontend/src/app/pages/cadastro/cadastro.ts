import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

function confirmarSenhas(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('senha')?.value;
  const confirmacao = grupo.get('confirmacao')?.value;
  return senha === confirmacao ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrls: ['../login/login.css', './cadastro.css'],
})
export class Cadastro {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);
  protected readonly enviando = signal(false);
  protected readonly form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)]],
    confirmacao: ['', Validators.required],
  }, { validators: confirmarSenhas });

  protegido(campo: keyof typeof this.form.controls): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  cadastrar(): void {
    this.erro.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nome, email, senha } = this.form.getRawValue();
    this.enviando.set(true);
    this.auth.cadastrar(nome, email, senha).subscribe({
      next: () => {
        this.enviando.set(false);
        void this.router.navigate(['/login'], { queryParams: { cadastro: 'ok' } });
      },
      error: (erro: Error) => {
        this.enviando.set(false);
        this.erro.set(erro.message || 'Não foi possível cadastrar.');
      },
    });
  }
}
