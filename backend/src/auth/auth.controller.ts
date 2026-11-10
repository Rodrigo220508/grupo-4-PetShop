import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Publico } from './decorators/publico.decorator';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';
import type { RequisicaoAutenticada } from './usuario-logado';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Publico()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Entra no sistema e devolve o token JWT' })
  @ApiResponse({ status: 200, description: 'Token e dados do usuário' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @Publico()
  @Post('cadastro')
  @ApiOperation({ summary: 'Cria uma conta com perfil "consulta"' })
  @ApiResponse({ status: 201, description: 'Conta criada' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  cadastrar(@Body() dto: CadastroDto) {
    return this.authService.cadastrar(dto);
  }

  @Get('eu')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados do usuário dono do token' })
  eu(@Req() req: RequisicaoAutenticada) {
    return req.usuario;
  }
}
