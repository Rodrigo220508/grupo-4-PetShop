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
      useExisting: TutoresMockService,
    },
    {
      provide: PetsService,
      useClass: PetsMockService,
    },
  ],
};