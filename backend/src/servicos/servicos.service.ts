import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import {
  CategoriaServico,
  Servico,
  ServicoDocument,
} from './schemas/servico.schema';

@Injectable()
export class ServicosService {
  constructor(
    @InjectModel(Servico.name)
    private readonly servicoModel: Model<ServicoDocument>,
  ) {}

  async listar(categoria?: CategoriaServico): Promise<Servico[]> {
    const filtro = categoria ? { categoria } : {};
    return this.servicoModel.find(filtro).sort({ nome: 1 }).lean().exec();
  }

  async buscarPorId(id: string): Promise<Servico> {
    this.validarId(id);
    const servico = await this.servicoModel.findById(id).lean().exec();

    if (!servico) {
      throw new NotFoundException(`Serviço ${id} não encontrado`);
    }

    return servico;
  }

  async criar(dto: CreateServicoDto): Promise<Servico> {
    const criado = await this.servicoModel.create(dto);
    return criado.toObject();
  }

  async atualizar(id: string, dto: UpdateServicoDto): Promise<Servico> {
    this.validarId(id);

    const atualizado = await this.servicoModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!atualizado) {
      throw new NotFoundException(`Serviço ${id} não encontrado`);
    }

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    this.validarId(id);

    const removido = await this.servicoModel.findByIdAndDelete(id).exec();

    if (!removido) {
      throw new NotFoundException(`Serviço ${id} não encontrado`);
    }
  }

  private validarId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`O id "${id}" não é válido`);
    }
  }
}
