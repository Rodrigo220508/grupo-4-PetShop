import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de exceções (aula 14, slides 4 a 6).
 * Captura qualquer erro lançado pela aplicação, padroniza a resposta JSON
 * e registra logs sem expor detalhes internos ao cliente.
 *
 * Registrado no main.ts: app.useGlobalFilters(new ExcecoesFilter());
 */
@Catch() // sem parâmetro = captura QUALQUER erro
export class ExcecoesFilter implements ExceptionFilter {
  private readonly logger = new Logger('Erros');

  catch(excecao: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const resposta = ctx.getResponse<Response>();
    const requisicao = ctx.getRequest<Request>();

    const status =
      excecao instanceof HttpException
        ? excecao.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // HttpException → mensagem prevista; outro erro → mensagem genérica (nunca o stack)
    const message =
      excecao instanceof HttpException
        ? this.mensagemDe(excecao)
        : 'Erro interno. Tente novamente mais tarde.';

    const rota = `${requisicao.method} ${requisicao.url} → ${status}`;
    if (status >= 500) {
      const stack = excecao instanceof Error ? excecao.stack : String(excecao);
      this.logger.error(rota, stack ?? '');
    } else {
      this.logger.warn(`${rota}: ${JSON.stringify(message)}`);
    }

    resposta.status(status).json({
      sucesso: false,
      status,
      message,
      caminho: requisicao.url,
      dataHora: new Date().toISOString(),
    });
  }

  /** Texto (ou lista de textos do ValidationPipe) que vai para o cliente. */
  private mensagemDe(excecao: HttpException): string | string[] {
    const corpo = excecao.getResponse();
    if (typeof corpo === 'string') return corpo;
    if (corpo && typeof corpo === 'object' && 'message' in corpo) {
      const { message } = corpo;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.map(String);
    }
    return excecao.message;
  }
}
