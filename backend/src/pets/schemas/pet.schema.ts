import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const ESPECIES = ['cachorro', 'gato', 'ave', 'outro'] as const;
export type Especie = (typeof ESPECIES)[number];

export type PetDocument = HydratedDocument<Pet>;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60,
  })
  nome!: string;

  @Prop({
    type: String,
    required: true,
    enum: ESPECIES,
  })
  especie!: Especie;

  @Prop({ trim: true, maxlength: 60 })
  raca?: string;

  @Prop({
    type: Date,
    validate: {
      validator: (data: Date) => data <= new Date(),
      message: 'A data de nascimento não pode ser futura.',
    },
  })
  dataNascimento?: Date;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  tutor!: string;

  @Prop({ type: Boolean, default: true })
  ativo!: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);

PetSchema.index({ especie: 1 });
