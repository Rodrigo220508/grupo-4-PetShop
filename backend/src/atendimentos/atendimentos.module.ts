import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AtendimentosController } from './atendimentos.controller';
import { AtendimentosService } from './atendimentos.service';
import { Atendimento, AtendimentoSchema } from './schemas/atendimento.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Atendimento.name, schema: AtendimentoSchema },
    ]),
  ],
  controllers: [AtendimentosController],
  providers: [AtendimentosService],
})
export class AtendimentosModule {}
