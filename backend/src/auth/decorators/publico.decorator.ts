import { SetMetadata } from '@nestjs/common';

export const ROTA_PUBLICA = 'rotaPublica';

/** Marca a rota como pública: o JwtAuthGuard não exige token nela. */
export const Publico = () => SetMetadata(ROTA_PUBLICA, true);
