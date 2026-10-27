import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TutorEntrada } from '../tutor.model';
import { TutoresService } from '../services/tutores.service';

@Component({
  selector: 'app-tutores-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tutores-formulario.html',
  styleUrl: './tutores-formulario.css',
})
export class TutoresFormulario {
  nome = '';
  telefone = '';
  email = '';
  endereco = '';

  salvando = false;
  erro = '';

  constructor(
    private tutoresService: TutoresService,
    private router: Router,
  ) {}

  salvar(): void {
    this.erro = '';

    if (
      !this.nome.trim() ||
      !this.telefone.trim() ||
      !this.email.trim()
    ) {
      this.erro = 'Preencha nome, telefone e e-mail.';
      return;
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
  this.email.trim(),
);

if (!emailValido) {
  this.erro = 'Digite um e-mail válido.';
  return;
}

    const dados: TutorEntrada = {
      nome: this.nome.trim(),
      telefone: this.telefone.trim(),
      email: this.email.trim(),
      endereco: this.endereco.trim() || undefined,
    };

    this.salvando = true;

    this.tutoresService.criar(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/tutores']);
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível cadastrar o tutor.';
      },
    });
  }
}