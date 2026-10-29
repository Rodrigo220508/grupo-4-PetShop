import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthMockService } from '../../core/auth/auth-mock.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly auth = inject(AuthMockService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);
  protected readonly tentativas = signal(0);
  protected readonly cadastroRealizado = this.rota.snapshot.queryParamMap.get('cadastro') === 'ok';
  protected readonly formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  entrar(): void {
    this.erro.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    try {
      const { email, senha } = this.formulario.getRawValue();
      this.auth.entrar(email, senha);
      const retorno = this.rota.snapshot.queryParamMap.get('retorno');
      const destino = retorno?.startsWith('/') && !retorno.startsWith('//') ? retorno : '/';
      void this.router.navigateByUrl(destino);
    } catch (erro) {
      this.tentativas.update(n => n + 1);
      this.erro.set(erro instanceof Error ? erro.message : 'Não foi possível entrar.');
    }
  }

  sair(): void {
    this.auth.sair();
  }
}
