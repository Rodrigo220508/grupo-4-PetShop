import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { idDe } from '../../../core/models/referencia';
import { Atendimento, AtendimentoEntrada, Status, TRANSICOES } from '../atendimento.model';
import { AtendimentosService } from './atendimentos.service';

/** Somente demonstração C1: segurança efetiva das regras exige validação no back-end. */
@Injectable()
export class AtendimentosMockService extends AtendimentosService {
  private readonly atraso = 300;
  private proximoId = 4;
  private readonly futuro = (dias: number, hora: number) => {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    data.setHours(hora, 0, 0, 0);
    const local = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
  private atendimentos: Atendimento[] = [
    {
      _id: '1',
      pet: '1',
      servico: '1',
      profissional: '1',
      dataHora: this.futuro(3, 10),
      status: 'agendado',
      observacoes: 'Pet com medo de secador',
    },
    {
      _id: '2',
      pet: '2',
      servico: '2',
      profissional: '2',
      dataHora: this.futuro(4, 14),
      status: 'agendado',
    },
    {
      _id: '3',
      pet: '3',
      servico: '1',
      profissional: '1',
      dataHora: this.futuro(5, 11),
      status: 'agendado',
    },
  ];

  listar(status?: Status): Observable<Atendimento[]> {
    return of(
      this.atendimentos
        .filter((a) => !status || a.status === status)
        .map((a) => ({ ...a }))
        .sort((a, b) => a.dataHora.localeCompare(b.dataHora)),
    ).pipe(delay(this.atraso));
  }
  buscarPorId(id: string): Observable<Atendimento> {
    const a = this.atendimentos.find((item) => item._id === id);
    return a
      ? of({ ...a }).pipe(delay(this.atraso))
      : throwError(() => new Error('Atendimento não encontrado.'));
  }
  criar(dados: AtendimentoEntrada): Observable<Atendimento> {
    const erro = this.validar(dados);
    if (erro) return throwError(() => new Error(erro));
    const novo: Atendimento = { ...dados, _id: String(this.proximoId++), status: 'agendado' };
    this.atendimentos.push(novo);
    return of({ ...novo }).pipe(delay(this.atraso));
  }
  atualizar(id: string, dados: AtendimentoEntrada): Observable<Atendimento> {
    const pos = this.atendimentos.findIndex((a) => a._id === id);
    if (pos < 0) return throwError(() => new Error('Atendimento não encontrado.'));
    if (this.atendimentos[pos].status !== 'agendado') {
      return throwError(() => new Error('Somente atendimentos agendados podem ser editados.'));
    }
    const erro = this.validar(dados, id);
    if (erro) return throwError(() => new Error(erro));
    const atualizado = { ...this.atendimentos[pos], ...dados };
    this.atendimentos[pos] = atualizado;
    return of({ ...atualizado }).pipe(delay(this.atraso));
  }
  mudarStatus(id: string, status: Status): Observable<Atendimento> {
    const a = this.atendimentos.find((item) => item._id === id);
    if (!a) return throwError(() => new Error('Atendimento não encontrado.'));
    if (!TRANSICOES[a.status].includes(status)) {
      return throwError(
        () => new Error(`Não é possível passar de "${a.status}" para "${status}".`),
      );
    }
    a.status = status;
    return of({ ...a }).pipe(delay(this.atraso));
  }
  private validar(dados: AtendimentoEntrada, idAtual?: string): string | null {
    if (!dados.pet || !dados.servico || !dados.profissional || !dados.dataHora)
      return 'Preencha todos os campos obrigatórios.';
    if (
      Number.isNaN(new Date(dados.dataHora).getTime()) ||
      new Date(dados.dataHora) <= new Date()
    ) {
      return 'O atendimento precisa ser agendado para o futuro.';
    }
    if ((dados.observacoes ?? '').length > 300)
      return 'Observações devem ter no máximo 300 caracteres.';
    const conflito = this.atendimentos.some(
      (a) =>
        a._id !== idAtual &&
        a.status !== 'cancelado' &&
        idDe(a.profissional) === dados.profissional &&
        new Date(a.dataHora).getTime() === new Date(dados.dataHora).getTime(),
    );
    if (conflito) return 'O profissional já tem um atendimento neste horário.';
    return null;
  }
}
