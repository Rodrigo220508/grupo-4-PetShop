import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { Servico, ServicoEntrada } from '../servico.model';
import { ServicosService } from './servicos.service';
@Injectable()
export class ServicosMockService extends ServicosService {
  private dados: Servico[] = [
    { _id: '1', nome: 'Banho', categoria: 'banho', preco: 60, duracaoMinutos: 60, ativo: true },
    { _id: '2', nome: 'Tosa', categoria: 'tosa', preco: 80, duracaoMinutos: 90, ativo: true },
    {
      _id: '3',
      nome: 'Consulta veterinária',
      categoria: 'veterinario',
      preco: 150,
      duracaoMinutos: 30,
      ativo: true,
    },
  ];
  private sequencia = 4;
  listar(): Observable<Servico[]> {
    return of(this.dados.filter((x) => x.ativo).map((x) => ({ ...x }))).pipe(delay(300));
  }
  listarTodos(): Observable<Servico[]> {
    return of(this.dados.map((x) => ({ ...x }))).pipe(delay(300));
  }
  buscarPorId(id: string): Observable<Servico> {
    const item = this.dados.find((x) => x._id === id);
    return item
      ? of({ ...item }).pipe(delay(300))
      : throwError(() => new Error('Serviço não encontrado.'));
  }
  criar(item: ServicoEntrada): Observable<Servico> {
    const erro = this.validar(item);
    if (erro) return throwError(() => new Error(erro));
    const novo = { ...item, _id: String(this.sequencia++), ativo: true };
    this.dados.push(novo);
    return of({ ...novo }).pipe(delay(300));
  }
  atualizar(id: string, item: ServicoEntrada): Observable<Servico> {
    const pos = this.dados.findIndex((x) => x._id === id);
    if (pos < 0) return throwError(() => new Error('Serviço não encontrado.'));
    const erro = this.validar(item, id);
    if (erro) return throwError(() => new Error(erro));
    const novo = { ...this.dados[pos], ...item };
    this.dados[pos] = novo;
    return of({ ...novo }).pipe(delay(300));
  }
  remover(id: string): Observable<void> {
    const item = this.dados.find((x) => x._id === id);
    if (!item) return throwError(() => new Error('Serviço não encontrado.'));
    item.ativo = false;
    return of(undefined).pipe(delay(300));
  }
  private validar(x: ServicoEntrada, id?: string): string | null {
    if (x.nome.trim().length < 3 || x.nome.length > 60)
      return 'Nome deve ter entre 3 e 60 caracteres.';
    if (
      this.dados.some(
        (d) => d._id !== id && d.nome.trim().toLowerCase() === x.nome.trim().toLowerCase(),
      )
    )
      return 'Já existe um serviço com esse nome.';
    if (x.preco < 0 || !Number.isFinite(x.preco)) return 'Preço inválido.';
    if (!Number.isInteger(x.duracaoMinutos) || x.duracaoMinutos < 10 || x.duracaoMinutos > 480)
      return 'Duração deve ter entre 10 e 480 minutos.';
    return null;
  }
}
