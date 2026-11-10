import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosService } from './usuarios.service';

@ApiTags('Usuários')
@ApiBearerAuth()
@Perfis('admin') // só o administrador gerencia usuários
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os usuários (sem as senhas)' })
  listar() {
    return this.usuariosService.listar();
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra um usuário com qualquer perfil' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  criar(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.criar(dto);
  }
}
