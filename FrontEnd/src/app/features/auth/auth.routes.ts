import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

/**
 * Rutas del módulo de autenticación.
 *
 * /auth/login    → Página de inicio de sesión
 * /auth/register → Página de registro de usuario
 *
 * Estas rutas NO están protegidas por AuthGuard
 * (el usuario necesita acceder sin estar autenticado).
 */
export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
