/**
 * Modelo de Integrante — Crumbs
 *
 * Representa a un participante dentro de una salida.
 * Puede ser un usuario registrado (linked_user_id !== null) o un
 * "integrante fantasma" (nombre libre sin cuenta en la plataforma).
 *
 * CONTRATO BACKEND:
 * - Si `linked_user_id` es null, es un integrante fantasma (solo tiene nombre_display).
 * - `nombre_display` es el nickname del usuario registrado o el nombre libre ingresado.
 * - `is_guest` indica si el integrante es "invitado" (excluido del cobro en ciertos gastos).
 * - `color_avatar` es un color hex asignado aleatoriamente al unirse.
 */
export interface Integrante {
  /** UUID del integrante generado por el backend */
  id: string;

  /** UUID de la salida a la que pertenece */
  salida_id: string;

  /** UUID del usuario registrado vinculado. Null si es fantasma. */
  linked_user_id: string | null;

  /** Nombre a mostrar: nickname (si registrado) o nombre libre (si fantasma) */
  nombre_display: string;

  /** Si es true, es un invitado excluido del cobro en ciertos gastos */
  is_guest: boolean;

  /** Color hex para el avatar del integrante (ej: '#FF5733') */
  color_avatar: string;

  /** Fecha en que se unió a la salida (ISO 8601) */
  created_at: string;
}
