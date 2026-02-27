import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // provideHttpClient habilita o HttpClient em toda a aplicação.
    // withFetch() usa a Fetch API nativa (necessário para SSR).
    // withInterceptors() registra o interceptor que vai adicionar
    // o token JWT automaticamente em toda requisição autenticada.
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
  ]
};