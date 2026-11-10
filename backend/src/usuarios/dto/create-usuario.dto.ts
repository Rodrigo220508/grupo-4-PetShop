import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { PERFIS, type Perfil } from '../schemas/usuario.schema';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Ana Souza' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 80, { message: 'O nome deve ter entre 3 e 80 caracteres' })
  nome!: string;

  @ApiProperty({ example: 'ana@petshop.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @Length(8, 72, { message: 'A senha deve ter entre 8 e 72 caracteres' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'A senha precisa ter letras e números',
  })
  senha!: string;

  @ApiProperty({ enum: PERFIS, example: 'atendente' })
  @IsIn(PERFIS, { message: `O perfil deve ser: ${PERFIS.join(', ')}` })
  perfil!: Perfil;
}
