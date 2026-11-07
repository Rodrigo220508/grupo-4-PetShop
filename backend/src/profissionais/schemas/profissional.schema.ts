import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfissionalDocument = HydratedDocument<Profissional>;

@Schema({ timestamps: true, collection: 'profissionais' })
export class Profissional {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome!: string;

  @Prop({
    required: true,
    enum: ['banhista', 'tosador', 'veterinario'],
  })
  funcao!: string;

  @Prop({
    required: true,
    trim: true,
    match: /^\(51\) \d{5}-\d{4}$/,
  })
  telefone!: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email!: string;

  @Prop({ trim: true, maxlength: 20 })
  crmv?: string;

  @Prop({ default: true })
  ativo!: boolean;
}

export const ProfissionalSchema = SchemaFactory.createForClass(Profissional);
