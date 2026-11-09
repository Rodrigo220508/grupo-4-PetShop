
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Categoria, Produto, ProdutoEntrada } from '../produto.model';
import { ProdutosService } from './produtos.service';

@Injectable()
export class ProdutosMockService extends ProdutosService {
  private produtos: Produto[] = [
    {
      _id: '1',
      nome: 'Ração Golden Adultos 10 kg',
      descricao: 'Ração para cães adultos',
      preco: 129.90,
      estoque: 25,
      categoria: 'alimento',
      ativo: true
    },
    {
      _id: '2',
      nome: 'Sachê Whiskas Frango 85 g',
      descricao: 'Alimento úmido para gatos',
      preco: 4.50,
      estoque: 80,
      categoria: 'alimento',
      ativo: true
    },
    {
      _id: '3',
      nome: 'Shampoo Pet Neutro 500 ml',
      descricao: 'Shampoo para higiene de cães e gatos',
      preco: 24.90,
      estoque: 15,
      categoria: 'higiene',
      ativo: true
    },
    {
      _id: '4',
      nome: 'Tapete Higiênico 30 unidades',
      descricao: 'Tapete absorvente para cães',
      preco: 59.90,
      estoque: 0,
      categoria: 'higiene',
      ativo: true
    },
    {
      _id: '5',
      nome: 'Brinquedo Mordedor para Cães',
      descricao: 'Brinquedo resistente para cães',
      preco: 19.90,
      estoque: 20,
      categoria: 'outros',
      ativo: true
    },
    {
      _id: '6',
      nome: 'Coleira Ajustável para Cães',
      descricao: 'Coleira regulável',
      preco: 29.90,
      estoque: 18,
      categoria: 'outros',
      ativo: true
    },
    {
      _id: '7',
      nome: 'Areia Higiênica para Gatos 4 kg',
      descricao: 'Areia sanitária para gatos',
      preco: 22.90,
      estoque: 30,
      categoria: 'higiene',
      ativo: true
    },
    {
      _id: '8',
      nome: 'Petisco Bifinho para Cães',
      descricao: 'Petisco para cães',
      preco: 12.90,
      estoque: 40,
      categoria: 'alimento',
      ativo: true
    }
  ];

  private proximoId = 9;
  private readonly atraso = 400;

  listar(categoria?: Categoria): Observable<Produto[]> {
    const lista = categoria
      ? this.produtos.filter(p => p.categoria === categoria)
      : this.produtos;

    return of([...lista].sort((a, b) => a.nome.localeCompare(b.nome)))
      .pipe(delay(this.atraso));
  }

  buscarPorId(id: string): Observable<Produto> {
    const produto = this.produtos.find(p => p._id === id);

    return produto
      ? of({ ...produto }).pipe(delay(this.atraso))
      : throwError(() => new Error(`Produto ${id} não encontrado`));
  }

  criar(dados: ProdutoEntrada): Observable<Produto> {
    if (this.produtos.some(p => p.nome === dados.nome)) {
      return throwError(() => new Error(`Já existe um produto com o nome "${dados.nome}"`));
    }

    const novo: Produto = {
      ...dados,
      _id: String(this.proximoId++),
      ativo: dados.ativo ?? true
    };

    this.produtos.push(novo);
    return of(novo).pipe(delay(this.atraso));
  }

  atualizar(id: string, dados: Partial<ProdutoEntrada>): Observable<Produto> {
    const indice = this.produtos.findIndex(p => p._id === id);

    if (indice < 0) {
      return throwError(() => new Error(`Produto ${id} não encontrado`));
    }

    this.produtos[indice] = { ...this.produtos[indice], ...dados };
    return of(this.produtos[indice]).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const produto = this.produtos.find(p => p._id === id);

    if (produto && produto.estoque > 0) {
      return throwError(() => new Error(
        'Não é possível excluir um produto com estoque. Zere o estoque ou inative o produto.'
      ));
    }

    this.produtos = this.produtos.filter(p => p._id !== id);
    return of(undefined).pipe(delay(this.atraso));
  }
}
