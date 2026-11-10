import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { STATUS, Status } from '../../atendimentos/atendimento.model';
import {
  FaturamentoPorServico,
  RelatoriosApiService,
} from '../services/relatorios-api.service';
@Component({
  selector: 'app-relatorios-painel',
  imports: [CurrencyPipe],
  templateUrl: './relatorios-painel.html',
})
export class RelatoriosPainel implements OnInit {
  private readonly api = inject(RelatoriosApiService);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly resumo = signal({ tutores: 0, pets: 0, atendimentosAgendados: 0 });
  protected readonly porStatus = signal<{ status: Status; quantidade: number }[]>([]);
  protected readonly porServico = signal<FaturamentoPorServico[]>([]);
  ngOnInit(): void {
    this.carregar();
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    // Os números são calculados pela API com consultas agregadas no MongoDB
    forkJoin({
      resumo: this.api.resumo(),
      porStatus: this.api.atendimentosPorStatus(),
      porServico: this.api.faturamentoPorServico(),
    }).subscribe({
      next: ({ resumo, porStatus, porServico }) => {
        this.resumo.set(resumo);
        // Mostra todos os status, inclusive os que ainda não têm atendimentos
        this.porStatus.set(
          STATUS.map((status) => ({
            status,
            quantidade: porStatus.find((s) => s._id === status)?.quantidade ?? 0,
          })),
        );
        this.porServico.set(porServico);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}
