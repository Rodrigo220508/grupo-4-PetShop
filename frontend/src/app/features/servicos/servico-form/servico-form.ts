import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIAS_SERVICO, CategoriaServico } from '../servico.model';
import { ServicosService } from '../services/servicos.service';
@Component({
  selector: 'app-servico-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './servico-form.html',
})
export class ServicoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ServicosService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly categorias = CATEGORIAS_SERVICO;
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    categoria: ['' as CategoriaServico | '', Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    duracaoMinutos: [
      60,
      [Validators.required, Validators.min(10), Validators.max(480), Validators.pattern(/^\d+$/)],
    ],
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
    const dados = this.form.getRawValue() as {
      nome: string;
      categoria: CategoriaServico;
      preco: number;
      duracaoMinutos: number;
    };
    const req = this.id() ? this.api.atualizar(this.id()!, dados) : this.api.criar(dados);
    req.subscribe({
      next: () => void this.router.navigate(['/servicos']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
