import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AtendimentosService } from './atendimentos.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { MudarStatusDto } from './dto/mudar-status.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import { STATUS, type Status } from './schemas/atendimento.schema';
@ApiTags('Atendimentos')
@Controller('atendimentos')
export class AtendimentosController {
  constructor(private readonly service: AtendimentosService) {}
  @Get()
  @ApiOperation({ summary: 'Lista atendimentos' })
  @ApiQuery({ name: 'status', required: false, enum: STATUS })
  listar(@Query('status') status?: Status) {
    return this.service.listar(status);
  }
  @Get(':id') buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post() criar(@Body() dto: CreateAtendimentoDto) {
    return this.service.criar(dto);
  }
  @Patch(':id/status') mudarStatus(
    @Param('id') id: string,
    @Body() dto: MudarStatusDto,
  ) {
    return this.service.mudarStatus(id, dto.status);
  }
  @Patch(':id') atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateAtendimentoDto,
  ) {
    return this.service.atualizar(id, dto);
  }
}
