import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FUNCOES, Funcao, Profissional } from '../profissional.model';
import { ProfissionaisService } from '../services/profissionais.service';
import { ConfirmacaoService } from '../../../core/ui/confirmacao.service';
@Component({
  selector: 'app-profissionais-lista',
  imports: [RouterLink],
  templateUrl: './profissionais-lista.html',
})
export class ProfissionaisLista implements OnInit {
  private readonly api = inject(ProfissionaisService);
  private readonly confirmacao = inject(ConfirmacaoService);
  protected readonly funcoes = FUNCOES;
  protected readonly itens = signal<Profissional[]>([]);
  protected readonly filtro = signal<Funcao | ''>('');
  protected readonly filtrados = computed(() =>
    this.itens().filter((x) => !this.filtro() || x.funcao === this.filtro()),
  );
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');
  protected readonly carregando = signal(true);
  ngOnInit(): void {
    this.carregar();
  }
  protected filtrar(v: string): void {
    this.filtro.set(v as Funcao | '');
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listar().subscribe({
      next: (xs) => {
        this.itens.set(xs);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  protected async excluir(p: Profissional): Promise<void> {
    const aceitou = await this.confirmacao.confirmar({
      titulo: 'Excluir profissional?',
      descricao: `Tem certeza que deseja excluir "${p.nome}" da lista de profissionais?`,
      textoConfirmar: 'Sim, excluir',
      tipo: 'perigo',
    });
    if (!aceitou) return;
    this.erro.set('');
    this.sucesso.set('');
    this.api.remover(p._id).subscribe({
      next: () => {
        this.sucesso.set('Profissional excluído.');
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
