import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@petshop.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha!: string;
}
