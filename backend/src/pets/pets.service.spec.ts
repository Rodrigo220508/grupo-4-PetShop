import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';
import { Pet } from './schemas/pet.schema';
import { Tutor } from '../tutores/schemas/tutor.schema';

// Simula as consultas do Mongoose
const consulta = <T>(resultado: T) => ({
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(resultado),
});

describe('PetsService', () => {
  let service: PetsService;

  const id = new Types.ObjectId().toString();

  const pet = {
    _id: id,
    nome: 'Rex',
    especie: 'cachorro',
    raca: 'Labrador',
    tutor: 'ID_DO_TUTOR',
    ativo: true,
  };

  const modelMock = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const tutorModelMock = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    tutorModelMock.exists.mockResolvedValue({ _id: 'ID_DO_TUTOR' });

    const modulo = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getModelToken(Pet.name),
          useValue: modelMock,
        },
        {
          provide: getModelToken(Tutor.name),
          useValue: tutorModelMock,
        },
      ],
    }).compile();

    service = modulo.get(PetsService);
  });

  it('lista os pets filtrando por espécie', async () => {
    modelMock.find.mockReturnValue(consulta([pet]));

    const resultado = await service.listar('cachorro');

    expect(modelMock.find).toHaveBeenCalledWith({
      especie: 'cachorro',
    });
    expect(resultado).toEqual([pet]);
  });

  it('busca um pet existente pelo id', async () => {
    modelMock.findById.mockReturnValue(consulta(pet));

    await expect(service.buscarPorId(id)).resolves.toEqual(pet);
  });

  it('lança 404 quando o pet não existe', async () => {
    modelMock.findById.mockReturnValue(consulta(null));

    await expect(service.buscarPorId(id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lança 400 quando o id é inválido', async () => {
    await expect(service.buscarPorId('abc')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('cadastra um novo pet', async () => {
    modelMock.create.mockResolvedValue({
      toObject: () => pet,
    });

    const dto: CreatePetDto = {
      nome: 'Rex',
      especie: 'cachorro',
      raca: 'Labrador',
      tutor: 'ID_DO_TUTOR',
    };

    await expect(service.criar(dto)).resolves.toEqual(pet);
    expect(modelMock.create).toHaveBeenCalled();
  });

  it('atualiza um pet existente', async () => {
    const dto: UpdatePetDto = {
      nome: 'Max',
    };

    modelMock.findByIdAndUpdate.mockReturnValue(
      consulta({ ...pet, nome: 'Max' }),
    );

    await expect(service.atualizar(id, dto)).resolves.toEqual({
      ...pet,
      nome: 'Max',
    });

    expect(modelMock.findByIdAndUpdate).toHaveBeenCalledWith(id, dto, {
      new: true,
      runValidators: true,
    });
  });

  it('lança 404 ao tentar atualizar um pet inexistente', async () => {
    modelMock.findByIdAndUpdate.mockReturnValue(consulta(null));

    await expect(service.atualizar(id, { nome: 'Max' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('exclui um pet existente', async () => {
    modelMock.findById.mockReturnValue(consulta(pet));
    modelMock.findByIdAndDelete.mockReturnValue(consulta(null));

    await expect(service.remover(id)).resolves.toBeUndefined();

    expect(modelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
