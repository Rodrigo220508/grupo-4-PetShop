import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Especie, Pet, PetDocument } from './schemas/pet.schema';
import { Tutor, TutorDocument } from '../tutores/schemas/tutor.schema';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
    @InjectModel(Tutor.name)
    private readonly tutorModel: Model<TutorDocument>,
  ) {}

  async listar(especie?: Especie): Promise<Pet[]> {
    const filtro = especie ? { especie } : {};
    return this.petModel.find(filtro).sort({ nome: 1 }).lean().exec();
  }

  async buscarPorId(id: string): Promise<Pet> {
    this.validarId(id);

    const pet = await this.petModel.findById(id).lean().exec();

    if (!pet) {
      throw new NotFoundException(`Pet ${id} não encontrado`);
    }

    return pet;
  }

  async criar(dto: CreatePetDto): Promise<Pet> {
    await this.garantirTutorExiste(dto.tutor);

    const dados = {
      ...dto,
      dataNascimento: dto.dataNascimento
        ? new Date(dto.dataNascimento)
        : undefined,
    };

    const criado = await this.petModel.create(dados);
    return criado.toObject();
  }

  async atualizar(id: string, dto: UpdatePetDto): Promise<Pet> {
    this.validarId(id);

    if (dto.tutor) {
      await this.garantirTutorExiste(dto.tutor);
    }

    const dados = {
      ...dto,
      ...(dto.dataNascimento
        ? { dataNascimento: new Date(dto.dataNascimento) }
        : {}),
    };

    const atualizado = await this.petModel
      .findByIdAndUpdate(id, dados, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();

    if (!atualizado) {
      throw new NotFoundException(`Pet ${id} não encontrado`);
    }

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);
    await this.petModel.findByIdAndDelete(id).exec();
  }

  // O pet só pode ser ligado a um tutor que existe de verdade
  private async garantirTutorExiste(tutor: string): Promise<void> {
    const existe = await this.tutorModel.exists({ _id: tutor });

    if (!existe) {
      throw new NotFoundException('O tutor informado não foi encontrado');
    }
  }

  private validarId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`O id "${id}" não é válido`);
    }
  }
}
