import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { idDe, Referencia } from '../../../core/models/referencia';
import { PetsService } from '../../pets/services/pets.service';
import { ServicosService } from '../../servicos/services/servicos.service';
import { ProfissionaisService } from '../../profissionais/services/profissionais.service';
import { Atendimento, STATUS, Status, TRANSICOES } from '../atendimento.model';
import { AtendimentosService } from '../services/atendimentos.service';
@Component({
  selector: 'app-atendimentos-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './atendimentos-lista.html',
})
export class AtendimentosLista implements OnInit {
  private readonly api = inject(AtendimentosService);
  private readonly petsService = inject(PetsService);
  private readonly servicosService = inject(ServicosService);
  private readonly profissionaisService = inject(ProfissionaisService);
  protected readonly estados = STATUS;
  protected readonly transicoes = TRANSICOES;
  protected readonly itens = signal<Atendimento[]>([]);
  protected readonly carregando = signal(true);
  protected readonly operando = signal(false);
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');
  protected readonly status = signal<Status | ''>('');
  protected readonly nomesPets = signal<Record<string, string>>({});
  protected readonly nomesServicos = signal<Record<string, string>>({});
  protected readonly nomesProfissionais = signal<Record<string, string>>({});
  ngOnInit(): void {
    forkJoin({
      pets: this.petsService.listar(),
      servicos: this.servicosService.listarTodos(),
      profissionais: this.profissionaisService.listar(),
    }).subscribe({
      next: ({ pets, servicos, profissionais }) => {
        this.nomesPets.set(Object.fromEntries(pets.map((x) => [x._id, x.nome])));
        this.nomesServicos.set(Object.fromEntries(servicos.map((x) => [x._id, x.nome])));
        this.nomesProfissionais.set(Object.fromEntries(profissionais.map((x) => [x._id, x.nome])));
      },
      error: () => this.erro.set('Não foi possível carregar alguns nomes de referência.'),
    });
    this.carregar();
  }
  protected nome(ref: Referencia, tipo: 'pet' | 'servico' | 'profissional'): string {
    const id = idDe(ref);
    const mapa =
      tipo === 'pet'
        ? this.nomesPets()
        : tipo === 'servico'
          ? this.nomesServicos()
          : this.nomesProfissionais();
    return (
      mapa[id] ??
      (typeof ref === 'object' && typeof ref['nome'] === 'string' ? String(ref['nome']) : id)
    );
  }
  protected filtrar(valor: string): void {
    this.status.set(valor as Status | '');
    this.carregar();
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listar(this.status() || undefined).subscribe({
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
  protected avancar(a: Atendimento, destino: Status): void {
    if (!confirm(`Alterar o status do atendimento para "${destino}"?`)) return;
    this.operando.set(true);
    this.erro.set('');
    this.sucesso.set('');
    this.api.mudarStatus(a._id, destino).subscribe({
      next: () => {
        this.operando.set(false);
        this.sucesso.set('Status alterado com sucesso.');
        this.carregar();
      },
      error: (e: Error) => {
        this.operando.set(false);
        this.erro.set(e.message);
      },
    });
  }
}
