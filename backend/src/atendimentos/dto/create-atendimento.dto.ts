import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateAtendimentoDto {
  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId()
  pet: string;
  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId()
  servico: string;
  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId()
  profissional: string;
  @ApiProperty({ example: '2026-11-20T14:00:00.000Z' })
  @IsDateString()
  dataHora: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  observacoes?: string;
}
