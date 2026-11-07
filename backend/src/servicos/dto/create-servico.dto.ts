import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import {
  CATEGORIAS_SERVICO,
  type CategoriaServico,
} from '../schemas/servico.schema';

export class CreateServicoDto {
  @ApiProperty({ example: 'Banho completo' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 80, {
    message: 'O nome deve ter entre 3 e 80 caracteres',
  })
  nome!: string;

  @ApiProperty({ enum: CATEGORIAS_SERVICO, example: 'banho' })
  @IsIn(CATEGORIAS_SERVICO, {
    message: `Categoria deve ser: ${CATEGORIAS_SERVICO.join(', ')}`,
  })
  categoria!: CategoriaServico;

  @ApiProperty({ example: 50 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  preco!: number;

  @ApiProperty({ example: 60 })
  @IsInt({ message: 'A duração deve ser um número inteiro' })
  @Min(1, { message: 'A duração deve ser maior que zero' })
  duracaoMinutos!: number;
}
