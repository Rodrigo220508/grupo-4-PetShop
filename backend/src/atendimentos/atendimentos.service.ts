import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import {
  Atendimento,
  AtendimentoDocument,
  Status,
} from './schemas/atendimento.schema';
const TRANSICOES: Record<Status, Status[]> = {
  agendado: ['em_atendimento', 'cancelado'],
  em_atendimento: ['concluido'],
  concluido: [],
  cancelado: [],
};
@Injectable()
export class AtendimentosService {
  constructor(
    @InjectModel(Atendimento.name)
    private readonly model: Model<AtendimentoDocument>,
  ) {}
  async listar(status?: Status) {
    if (status && !Object.keys(TRANSICOES).includes(status))
      throw new BadRequestException('Status inválido');
    return this.model
      .find(status ? { status } : {})
      .sort({ dataHora: 1 })
      .lean()
      .exec();
  }
  async buscarPorId(id: string) {
    this.validarId(id);
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('Atendimento não encontrado');
    return item;
  }
  async criar(dto: CreateAtendimentoDto) {
    this.validarFuturo(dto.dataHora);
    await this.garantirHorarioLivre(dto.profissional, new Date(dto.dataHora));
    try {
      const criado = await this.model.create({ ...dto, status: 'agendado' });
      return criado.toObject();
    } catch (e) {
      this.tratarDuplicidade(e);
      throw e;
    }
  }
  async atualizar(id: string, dto: UpdateAtendimentoDto) {
    const atual = await this.buscarPorId(id);
    if (atual.status !== 'agendado')
      throw new BadRequestException(
        'Somente atendimentos agendados podem ser editados',
      );
    const dataHora = dto.dataHora ?? atual.dataHora.toISOString();
    const profissional = dto.profissional ?? String(atual.profissional);
    this.validarFuturo(dataHora);
    await this.garantirHorarioLivre(profissional, new Date(dataHora), id);
    try {
      const atualizado = await this.model
        .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!atualizado)
        throw new NotFoundException('Atendimento não encontrado');
      return atualizado;
    } catch (e) {
      this.tratarDuplicidade(e);
      throw e;
    }
  }
  async mudarStatus(id: string, status: Status) {
    const atual = await this.buscarPorId(id);
    if (!TRANSICOES[atual.status].includes(status))
      throw new BadRequestException(
        `Não é possível passar de "${atual.status}" para "${status}"`,
      );
    // Atualização condicionada ao status atual evita transições concorrentes sobre dados antigos.
    const atualizado = await this.model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), status: atual.status },
        { $set: { status } },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!atualizado)
      throw new ConflictException(
        'Status alterado por outra operação. Recarregue a página.',
      );
    return atualizado;
  }
  private tratarDuplicidade(e: unknown): void {
    if (e && typeof e === 'object' && 'code' in e && e.code === 11000) {
      throw new ConflictException(
        'O profissional já tem um atendimento neste horário',
      );
    }
  }
  private validarId(id: string): void {
    if (!isValidObjectId(id)) throw new BadRequestException('ID inválido');
  }
  private validarFuturo(valor: string): void {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime()) || data.getTime() <= Date.now())
      throw new BadRequestException(
        'O atendimento precisa ser agendado para o futuro',
      );
  }
  private async garantirHorarioLivre(
    profissional: string,
    dataHora: Date,
    ignorarId?: string,
  ): Promise<void> {
    const filtro: Record<string, unknown> = {
      profissional: new Types.ObjectId(profissional),
      dataHora,
      status: { $ne: 'cancelado' },
    };
    if (ignorarId) filtro['_id'] = { $ne: new Types.ObjectId(ignorarId) };
    const existente = await this.model.findOne(filtro).lean().exec();
    if (existente)
      throw new ConflictException(
        'O profissional já tem um atendimento neste horário',
      );
  }
}
