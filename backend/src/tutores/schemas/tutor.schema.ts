import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TutorDocument = HydratedDocument<Tutor>;

@Schema({ timestamps: true, collection: 'tutores' })
export class Tutor {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome!: string;

  @Prop({
    required: true,
    trim: true,
    match: /^\(51\) \d{5}-\d{4}$/,
  })
  telefone!: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email!: string;

  @Prop({ trim: true, maxlength: 150 })
  endereco?: string;

  @Prop({ default: true })
  ativo!: boolean;
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);
