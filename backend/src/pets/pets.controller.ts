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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';
import { ESPECIES, type Especie } from './schemas/pet.schema';

@ApiTags('Pets')
@ApiBearerAuth()
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os pets' })
  @ApiQuery({ name: 'especie', required: false, enum: ESPECIES })
  listar(@Query('especie') especie?: Especie) {
    return this.petsService.listar(especie);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pet pelo id' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado' })
  buscarPorId(@Param('id') id: string) {
    return this.petsService.buscarPorId(id);
  }

  @Perfis('admin', 'atendente')
  @Post()
  @ApiOperation({ summary: 'Cadastra um pet' })
  @ApiResponse({ status: 201, description: 'Pet criado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  criar(@Body() dto: CreatePetDto) {
    return this.petsService.criar(dto);
  }

  @Perfis('admin', 'atendente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pet' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado' })
  atualizar(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.atualizar(id, dto);
  }

  @Perfis('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um pet' })
  @ApiResponse({ status: 204, description: 'Pet excluído' })
  remover(@Param('id') id: string) {
    return this.petsService.remover(id);
  }
}
