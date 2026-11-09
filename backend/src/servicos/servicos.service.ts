import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { Servico } from './schemas/servico.schema';

@Injectable()
export class ServicosService {
  constructor(
    @InjectModel(Servico.name)
    private readonly servicoModel: Model<Servico>,
  ) {}

  async listar() {
    return this.servicoModel
      .find({ ativo: true })
      .sort({ nome: 1 })
      .lean()
      .exec();
  }

  async listarTodos() {
    return this.servicoModel
      .find()
      .sort({ nome: 1 })
      .lean()
      .exec();
  }

  async buscarPorId(id: string) {
    this.validarId(id);

    const servico = await this.servicoModel.findById(id).lean().exec();

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return servico;
  }

  async criar(dados: CreateServicoDto) {
    const nome = dados.nome.trim();

    const existente = await this.servicoModel
      .findOne({ nome: { $regex: `^${this.escaparRegex(nome)}$`, $options: 'i' } })
      .exec();

    if (existente) {
      throw new ConflictException('Já existe um serviço com esse nome.');
    }

    try {
      return await this.servicoModel.create({
        ...dados,
        nome,
      });
    } catch (erro) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  async atualizar(id: string, dados: UpdateServicoDto) {
    this.validarId(id);

    const atual = await this.servicoModel.findById(id).exec();

    if (!atual) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    if (dados.nome !== undefined) {
      const nome = dados.nome.trim();

      const existente = await this.servicoModel
        .findOne({
          _id: { $ne: id },
          nome: { $regex: `^${this.escaparRegex(nome)}$`, $options: 'i' },
        })
        .exec();

      if (existente) {
        throw new ConflictException('Já existe um serviço com esse nome.');
      }

      dados.nome = nome;
    }

    try {
      const atualizado = await this.servicoModel
        .findByIdAndUpdate(id, dados, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      return atualizado;
    } catch (erro) {
      this.tratarErroDuplicidade(erro);
      throw erro;
    }
  }

  async remover(id: string) {
    this.validarId(id);

    const removido = await this.servicoModel
      .findByIdAndUpdate(id, { ativo: false }, { new: true })
      .lean()
      .exec();

    if (!removido) {
      throw new NotFoundException('Serviço não encontrado.');
    }
  }

  private validarId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de serviço inválido.');
    }
  }

  private escaparRegex(valor: string) {
    return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private tratarErroDuplicidade(erro: any) {
    if (erro?.code === 11000) {
      throw new ConflictException('Já existe um serviço com esse nome.');
    }
  }
}