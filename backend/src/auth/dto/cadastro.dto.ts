import { OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';

/** Cadastro público pela tela: o perfil não vem do usuário (sempre "consulta"). */
export class CadastroDto extends OmitType(CreateUsuarioDto, ['perfil']) {}
