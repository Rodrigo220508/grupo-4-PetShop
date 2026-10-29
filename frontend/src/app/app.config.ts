
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { ProdutosApiService } from './features/produtos/services/produtos-api.service';
import { ProdutosMockService } from './features/produtos/services/produtos-mock.service';
import { ProdutosService } from './features/produtos/services/produtos.service';

import { TutoresMockService } from './features/tutores/services/tutores-mock.service';
import { TutoresService } from './features/tutores/services/tutores.service';

import { PetsMockService } from './features/pets/services/pets-mock.service';
import { PetsService } from './features/pets/services/pets.service';

import { AtendimentosService } from './features/atendimentos/services/atendimentos.service';
import { AtendimentosMockService } from './features/atendimentos/services/atendimentos-mock.service';
import { ServicosService } from './features/servicos/services/servicos.service';
import { ServicosMockService } from './features/servicos/services/servicos-mock.service';
import { ProfissionaisService } from './features/profissionais/services/profissionais.service';
import { ProfissionaisMockService } from './features/profissionais/services/profissionais-mock.service';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    {
      provide: ProdutosService,
      useClass: environment.usarMock
        ? ProdutosMockService
        : ProdutosApiService,
    },

    {
      provide: TutoresService,
      useClass: TutoresMockService,
    },

    {
      provide: PetsService,
      useClass: PetsMockService,
    },

    // Módulos de demonstração ainda sem API NestJS correspondente.
    { provide: AtendimentosService, useClass: AtendimentosMockService },
    { provide: ServicosService, useClass: ServicosMockService },
    { provide: ProfissionaisService, useClass: ProfissionaisMockService },
  ],
};
