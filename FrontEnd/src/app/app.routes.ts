import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Rutas principales de la aplicación Crumbs.
 *
 * Estructura:
 * - /auth/*        → Módulo de autenticación (lazy loaded, sin guard)
 * - /dashboard     → Página principal (lazy loaded, con authGuard)
 * - /perfil        → Gestión del perfil de usuario (lazy loaded, con authGuard)
 * - /salidas/:id   → Detalle de una salida (lazy loaded, con authGuard)
 * - /              → Redirige al dashboard
 * - /**            → Wildcard redirige al dashboard
 */
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/perfil.component').then(
        (m) => m.PerfilComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'salidas/:id',
    loadComponent: () =>
      import('./features/salidas/salida-detail/salida-detail.component').then((m) => m.SalidaDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
