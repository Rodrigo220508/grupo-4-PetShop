import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Profissional, ProfissionalEntrada } from '../profissional.model';
import { ProfissionaisService } from './profissionais.service';
@Injectable()
export class ProfissionaisMockService extends ProfissionaisService {
  private itens: Profissional[] = [
    {
      _id: '1',
      nome: 'Carla Oliveira',
      funcao: 'banhista',
      telefone: '(51) 99999-1111',
      email: 'carla@petshop.com',
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Rafael Martins',
      funcao: 'tosador',
      telefone: '(51) 99999-2222',
      email: 'rafael@petshop.com',
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Dra. Fernanda Lima',
      funcao: 'veterinario',
      telefone: '(51) 99999-3333',
      email: 'fernanda@petshop.com',
      crmv: 'CRMV-RS 12345',
      ativo: true,
    },
  ];
  private sequencia = 4;
  listar(): Observable<Profissional[]> {
    return of(this.itens.map((x) => ({ ...x }))).pipe(delay(300));
  }
  buscarPorId(id: string): Observable<Profissional> {
    const x = this.itens.find((x) => x._id === id);
    return x
      ? of({ ...x }).pipe(delay(300))
      : throwError(() => new Error('Profissional não encontrado.'));
  }
  criar(item: ProfissionalEntrada): Observable<Profissional> {
    const erro = this.validar(item);
    if (erro) return throwError(() => new Error(erro));
    const x = { ...item, _id: String(this.sequencia++), ativo: true };
    this.itens.push(x);
    return of({ ...x }).pipe(delay(300));
  }
  atualizar(id: string, item: ProfissionalEntrada): Observable<Profissional> {
    const pos = this.itens.findIndex((x) => x._id === id);
    if (pos < 0) return throwError(() => new Error('Profissional não encontrado.'));
    const erro = this.validar(item, id);
    if (erro) return throwError(() => new Error(erro));
    const x = { ...this.itens[pos], ...item };
    this.itens[pos] = x;
    return of({ ...x }).pipe(delay(300));
  }
  remover(id: string): Observable<void> {
    const pos = this.itens.findIndex((x) => x._id === id);
    if (pos < 0) return throwError(() => new Error('Profissional não encontrado.'));
    this.itens.splice(pos, 1);
    return of(undefined).pipe(delay(300));
  }
  private validar(x: ProfissionalEntrada, id?: string): string | null {
    if (x.nome.trim().length < 3 || x.nome.length > 80) return 'Nome entre 3 e 80 caracteres.';
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(x.telefone))
      return 'Telefone inválido. Use (51) 99999-9999.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.email)) return 'E-mail inválido.';
    if (this.itens.some((y) => y._id !== id && y.email.toLowerCase() === x.email.toLowerCase()))
      return 'Já existe um profissional com este e-mail.';
    if (x.funcao === 'veterinario' && !x.crmv?.trim())
      return 'O CRMV é obrigatório para veterinários.';
    if ((x.crmv || '').length > 20) return 'CRMV limitado a 20 caracteres.';
    return null;
  }
}
