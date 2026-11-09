import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CATEGORIAS_SERVICO } from '../schemas/servico.schema';
import type { CategoriaServico } from '../schemas/servico.schema';
export class CreateServicoDto {
  @ApiProperty({ example: 'Banho completo' })
  @IsString()
  @Length(3, 60)
  nome: string;

  @ApiProperty({ enum: CATEGORIAS_SERVICO, example: 'banho' })
  @IsIn(CATEGORIAS_SERVICO)
  categoria: CategoriaServico;

  @ApiProperty({ example: 60 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;

  @ApiProperty({ example: 60 })
  @IsInt()
  @Min(10)
  duracaoMinutos: number;
}