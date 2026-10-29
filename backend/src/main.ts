import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RespostaInterceptor } from './common/interceptors/resposta.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas as rotas começam com /api/v1 (versionamento desde o início — PDF 04, cap. 11)
  app.setGlobalPrefix('api/v1');

  // Permite que o front-end Angular (porta 4200) chame a API
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:4200')
      .split(',')
      .map((x) => x.trim()),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  // Respostas de API não devem ser armazenadas em caches compartilhados.
  app.use(
    (
      _req: unknown,
      res: { setHeader: (chave: string, valor: string) => void },
      next: () => void,
    ) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.setHeader('Cache-Control', 'no-store');
      next();
    },
  );

  // Validação automática dos DTOs (PDF 04, cap. 12 e 13)
  // whitelist: remove campos que não estão no DTO
  // forbidNonWhitelisted: devolve 400 se vier campo desconhecido
  // transform: converte o JSON recebido na classe do DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Padrão único de resposta de sucesso (PDF 04, cap. 14)
  app.useGlobalInterceptors(new RespostaInterceptor());

  // Documentação Swagger em http://localhost:3000/api/docs (PDF 06)
  const config = new DocumentBuilder()
    .setTitle('Projeto Integrador – API')
    .setDescription('API do Projeto Integrador da Sprint 5')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, config),
    );
  }

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`API rodando em http://localhost:${porta}/api/v1`);
  if (process.env.NODE_ENV !== 'production')
    console.log(`Swagger em http://localhost:${porta}/api/docs`);
}
void bootstrap();
