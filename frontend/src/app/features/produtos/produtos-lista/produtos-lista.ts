
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProdutoCard } from '../produto-card/produto-card';
import { CATEGORIAS, Categoria, Produto } from '../produto.model';
import { ProdutosService } from '../services/produtos.service';
import { ConfirmacaoService } from '../../../core/ui/confirmacao.service';

/** Tela de listagem de produtos. */
@Component({
  selector: 'app-produtos-lista',
  imports: [RouterLink, CurrencyPipe, ProdutoCard],
  templateUrl: './produtos-lista.html',
  styleUrl: './produtos-lista.css',
})
export class ProdutosLista implements OnInit {
  private readonly produtosService = inject(ProdutosService);
  private readonly confirmacao = inject(ConfirmacaoService);

  protected readonly categorias = CATEGORIAS;

  // Lista de produtos
  protected readonly produtos = signal<Produto[]>([]);

  // Indicadores do estoque
  protected readonly totalProdutos = computed(
    () => this.produtos().length
  );

  protected readonly produtosEmEstoque = computed(
    () => this.produtos().filter(p => p.estoque > 0).length
  );

  protected readonly produtosEsgotados = computed(
    () => this.produtos().filter(p => p.estoque === 0).length
  );

  // Estados da tela
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly filtro = signal<Categoria | ''>('');

  // Forma de exibição
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  ngOnInit(): void {
    this.carregar();
  }

  protected filtrar(valor: string): void {
    this.filtro.set(valor as Categoria | '');
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.produtosService.listar(this.filtro() || undefined).subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected async excluir(produto: Produto): Promise<void> {
    const aceitou = await this.confirmacao.confirmar({
      titulo: 'Excluir produto?',
      descricao: `Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`,
      textoConfirmar: 'Sim, excluir',
      tipo: 'perigo',
    });

    if (!aceitou) return;

    this.erro.set(null);
    this.sucesso.set(null);

    this.produtosService.remover(produto._id).subscribe({
      next: () => {
        this.sucesso.set(`Produto "${produto.nome}" excluído.`);
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
