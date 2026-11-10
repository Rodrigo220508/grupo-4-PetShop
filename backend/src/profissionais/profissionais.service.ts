import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import {
  Profissional,
  ProfissionalDocument,
} from './schemas/profissional.schema';

@Injectable()
export class ProfissionaisService {
  constructor(
    @InjectModel(Profissional.name)
    private readonly profissionalModel: Model<ProfissionalDocument>,
  ) {}

  async listar(busca?: string): Promise<Profissional[]> {
    const filtro = busca?.trim()
      ? { nome: { $regex: busca.trim(), $options: 'i' } }
      : {};

    return this.profissionalModel.find(filtro).sort({ nome: 1 }).lean().exec();
  }

  async buscarPorId(id: string): Promise<Profissional> {
    this.validarId(id);

    const profissional = await this.profissionalModel
      .findById(id)
      .lean()
      .exec();

    if (!profissional) {
      throw new NotFoundException(`Profissional ${id} não encontrado`);
    }

    return profissional;
  }

  async criar(dto: CreateProfissionalDto): Promise<Profissional> {
    await this.garantirEmailUnico(dto.email);

    const dados = this.prepararDados(dto);

    const criado = await this.profissionalModel.create(dados);

    return criado.toObject();
  }

  async atualizar(
    id: string,
    dto: UpdateProfissionalDto,
  ): Promise<Profissional> {
    this.validarId(id);

    if (dto.email) {
      dto.email = dto.email.trim().toLowerCase();
      await this.garantirEmailUnico(dto.email, id);
    }

    const dados = this.prepararDados(dto);

    const atualizado = await this.profissionalModel
      .findByIdAndUpdate(id, dados, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();

    if (!atualizado) {
      throw new NotFoundException(`Profissional ${id} não encontrado`);
    }

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    this.validarId(id);

    const removido = await this.profissionalModel.findByIdAndDelete(id).exec();

    if (!removido) {
      throw new NotFoundException(`Profissional ${id} não encontrado`);
    }
  }

  private validarId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`O id "${id}" não é válido`);
    }
  }

  private async garantirEmailUnico(email: string, idAtual?: string) {
    const normalizado = email.trim().toLowerCase();

    const existente = await this.profissionalModel
      .findOne({ email: normalizado })
      .lean()
      .exec();

    if (existente && String(existente._id) !== idAtual) {
      throw new ConflictException(
        `Já existe um profissional com o e-mail ${normalizado}`,
      );
    }
  }

  private prepararDados(dto: CreateProfissionalDto | UpdateProfissionalDto) {
    const dados = { ...dto };

    if (dados.email) {
      dados.email = dados.email.trim().toLowerCase();
    }

    if (dados.nome) {
      dados.nome = dados.nome.trim();
    }

    if (dados.telefone) {
      dados.telefone = dados.telefone.trim();
    }

    if (dados.crmv !== undefined) {
      dados.crmv = dados.crmv.trim();
    }

    if (dados.funcao !== 'veterinario' && dados.crmv === '') {
      dados.crmv = undefined;
    }

    return dados;
  }
}
