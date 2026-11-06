import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTutorDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 80, {
    message: 'O nome deve ter entre 3 e 80 caracteres',
  })
  nome!: string;

  @ApiProperty({ example: '(51) 99999-9999' })
  @IsString()
  @Matches(/^\(51\) \d{5}-\d{4}$/, {
    message: 'Telefone inválido. Use o formato (51) 99999-9999',
  })
  telefone!: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 100' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  endereco?: string;
}
