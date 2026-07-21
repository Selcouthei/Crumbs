import { User } from '../models/user.model';

// ============================================================
// CRUMBS — Contratos API de Autenticación
// ============================================================
//
// Este archivo define los DTOs (Data Transfer Objects) para la
// comunicación entre el frontend y el backend en el módulo de auth.
//
// ENDPOINTS ESPERADOS DEL BACKEND:
//
// POST /api/auth/login
//   Request:  LoginRequest
//   Response: LoginResponse (200) | AuthError (401)
//
// POST /api/auth/register
//   Request:  RegisterRequest
//   Response: RegisterResponse (201) | AuthError (409)
//
// ============================================================

/**
 * Request para iniciar sesión.
 *
 * ENDPOINT: POST /api/auth/login
 *
 * El campo `identifier` puede ser el email O el nickname del usuario.
 * El backend debe buscar por ambos campos para encontrar al usuario.
 *
 * @example
 * { identifier: "demo@crumbs.app", password: "123456" }
 * { identifier: "demo_user", password: "mi_password" }
 */
export interface LoginRequest {
  /** Email o nickname del usuario. El backend busca en ambos campos. */
  identifier: string;

  /** Contraseña del usuario. Mínimo 6 caracteres. */
  password: string;
}

/**
 * Respuesta exitosa de login.
 *
 * ENDPOINT: POST /api/auth/login → 200 OK
 *
 * El `token` es un JWT con tiempo de expiración definido por el backend.
 * El frontend lo almacena en localStorage con clave `crumbs_token`.
 */
export interface LoginResponse {
  /** JWT token para autenticación. Se envía como Bearer en headers. */
  token: string;

  /** Datos completos del usuario autenticado. */
  user: User;
}

/**
 * Request para registrar un nuevo usuario.
 *
 * ENDPOINT: POST /api/auth/register
 *
 * Validaciones que debe hacer el backend:
 * - `nickname` único, sin espacios, 3-20 caracteres
 * - `email` único, formato válido
 * - `password` mínimo 6 caracteres (hashear con bcrypt o similar)
 *
 * @example
 * {
 *   nombre: "Juan",
 *   apellido: "Pérez",
 *   nickname: "juanpe",
 *   email: "juan@email.com",
 *   password: "miPassword123"
 * }
 */
export interface RegisterRequest {
  /** Nombre del usuario. Mínimo 2 caracteres. */
  nombre: string;

  /** Apellido del usuario. Mínimo 2 caracteres. */
  apellido: string;

  /** Nickname único. Sin espacios, 3-20 caracteres. Solo alfanuméricos y guiones bajos. */
  nickname: string;

  /** Email del usuario. Debe ser único y tener formato válido. */
  email: string;

  /** Contraseña. Mínimo 6 caracteres. El backend debe hashearla. */
  password: string;
}

/**
 * Respuesta exitosa de registro.
 *
 * ENDPOINT: POST /api/auth/register → 201 Created
 *
 * Al registrarse exitosamente, el usuario queda autenticado automáticamente
 * (se retorna el token sin necesidad de hacer login aparte).
 */
export interface RegisterResponse {
  /** JWT token para autenticación inmediata post-registro. */
  token: string;

  /** Datos completos del usuario recién creado. */
  user: User;
}

/**
 * Error de autenticación retornado por el backend.
 *
 * Códigos de error esperados:
 * - `INVALID_CREDENTIALS` (401) — Email/nickname o contraseña incorrectos
 * - `DUPLICATE_NICKNAME` (409) — El nickname ya está en uso
 * - `DUPLICATE_EMAIL` (409) — El email ya está registrado
 * - `VALIDATION_ERROR` (400) — Error de validación en algún campo
 *
 * El campo `field` indica qué campo del formulario causó el error
 * (útil para mostrar el error en el campo correcto en el frontend).
 */
export interface AuthError {
  /** Código de error legible por la aplicación */
  code: 'INVALID_CREDENTIALS' | 'DUPLICATE_NICKNAME' | 'DUPLICATE_EMAIL' | 'VALIDATION_ERROR';

  /** Mensaje de error legible por el usuario (en español) */
  message: string;

  /** Campo del formulario que causó el error (opcional). Ej: 'nickname', 'email' */
  field?: string;
}
