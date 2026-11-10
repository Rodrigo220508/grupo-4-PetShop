import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ESPECIES, type Especie } from '../schemas/pet.schema';

export class CreatePetDto {
  @ApiProperty({ example: 'Rex' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(2, 60, {
    message: 'O nome deve ter entre 2 e 60 caracteres',
  })
  nome!: string;

  @ApiProperty({ enum: ESPECIES, example: 'cachorro' })
  @IsIn(ESPECIES, {
    message: `A espécie deve ser: ${ESPECIES.join(', ')}`,
  })
  especie!: Especie;

  @ApiPropertyOptional({ example: 'Labrador' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  raca?: string;

  @ApiPropertyOptional({ example: '2022-05-10' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de nascimento deve ser uma data válida' },
  )
  dataNascimento?: string;

  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsNotEmpty({ message: 'O tutor é obrigatório' })
  @IsMongoId({ message: 'O tutor informado não é válido' })
  tutor!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
