import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TutoresController } from './tutores.controller';
import { TutoresService } from './tutores.service';
import { Tutor, TutorSchema } from './schemas/tutor.schema';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tutor.name, schema: TutorSchema },
      { name: Pet.name, schema: PetSchema },
    ]),
  ],
  controllers: [TutoresController],
  providers: [TutoresService],
  exports: [TutoresService],
})
export class TutoresModule {}
