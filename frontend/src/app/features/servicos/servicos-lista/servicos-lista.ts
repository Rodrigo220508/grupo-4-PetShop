import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicosService } from '../services/servicos.service';
import { Servico, CATEGORIAS_SERVICO, CategoriaServico } from '../servico.model';
@Component({
  selector: 'app-servicos-lista',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './servicos-lista.html',
})
export class ServicosLista implements OnInit {
  private readonly api = inject(ServicosService);
  protected readonly categorias = CATEGORIAS_SERVICO;
  protected readonly filtro = signal<CategoriaServico | ''>('');
  protected readonly itens = signal<Servico[]>([]);
  protected readonly filtrados = computed(() =>
    this.itens().filter((x) => !this.filtro() || x.categoria === this.filtro()),
  );
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');
  ngOnInit(): void {
    this.carregar();
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listar().subscribe({
      next: (x) => {
        this.itens.set(x);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
  protected filtrar(c: string): void {
    this.filtro.set(c as CategoriaServico | '');
  }
  protected excluir(item: Servico): void {
    if (!confirm(`Inativar o serviço "${item.nome}"?`)) return;
    this.erro.set('');
    this.sucesso.set('');
    this.api.remover(item._id).subscribe({
      next: () => {
        this.sucesso.set('Serviço inativado.');
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
