import { SetMetadata } from '@nestjs/common';
import type { Perfil } from '../../usuarios/schemas/usuario.schema';

export type { Perfil };
export const PERFIS_KEY = 'perfis';

/** Restringe a rota aos perfis informados (o PerfisGuard devolve 403). */
export const Perfis = (...perfis: Perfil[]) => SetMetadata(PERFIS_KEY, perfis);
