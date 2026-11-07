import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ServicosService } from './servicos.service';
import { CATEGORIAS_SERVICO } from './schemas/servico.schema';

@ApiTags('Serviços')
@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar serviços' })
  @ApiQuery({
    name: 'categoria',
    required: false,
    enum: CATEGORIAS_SERVICO,
  })
  listar(@Query('categoria') categoria?: string) {
    const categoriaValida = CATEGORIAS_SERVICO.find(
      (item) => item === categoria,
    );

    if (categoria && !categoriaValida) {
      throw new BadRequestException('Categoria de serviço inválida');
    }

    return this.servicosService.listar(categoriaValida);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  buscarPorId(@Param('id') id: string) {
    return this.servicosService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar serviço' })
  criar(@Body() dto: CreateServicoDto) {
    return this.servicosService.criar(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateServicoDto) {
    return this.servicosService.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir serviço' })
  remover(@Param('id') id: string) {
    return this.servicosService.remover(id);
  }
}
