import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Tutor } from '../tutor.model';
import { TutoresService } from '../services/tutores.service';
import { TutorCard } from '../tutor-card/tutor-card';

@Component({
  selector: 'app-tutores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TutorCard],
  templateUrl: './tutores-lista.html',
  styleUrl: './tutores-lista.css',
})
export class TutoresLista implements OnInit {
  tutores: Tutor[] = [];
  termoBusca = '';

  carregando = signal(false);
  erro = signal('');
  sucesso = signal('');

  tutorSelecionado: Tutor | null = null;

  constructor(
    private tutoresService: TutoresService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarTutores();
  }

  carregarTutores(): void {
  this.carregando.set(true);
  this.erro.set('');
  this.sucesso.set('');

  this.tutoresService.listar().subscribe({
    next: (dados) => {
      this.tutores = dados;
      this.carregando.set(false);

      const mensagem = window.history.state?.mensagemSucesso;

      this.sucesso.set(
        typeof mensagem === 'string'
          ? mensagem
          : 'Lista de tutores carregada com sucesso.',
      );
    },
    error: (falha: unknown) => {
      this.carregando.set(false);

      const mensagem =
        falha instanceof Error ? falha.message : '';

      this.erro.set(
        mensagem || 'Não foi possível carregar os tutores. Tente novamente.',
      );
    },
  });
}

  get tutoresFiltrados(): Tutor[] {
    const termo = this.termoBusca.trim().toLowerCase();

    return this.tutores.filter((tutor) =>
      tutor.nome.toLowerCase().includes(termo),
    );
  }

  selecionarTutor(tutor: Tutor): void {
    this.tutorSelecionado = tutor;
  }

  limparSelecao(): void {
    this.tutorSelecionado = null;
  }

  editarTutor(tutor: Tutor): void {
    this.router.navigate(['/tutores', tutor._id, 'editar']);
  }

  excluirTutor(tutor: Tutor): void {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o tutor ${tutor.nome}?`,
    );

    if (!confirmar) {
      return;
    }

    this.erro.set('');
    this.sucesso.set('');

    this.tutoresService.remover(tutor._id).subscribe({
      next: () => {
        this.tutores = this.tutores.filter(
          (item) => item._id !== tutor._id,
        );

        if (this.tutorSelecionado?._id === tutor._id) {
          this.tutorSelecionado = null;
        }

        this.sucesso.set('Tutor excluído com sucesso.');
      },
      error: () => {
        this.erro.set('Não foi possível excluir o tutor.');
      },
    });
  }
}