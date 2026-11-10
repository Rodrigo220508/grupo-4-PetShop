import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { RelatoriosService } from './relatorios.service';

@ApiTags('Relatórios')
@ApiBearerAuth()
@Perfis('admin') // manual do tema: só o admin vê relatórios
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Totais de tutores, pets e atendimentos agendados' })
  resumo() {
    return this.relatoriosService.resumo();
  }

  @Get('atendimentos-por-status')
  @ApiOperation({ summary: 'Quantidade de atendimentos em cada status' })
  atendimentosPorStatus() {
    return this.relatoriosService.atendimentosPorStatus();
  }

  @Get('faturamento-por-servico')
  @ApiOperation({
    summary: 'Atendimentos concluídos e faturamento por serviço',
  })
  faturamentoPorServico() {
    return this.relatoriosService.faturamentoPorServico();
  }
}
