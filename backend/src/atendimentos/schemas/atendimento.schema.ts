import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export const STATUS = [
  'agendado',
  'em_atendimento',
  'concluido',
  'cancelado',
] as const;
export type Status = (typeof STATUS)[number];
export type AtendimentoDocument = HydratedDocument<Atendimento>;
@Schema({ timestamps: true, collection: 'atendimentos' })
export class Atendimento {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  pet: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Servico', required: true })
  servico: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Profissional', required: true })
  profissional: Types.ObjectId;
  @Prop({ type: Date, required: true }) dataHora: Date;
  @Prop({ type: String, trim: true, maxlength: 300 }) observacoes?: string;
  @Prop({ type: String, enum: STATUS, default: 'agendado' }) status: Status;
}
export const AtendimentoSchema = SchemaFactory.createForClass(Atendimento);
AtendimentoSchema.index({ status: 1, dataHora: 1 });
// Impede horários duplicados inclusive em requisições simultâneas (MongoDB 6+).
// Cancelados ficam de fora do índice para permitir novo agendamento do horário.
AtendimentoSchema.index(
  { profissional: 1, dataHora: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['agendado', 'em_atendimento', 'concluido'] },
    },
  },
);
