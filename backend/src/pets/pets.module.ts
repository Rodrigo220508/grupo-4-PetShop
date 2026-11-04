import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './schemas/pet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  exports: [MongooseModule],
})
export class PetsModule {}
