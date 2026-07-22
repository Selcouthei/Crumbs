import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';

import { User } from '../models/user.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthError,
} from '../interfaces/auth.interfaces';

// ============================================================
// MOCK AUTH INTERCEPTOR — Simulación de API para desarrollo
// ============================================================
//
// Este interceptor simula las respuestas del backend para los
// endpoints de autenticación. Permite desarrollar y hacer demos
// del frontend sin necesidad de tener el backend corriendo.
//
// ┌─────────────────────────────────────────────────────────┐
// │  PARA CONECTAR AL BACKEND REAL:                         │
// │                                                         │
// │  1. En src/environments/environment.ts:                 │
// │     Cambiar `useMocks: false`                           │
// │                                                         │
// │  2. En src/environments/environment.development.ts:     │
// │     Cambiar `useMocks: false`                           │
// │     Cambiar `apiUrl` a tu backend (ej: localhost:8000)  │
// │                                                         │
// │  3. El interceptor se desactiva automáticamente         │
// │     (no se incluye en la lista de interceptors)         │
// └─────────────────────────────────────────────────────────┘
//
// ENDPOINTS SIMULADOS:
//
// POST /api/auth/login
//   Body: { identifier: string, password: string }
//   200: { token: string, user: User }
//   401: { code: "INVALID_CREDENTIALS", message: "..." }
//
// POST /api/auth/register
//   Body: { nombre, apellido, nickname, email, password }
//   201: { token: string, user: User }
//   409: { code: "DUPLICATE_NICKNAME"|"DUPLICATE_EMAIL", message: "...", field: "..." }
//
// USUARIO DE PRUEBA:
//   Email:    demo@crumbs.app
//   Nickname: demo
//   Password: 123456
//
// ============================================================

/** Delay en milisegundos para simular latencia de red */
const MOCK_DELAY_MS = 500;

/** Base de datos en memoria de usuarios mock */
let mockUsers: User[] = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    nombre: 'Demo',
    apellido: 'User',
    nickname: 'demo',
    email: 'demo@crumbs.app',
    avatar_url: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

/** Contraseñas asociadas a los usuarios mock (solo para simulación) */
let mockPasswords: Record<string, string> = {
  'demo@crumbs.app': '123456',
  'demo': '123456',
};

/**
 * Genera un JWT fake con el usuario en el payload.
 * NOTA: En producción, el JWT lo genera el backend con firma real.
 */
function generateFakeJwt(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    user: user,
    iat: Date.now(),
    exp: Date.now() + 86400000, // 24 horas
  }));
  const signature = btoa('fake-signature-for-development-only');
  return `${header}.${payload}.${signature}`;
}

/** Genera un UUID v4 fake */
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mock Auth Interceptor
 *
 * Intercepta peticiones a /api/auth/* y retorna respuestas simuladas.
 * Solo se activa cuando `environment.useMocks = true` (configurado en app.config.ts).
 */
export const mockAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo interceptar peticiones a endpoints de auth
  if (req.url.includes('/api/auth/login') && req.method === 'POST') {
    return handleLogin(req.body as LoginRequest);
  }

  if (req.url.includes('/api/auth/register') && req.method === 'POST') {
    return handleRegister(req.body as RegisterRequest);
  }

  // Si no es un endpoint de auth, pasar al siguiente interceptor
  return next(req);
};

/**
 * Simula el endpoint POST /api/auth/login
 *
 * Busca al usuario por email O nickname y valida la contraseña.
 *
 * Respuestas:
 * - 200: Login exitoso → { token, user }
 * - 401: Credenciales inválidas → AuthError
 */
function handleLogin(body: LoginRequest): Observable<HttpResponse<LoginResponse>> {
  const { identifier, password } = body;

  // Buscar usuario por email o nickname
  const user = mockUsers.find(
    (u) => u.email === identifier || u.nickname === identifier
  );

  // Verificar credenciales
  const storedPassword = mockPasswords[identifier];
  if (!user || storedPassword !== password) {
    const error: AuthError = {
      code: 'INVALID_CREDENTIALS',
      message: 'Email/nickname o contraseña incorrectos.',
    };
    return throwError(
      () => new HttpErrorResponse({ status: 401, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  // Login exitoso
  const response: LoginResponse = {
    token: generateFakeJwt(user),
    user: user,
  };

  return of(new HttpResponse({ status: 200, body: response })).pipe(
    delay(MOCK_DELAY_MS)
  );
}

/**
 * Simula el endpoint POST /api/auth/register
 *
 * Valida que nickname y email no estén duplicados, crea el usuario.
 *
 * Respuestas:
 * - 201: Registro exitoso → { token, user }
 * - 409: Nickname duplicado → AuthError { field: 'nickname' }
 * - 409: Email duplicado → AuthError { field: 'email' }
 */
function handleRegister(body: RegisterRequest): Observable<HttpResponse<RegisterResponse>> {
  const { nombre, apellido, nickname, email, password } = body;

  // Verificar nickname duplicado
  if (mockUsers.some((u) => u.nickname === nickname)) {
    const error: AuthError = {
      code: 'DUPLICATE_NICKNAME',
      message: `El nickname "${nickname}" ya está en uso.`,
      field: 'nickname',
    };
    return throwError(
      () => new HttpErrorResponse({ status: 409, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  // Verificar email duplicado
  if (mockUsers.some((u) => u.email === email)) {
    const error: AuthError = {
      code: 'DUPLICATE_EMAIL',
      message: `El email "${email}" ya está registrado.`,
      field: 'email',
    };
    return throwError(
      () => new HttpErrorResponse({ status: 409, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  // Crear nuevo usuario
  const now = new Date().toISOString();
  const newUser: User = {
    id: generateUuid(),
    nombre,
    apellido,
    nickname,
    email,
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };

  // Agregar a la "base de datos" en memoria
  mockUsers.push(newUser);
  mockPasswords[email] = password;
  mockPasswords[nickname] = password;

  // Registro exitoso (queda logueado automáticamente)
  const response: RegisterResponse = {
    token: generateFakeJwt(newUser),
    user: newUser,
  };

  return of(new HttpResponse({ status: 201, body: response })).pipe(
    delay(MOCK_DELAY_MS)
  );
}
