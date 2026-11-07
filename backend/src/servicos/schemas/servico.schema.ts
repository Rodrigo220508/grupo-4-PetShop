import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const CATEGORIAS_SERVICO = [
  'banho',
  'tosa',
  'veterinario',
  'outros',
] as const;

export type CategoriaServico = (typeof CATEGORIAS_SERVICO)[number];

export type ServicoDocument = HydratedDocument<Servico>;

@Schema({ timestamps: true, collection: 'servicos' })
export class Servico {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 80,
  })
  nome!: string;

  @Prop({
    type: String,
    required: true,
    enum: CATEGORIAS_SERVICO,
  })
  categoria!: CategoriaServico;

  @Prop({ required: true, min: 0 })
  preco!: number;

  @Prop({ required: true, min: 1 })
  duracaoMinutos!: number;

  @Prop({ default: true })
  ativo!: boolean;
}

export const ServicoSchema = SchemaFactory.createForClass(Servico);

ServicoSchema.index({ categoria: 1 });
