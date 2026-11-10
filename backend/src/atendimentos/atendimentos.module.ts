import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AtendimentosController } from './atendimentos.controller';
import { AtendimentosService } from './atendimentos.service';
import { Atendimento, AtendimentoSchema } from './schemas/atendimento.schema';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';
import { Servico, ServicoSchema } from '../servicos/schemas/servico.schema';
import {
  Profissional,
  ProfissionalSchema,
} from '../profissionais/schemas/profissional.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Atendimento.name, schema: AtendimentoSchema },
      { name: Pet.name, schema: PetSchema },
      { name: Servico.name, schema: ServicoSchema },
      { name: Profissional.name, schema: ProfissionalSchema },
    ]),
  ],
  controllers: [AtendimentosController],
  providers: [AtendimentosService],
})
export class AtendimentosModule {}
