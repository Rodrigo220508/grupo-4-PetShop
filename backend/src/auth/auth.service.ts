import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CadastroDto } from './dto/cadastro.dto';
import { UsuarioLogado } from './usuario-logado';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usuariosService.buscarPorEmailComSenha(email);

    // Mesma mensagem para e-mail inexistente e senha errada:
    // assim a API não revela quais e-mails estão cadastrados.
    const senhaValida =
      !!usuario && (await bcrypt.compare(senha, usuario.senhaHash));
    if (!usuario || !senhaValida) {
      this.logger.warn(`Login recusado para ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Payload mínimo: nada de e-mail ou senha dentro do token
    const payload: UsuarioLogado = {
      sub: String(usuario._id),
      nome: usuario.nome,
      perfil: usuario.perfil,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      usuario: {
        _id: String(usuario._id),
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }

  /** Cadastro aberto pela tela: cria sempre com o perfil "consulta". */
  cadastrar(dto: CadastroDto) {
    return this.usuariosService.criar({ ...dto, perfil: 'consulta' });
  }
}
