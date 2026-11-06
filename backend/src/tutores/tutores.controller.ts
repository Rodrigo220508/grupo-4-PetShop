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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { TutoresService } from './tutores.service';

@ApiTags('Tutores')
@Controller('tutores')
export class TutoresController {
  constructor(private readonly tutoresService: TutoresService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os tutores' })
  @ApiQuery({ name: 'busca', required: false, description: 'Busca pelo nome' })
  listar(@Query('busca') busca?: string) {
    return this.tutoresService.listar(busca);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um tutor pelo id' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  buscarPorId(@Param('id') id: string) {
    return this.tutoresService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra um tutor' })
  @ApiResponse({ status: 201, description: 'Tutor criado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  criar(@Body() dto: CreateTutorDto) {
    return this.tutoresService.criar(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um tutor' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateTutorDto) {
    return this.tutoresService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um tutor' })
  @ApiResponse({ status: 204, description: 'Tutor excluído' })
  remover(@Param('id') id: string) {
    return this.tutoresService.remover(id);
  }
}
