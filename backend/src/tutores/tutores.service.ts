import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor, TutorDocument } from './schemas/tutor.schema';

@Injectable()
export class TutoresService {
  constructor(
    @InjectModel(Tutor.name)
    private readonly tutorModel: Model<TutorDocument>,
  ) {}

  async listar(busca?: string): Promise<Tutor[]> {
    const filtro = busca?.trim()
      ? { nome: { $regex: busca.trim(), $options: 'i' } }
      : {};

    return this.tutorModel.find(filtro).sort({ nome: 1 }).lean().exec();
  }

  async buscarPorId(id: string): Promise<Tutor> {
    this.validarId(id);

    const tutor = await this.tutorModel.findById(id).lean().exec();

    if (!tutor) {
      throw new NotFoundException(`Tutor ${id} não encontrado`);
    }

    return tutor;
  }

  async criar(dto: CreateTutorDto): Promise<Tutor> {
    await this.garantirEmailUnico(dto.email);

    const criado = await this.tutorModel.create({
      ...dto,
      email: dto.email.trim().toLowerCase(),
    });

    return criado.toObject();
  }

  async atualizar(id: string, dto: UpdateTutorDto): Promise<Tutor> {
    this.validarId(id);

    if (dto.email) {
      dto.email = dto.email.trim().toLowerCase();
      await this.garantirEmailUnico(dto.email, id);
    }

    const atualizado = await this.tutorModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!atualizado) {
      throw new NotFoundException(`Tutor ${id} não encontrado`);
    }

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    this.validarId(id);

    const removido = await this.tutorModel.findByIdAndDelete(id).exec();

    if (!removido) {
      throw new NotFoundException(`Tutor ${id} não encontrado`);
    }
  }

  private validarId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`O id "${id}" não é válido`);
    }
  }

  private async garantirEmailUnico(email: string, idAtual?: string) {
    const normalizado = email.trim().toLowerCase();

    const existente = await this.tutorModel
      .findOne({ email: normalizado })
      .lean()
      .exec();

    if (existente && String(existente._id) !== idAtual) {
      throw new ConflictException(
        `Já existe um tutor com o e-mail ${normalizado}`,
      );
    }
  }
}
