import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * AuthGuard — Protege rutas que requieren autenticación.
 *
 * Comportamiento:
 * - Si el usuario tiene token válido en localStorage → permite acceso
 * - Si NO tiene token → redirige a /auth/login
 *
 * USO en rutas:
 * ```typescript
 * { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 * ```
 *
 * NOTA: Las rutas bajo /auth/* NO deben usar este guard
 * (el usuario necesita acceder a login/register sin estar autenticado).
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // No hay sesión activa — redirigir al login
  return router.createUrlTree(['/auth/login']);
};
