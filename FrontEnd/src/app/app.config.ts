import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockAuthInterceptor } from './core/interceptors/mock-auth.interceptor';
import { environment } from '../environments/environment';

/**
 * Configuración principal de la aplicación Crumbs.
 *
 * Los interceptors se registran en orden:
 * 1. authInterceptor — Adjunta el token Bearer a las peticiones (producción)
 * 2. mockAuthInterceptor — Simula respuestas del backend (solo en desarrollo con mocks)
 *
 * PARA CONECTAR AL BACKEND REAL:
 * - Cambiar `environment.useMocks` a `false` en `src/environments/environment.ts`
 * - Esto desactivará el mockAuthInterceptor automáticamente
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        ...(environment.useMocks ? [mockAuthInterceptor] : []),
      ])
    ),
    provideAnimationsAsync(),
  ]
};
