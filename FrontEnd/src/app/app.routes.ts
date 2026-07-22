import { Routes } from '@angular/router';

/**
 * Rutas principales de la aplicación Crumbs.
 *
 * Estructura:
 * - /auth/*          → Módulo de autenticación (lazy loaded)
 * - /salidas/:id     → Detalle de salida
 * - /                → Redirige al login (temporal hasta que exista dashboard)
 * - /**              → Wildcard redirige al login
 *
 * CUANDO SE AGREGUE EL DASHBOARD:
 * - Cambiar el redirect de '' a '/dashboard'
 * - Agregar la ruta: { path: 'dashboard', loadComponent: ..., canActivate: [authGuard] }
 */
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'salidas/:id',
    loadComponent: () =>
      import('@features/salidas/salida-detail/salida-detail.component').then(
        (m) => m.SalidaDetailComponent
      ),
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
