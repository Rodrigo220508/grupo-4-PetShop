import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TutoresService } from '../../tutores/services/tutores.service';
import { PetsService } from '../../pets/services/pets.service';
import { AtendimentosService } from '../../atendimentos/services/atendimentos.service';
import { ServicosService } from '../../servicos/services/servicos.service';
import { STATUS, Status } from '../../atendimentos/atendimento.model';
import { idDe } from '../../../core/models/referencia';
@Component({
  selector: 'app-relatorios-painel',
  imports: [CurrencyPipe],
  templateUrl: './relatorios-painel.html',
})
export class RelatoriosPainel implements OnInit {
  private readonly tutores = inject(TutoresService);
  private readonly pets = inject(PetsService);
  private readonly atendimentos = inject(AtendimentosService);
  private readonly servicos = inject(ServicosService);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly resumo = signal({ tutores: 0, pets: 0, atendimentosAgendados: 0 });
  protected readonly porStatus = signal<{ status: Status; quantidade: number }[]>([]);
  protected readonly porServico = signal<
    { servico: string; quantidade: number; faturamento: number }[]
  >([]);
  ngOnInit(): void {
    this.carregar();
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    // C1: calcula indicadores locais a partir dos mocks. A API real será integrada no C4.
    forkJoin({
      tutores: this.tutores.listar(),
      pets: this.pets.listar(),
      atendimentos: this.atendimentos.listar(),
      servicos: this.servicos.listarTodos(),
    }).subscribe({
      next: ({ tutores, pets, atendimentos, servicos }) => {
        this.resumo.set({
          tutores: tutores.length,
          pets: pets.length,
          atendimentosAgendados: atendimentos.filter((a) => a.status === 'agendado').length,
        });
        this.porStatus.set(
          STATUS.map((status) => ({
            status,
            quantidade: atendimentos.filter((a) => a.status === status).length,
          })),
        );
        this.porServico.set(
          servicos.map((servico) => {
            const concluidos = atendimentos.filter(
              (a) => a.status === 'concluido' && idDe(a.servico) === servico._id,
            );
            return {
              servico: servico.nome,
              quantidade: concluidos.length,
              faturamento: concluidos.length * servico.preco,
            };
          }),
        );
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}
