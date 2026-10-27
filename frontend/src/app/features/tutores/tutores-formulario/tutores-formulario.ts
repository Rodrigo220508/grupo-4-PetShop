import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TutorEntrada } from '../tutor.model';
import { TutoresService } from '../services/tutores.service';

@Component({
  selector: 'app-tutores-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tutores-formulario.html',
  styleUrl: './tutores-formulario.css',
})
export class TutoresFormulario implements OnInit {
  formulario = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
      ],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    endereco: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(150)],
    }),
  });

  idTutor: string | null = null;
  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');

  constructor(
    private tutoresService: TutoresService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.idTutor = this.route.snapshot.paramMap.get('id');

    if (this.idTutor) {
      this.carregarTutor(this.idTutor);
    }
  }

  carregarTutor(id: string): void {
    this.carregando.set(true);
    this.erro.set('');

    this.tutoresService.buscarPorId(id).subscribe({
      next: (tutor) => {
        this.formulario.patchValue({
          nome: tutor.nome,
          telefone: tutor.telefone,
          email: tutor.email,
          endereco: tutor.endereco ?? '',
        });

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os dados do tutor.');
        this.carregando.set(false);
      },
    });
  }

  salvar(): void {
    this.erro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.formulario.getRawValue();

    const dados: TutorEntrada = {
      nome: valor.nome.trim(),
      telefone: valor.telefone.trim(),
      email: valor.email.trim(),
      endereco: valor.endereco.trim() || undefined,
    };

    this.salvando.set(true);

    const operacao = this.idTutor
      ? this.tutoresService.atualizar(this.idTutor, dados)
      : this.tutoresService.criar(dados);

    operacao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/tutores']);
      },
      error: (falha: unknown) => {
        this.salvando.set(false);

        const mensagem = falha instanceof Error ? falha.message : '';

        this.erro.set(mensagem || 'Não foi possível salvar o tutor.');
      },
    });
  }
}