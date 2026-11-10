import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERFIS_KEY, Perfil } from '../decorators/perfis.decorator';
import { RequisicaoAutenticada } from '../usuario-logado';

/** Roda depois do JwtAuthGuard: confere se o perfil pode usar a rota (403). */
@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const exigidos = this.reflector.getAllAndOverride<Perfil[] | undefined>(
      PERFIS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!exigidos || exigidos.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequisicaoAutenticada>();
    const usuario = request.usuario; // preenchido pelo JwtAuthGuard
    if (!usuario || !exigidos.includes(usuario.perfil)) {
      throw new ForbiddenException(
        'Seu perfil não tem permissão para esta ação',
      );
    }

    return true;
  }
}
