import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TutoresController } from './tutores.controller';
import { TutoresService } from './tutores.service';
import { Tutor, TutorSchema } from './schemas/tutor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tutor.name, schema: TutorSchema },
    ]),
  ],
  controllers: [TutoresController],
  providers: [TutoresService],
  exports: [TutoresService],
})
export class TutoresModule {}