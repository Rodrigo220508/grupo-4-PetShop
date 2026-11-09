import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProdutosModule } from './produtos/produtos.module';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { PetsModule } from './pets/pets.module';
import { TutoresModule } from './tutores/tutores.module';
import { ProfissionaisModule } from './profissionais/profissionais.module';
import { ServicosModule } from './servicos/servicos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/projeto-integrador',
        ),
      }),
    }),

    ProdutosModule,
    AtendimentosModule,
    PetsModule,
    TutoresModule,
    ProfissionaisModule,
    ServicosModule,
  ],
})
export class AppModule {}
