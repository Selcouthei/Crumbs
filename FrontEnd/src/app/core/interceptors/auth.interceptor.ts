import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor — Adjunta el token JWT a las peticiones HTTP.
 *
 * Comportamiento:
 * 1. Si la URL contiene `/auth/` → NO adjunta token (son endpoints públicos)
 * 2. Para cualquier otra petición → adjunta header `Authorization: Bearer <token>`
 * 3. Si el backend responde con 401 (Unauthorized) → cierra sesión y redirige al login
 *
 * NOTA: Este interceptor funciona tanto con el mock como con el backend real.
 * El orden importa: este interceptor debe ir ANTES del mock interceptor en la lista.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // No adjuntar token a endpoints de autenticación (son públicos)
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Adjuntar token Bearer si existe
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend responde 401, el token expiró o es inválido
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
