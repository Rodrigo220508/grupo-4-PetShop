
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tutor } from '../tutor.model';
import { TutoresService } from '../services/tutores.service';

@Component({
  selector: 'app-tutores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tutores-lista.html',
  styleUrl: './tutores-lista.css',
})
export class TutoresLista implements OnInit {
  tutores: Tutor[] = [];
  termoBusca = '';
  carregando = false;
  erro = '';

  constructor(private tutoresService: TutoresService) {}

  ngOnInit(): void {
    this.carregarTutores();
  }

  carregarTutores(): void {
    this.carregando = true;
    this.erro = '';

    this.tutoresService.listar().subscribe({
      next: (dados) => {
        this.tutores = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os tutores.';
        this.carregando = false;
      },
    });
  }

  get tutoresFiltrados(): Tutor[] {
    const termo = this.termoBusca.trim().toLowerCase();

    return this.tutores.filter((tutor) =>
      tutor.nome.toLowerCase().includes(termo),
    );
  }
}
