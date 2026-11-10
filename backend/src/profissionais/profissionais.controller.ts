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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { ProfissionaisService } from './profissionais.service';

@ApiTags('Profissionais')
@ApiBearerAuth()
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os profissionais' })
  @ApiQuery({
    name: 'busca',
    required: false,
    description: 'Busca pelo nome',
  })
  listar(@Query('busca') busca?: string) {
    return this.profissionaisService.listar(busca);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um profissional pelo id' })
  @ApiResponse({ status: 404, description: 'Profissional não encontrado' })
  buscarPorId(@Param('id') id: string) {
    return this.profissionaisService.buscarPorId(id);
  }

  @Perfis('admin', 'atendente')
  @Post()
  @ApiOperation({ summary: 'Cadastra um profissional' })
  @ApiResponse({ status: 201, description: 'Profissional criado' })
  @ApiResponse({ status: 400, description: 'Dados invalidos' })
  @ApiResponse({ status: 409, description: 'E-mail ja cadastrado' })
  criar(@Body() dto: CreateProfissionalDto) {
    return this.profissionaisService.criar(dto);
  }

  @Perfis('admin', 'atendente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um profissional' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateProfissionalDto) {
    return this.profissionaisService.atualizar(id, dto);
  }

  @Perfis('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um profissional' })
  @ApiResponse({ status: 204, description: 'Profissional excluido' })
  remover(@Param('id') id: string) {
    return this.profissionaisService.remover(id);
  }
}
