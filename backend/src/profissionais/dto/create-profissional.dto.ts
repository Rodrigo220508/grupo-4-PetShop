import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateProfissionalDto {
  @ApiProperty({ example: 'Carla Oliveira' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 80, {
    message: 'O nome deve ter entre 3 e 80 caracteres',
  })
  nome!: string;

  @ApiProperty({
    example: 'banhista',
    enum: ['banhista', 'tosador', 'veterinario'],
  })
  @IsIn(['banhista', 'tosador', 'veterinario'], {
    message: 'Função inválida',
  })
  funcao!: string;

  @ApiProperty({ example: '(51) 99999-1111' })
  @IsString()
  @Matches(/^\(51\) \d{5}-\d{4}$/, {
    message: 'Telefone inválido. Use o formato (51) 99999-9999',
  })
  telefone!: string;

  @ApiProperty({ example: 'carla@petshop.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiPropertyOptional({ example: 'CRMV-RS 12345' })
  @ValidateIf(
    (o: CreateProfissionalDto) => o.funcao === 'veterinario' || !!o.crmv,
  )
  @IsString()
  @IsNotEmpty({ message: 'O CRMV é obrigatório para veterinários' })
  @MaxLength(20, { message: 'CRMV limitado a 20 caracteres' })
  crmv?: string;
}
