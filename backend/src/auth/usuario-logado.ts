import type { Request } from 'express';
import type { Perfil } from '../usuarios/schemas/usuario.schema';

/** Conteúdo do token JWT (payload mínimo: id, nome e perfil). */
export interface UsuarioLogado {
  sub: string;
  nome: string;
  perfil: Perfil;
}

/** Requisição depois do JwtAuthGuard: traz o usuário do token. */
export type RequisicaoAutenticada = Request & { usuario?: UsuarioLogado };
