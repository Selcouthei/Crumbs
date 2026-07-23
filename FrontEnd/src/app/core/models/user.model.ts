/**
 * Modelo de Usuario — Crumbs
 *
 * Representa un usuario registrado en la plataforma.
 *
 * CONTRATO BACKEND:
 * - El backend debe retornar este objeto en las respuestas de autenticación.
 * - `nickname` es único en la base de datos, sin espacios, máximo 20 caracteres.
 * - `email` es único en la base de datos.
 * - `avatar_url` es opcional y puede ser null si el usuario no ha subido foto.
 */
export interface User {
  /** UUID del usuario generado por el backend */
  id: string;

  /** Nombre del usuario (2-50 caracteres) */
  nombre: string;

  /** Apellido del usuario (2-50 caracteres) */
  apellido: string;

  /** Nickname único, sin espacios, 3-20 caracteres. Se usa para buscar usuarios. */
  nickname: string;

  /** Email único del usuario. Formato válido de email. */
  email: string;

  /** URL del avatar del usuario. Null si no tiene foto de perfil. */
  avatar_url?: string | null;

  /** Fecha de nacimiento del usuario (ISO 8601, YYYY-MM-DD). Opcional. */
  fecha_nacimiento?: string | null;

  /** Fecha de creación de la cuenta (ISO 8601) */
  created_at: string;

  /** Fecha de última actualización del perfil (ISO 8601) */
  updated_at: string;
}
