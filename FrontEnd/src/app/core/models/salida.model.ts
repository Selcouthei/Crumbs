/**
 * Modelo de Salida — Crumbs
 *
 * Representa una "salida" o grupo de gastos compartidos entre varias personas.
 * Ejemplo: "Cumpleaños de Ana", "Viaje a la costa", "Almuerzo del viernes"
 *
 * CONTRATO BACKEND:
 * - `codigo` es un string alfanumérico de 6 caracteres, único en la base de datos.
 * - `owner_id` es el UUID del usuario que creó la salida.
 * - Una salida puede tener múltiples integrantes (registrados o fantasmas).
 * - Los gastos se registran dentro de cada salida.
 */
export interface Salida {
  /** UUID de la salida generado por el backend */
  id: string;

  /** Nombre descriptivo de la salida (2-100 caracteres) */
  nombre: string;

  /** Descripción opcional de la salida */
  descripcion?: string;

  /** Código alfanumérico de 6 caracteres para compartir/unirse */
  codigo: string;

  /** UUID del usuario que creó la salida */
  owner_id: string;

  /** Fecha/hora de la salida (ISO 8601) */
  fecha_hora: string;

  /** Fecha de creación del registro (ISO 8601) */
  created_at: string;

  /** Fecha de última actualización (ISO 8601) */
  updated_at: string;
}
