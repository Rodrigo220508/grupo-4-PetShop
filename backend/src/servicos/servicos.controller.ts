import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ServicosService } from './servicos.service';

@ApiTags('Serviços')
@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os serviços ativos' })
  listar() {
    return this.servicosService.listar();
  }

  @Get('todos')
  @ApiOperation({ summary: 'Lista todos os serviços, inclusive inativos' })
  listarTodos() {
    return this.servicosService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um serviço pelo ID' })
  buscarPorId(@Param('id') id: string) {
    return this.servicosService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra um serviço' })
  criar(@Body() dados: CreateServicoDto) {
    return this.servicosService.criar(dados);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um serviço' })
  atualizar(
    @Param('id') id: string,
    @Body() dados: UpdateServicoDto,
  ) {
    return this.servicosService.atualizar(id, dados);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativa um serviço' })
  remover(@Param('id') id: string) {
    return this.servicosService.remover(id);
  }
}