import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Atendimento,
  AtendimentoDocument,
} from '../atendimentos/schemas/atendimento.schema';
import { Pet, PetDocument } from '../pets/schemas/pet.schema';
import { Tutor, TutorDocument } from '../tutores/schemas/tutor.schema';

export interface Resumo {
  tutores: number;
  pets: number;
  atendimentosAgendados: number;
}

export interface QuantidadePorStatus {
  _id: string;
  quantidade: number;
}

export interface FaturamentoPorServico {
  servico: string;
  quantidade: number;
  faturamento: number;
}

/** Módulo F: não tem coleção própria, só lê as coleções dos colegas. */
@Injectable()
export class RelatoriosService {
  constructor(
    @InjectModel(Tutor.name) private readonly tutorModel: Model<TutorDocument>,
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
    @InjectModel(Atendimento.name)
    private readonly atendimentoModel: Model<AtendimentoDocument>,
  ) {}

  // RF21: totais de tutores, pets e atendimentos agendados
  async resumo(): Promise<Resumo> {
    const [tutores, pets, atendimentosAgendados] = await Promise.all([
      this.tutorModel.countDocuments({ ativo: { $ne: false } }).exec(),
      this.petModel.countDocuments({ ativo: { $ne: false } }).exec(),
      this.atendimentoModel.countDocuments({ status: 'agendado' }).exec(),
    ]);
    return { tutores, pets, atendimentosAgendados };
  }

  // RF22: quantidade de atendimentos em cada status
  async atendimentosPorStatus(): Promise<QuantidadePorStatus[]> {
    return this.atendimentoModel
      .aggregate<QuantidadePorStatus>([
        { $group: { _id: '$status', quantidade: { $sum: 1 } } },
        { $sort: { quantidade: -1 } },
      ])
      .exec();
  }

  // RF23: atendimentos concluídos e faturamento por serviço
  async faturamentoPorServico(): Promise<FaturamentoPorServico[]> {
    return this.atendimentoModel
      .aggregate<FaturamentoPorServico>([
        { $match: { status: 'concluido' } },
        {
          $lookup: {
            from: 'servicos',
            localField: 'servico',
            foreignField: '_id',
            as: 's',
          },
        },
        { $unwind: '$s' },
        {
          $group: {
            _id: '$s.nome',
            quantidade: { $sum: 1 },
            faturamento: { $sum: '$s.preco' },
          },
        },
        {
          $project: { _id: 0, servico: '$_id', quantidade: 1, faturamento: 1 },
        },
        { $sort: { faturamento: -1 } },
      ])
      .exec();
  }
}
