import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tutor } from '../tutor.model';
import { TutoresService } from '../services/tutores.service';
import { ConfirmacaoService } from '../../../core/ui/confirmacao.service';
@Component({
  selector: 'app-tutores-lista',
  imports: [FormsModule, RouterLink],
  templateUrl: './tutores-lista.html',
  styleUrl: './tutores-lista.css',
})
export class TutoresLista implements OnInit {
  tutores: Tutor[] = [];
  termoBusca = '';
  carregando = false;
  erro = '';
  sucesso = '';
  constructor(private readonly api: TutoresService, private readonly confirmacao: ConfirmacaoService) {}
  ngOnInit(): void {
    this.carregarTutores();
  }
  carregarTutores(): void {
    this.carregando = true;
    this.erro = '';
    this.api.listar().subscribe({
      next: (xs) => {
        this.tutores = xs;
        this.carregando = false;
      },
      error: (e: Error) => {
        this.erro = e.message || 'Não foi possível carregar tutores.';
        this.carregando = false;
      },
    });
  }
  get tutoresFiltrados(): Tutor[] {
    const t = this.termoBusca.trim().toLocaleLowerCase();
    return this.tutores.filter((x) => x.nome.toLocaleLowerCase().includes(t));
  }
  async excluir(t: Tutor): Promise<void> {
    const aceitou = await this.confirmacao.confirmar({
      titulo: 'Excluir tutor?',
      descricao: `Tem certeza que deseja excluir o tutor "${t.nome}"? Esta ação não pode ser desfeita.`,
      textoConfirmar: 'Sim, excluir',
      tipo: 'perigo',
    });
    if (!aceitou) return;
    this.erro = '';
    this.sucesso = '';
    this.api.remover(t._id).subscribe({
      next: () => {
        this.sucesso = 'Tutor excluído.';
        this.carregarTutores();
      },
      error: (e: Error) => (this.erro = e.message),
    });
  }
}
