import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

/** Usuário como a API devolve: nunca com o hash da senha. */
export type UsuarioPublico = Omit<Usuario, 'senhaHash'> & { _id: unknown };

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async listar(): Promise<Usuario[]> {
    return this.usuarioModel.find().sort({ nome: 1 }).lean().exec();
  }

  async criar(dto: CreateUsuarioDto): Promise<UsuarioPublico> {
    const email = dto.email.trim().toLowerCase();

    const existente = await this.usuarioModel.findOne({ email }).lean().exec();
    if (existente) {
      throw new ConflictException(`Já existe um usuário com o e-mail ${email}`);
    }

    // Grava só o hash (bcrypt com salt), nunca a senha em texto
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const criado = await this.usuarioModel.create({
      nome: dto.nome.trim(),
      email,
      senhaHash,
      perfil: dto.perfil,
    });

    const { senhaHash: _hash, ...semSenha } = criado.toObject();
    void _hash;
    this.logger.log(`Usuário criado: ${email} (${dto.perfil})`);
    return semSenha;
  }

  /** Usado só pelo login: é a única busca que traz o hash da senha. */
  async buscarPorEmailComSenha(email: string) {
    return this.usuarioModel
      .findOne({ email: email.trim().toLowerCase(), ativo: true })
      .select('+senhaHash')
      .lean()
      .exec();
  }
}
