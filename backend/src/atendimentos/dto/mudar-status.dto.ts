import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { STATUS, type Status } from '../schemas/atendimento.schema';
export class MudarStatusDto {
  @ApiProperty({ enum: STATUS }) @IsIn(STATUS) status: Status;
}
