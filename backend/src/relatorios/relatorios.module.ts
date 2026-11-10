import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Atendimento,
  AtendimentoSchema,
} from '../atendimentos/schemas/atendimento.schema';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';
import { Tutor, TutorSchema } from '../tutores/schemas/tutor.schema';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tutor.name, schema: TutorSchema },
      { name: Pet.name, schema: PetSchema },
      { name: Atendimento.name, schema: AtendimentoSchema },
    ]),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
