import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './schemas/pet.schema';
import { Tutor, TutorSchema } from '../tutores/schemas/tutor.schema';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: Tutor.name, schema: TutorSchema },
    ]),
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
