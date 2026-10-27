import { Component, input, output } from '@angular/core';
import { Tutor } from '../tutor.model';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [],
  templateUrl: './tutor-card.html',
  styleUrl: './tutor-card.css',
})
export class TutorCard {
  tutor = input.required<Tutor>();

  selecionar = output<Tutor>();
  editar = output<Tutor>();
  excluir = output<Tutor>();

  protected selecionarTutor(): void {
    this.selecionar.emit(this.tutor());
  }

  protected editarTutor(): void {
    this.editar.emit(this.tutor());
  }

  protected excluirTutor(): void {
    this.excluir.emit(this.tutor());
  }
}