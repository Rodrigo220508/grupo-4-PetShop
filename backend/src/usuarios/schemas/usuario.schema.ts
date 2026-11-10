import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Perfis de acesso do PetShop (manual do tema, aulas 12 e 13)
export const PERFIS = ['admin', 'atendente', 'consulta'] as const;
export type Perfil = (typeof PERFIS)[number];

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome!: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email!: string;

  // select: false → o hash nunca volta nas buscas, só com .select('+senhaHash')
  @Prop({ required: true, select: false })
  senhaHash!: string;

  @Prop({ type: String, required: true, enum: PERFIS, default: 'atendente' })
  perfil!: Perfil;

  @Prop({ type: Boolean, default: true })
  ativo!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
