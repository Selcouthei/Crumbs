import { Salida } from '../models/salida.model';
import { Integrante } from '../models/integrante.model';

// ============================================================
// CRUMBS — Contratos API de Salidas
// ============================================================
//
// Este archivo define los DTOs (Data Transfer Objects) para la
// comunicación entre el frontend y el backend en el módulo de salidas.
//
// ENDPOINTS ESPERADOS DEL BACKEND:
//
// GET /api/salidas
//   Response: SalidaWithBalance[] (200)
//
// POST /api/salidas
//   Request:  CreateSalidaRequest
//   Response: CreateSalidaResponse (201) | SalidasError (400)
//
// POST /api/salidas/join
//   Request:  JoinSalidaRequest
//   Response: JoinSalidaResponse (200) | SalidasError (404)
//
// ============================================================

/**
 * Integrante inicial al crear una salida.
 *
 * Puede ser un usuario registrado (se busca por nickname)
 * o un nombre libre (integrante fantasma sin cuenta).
 *
 * @example
 * { nombre: "juanpe", es_registrado: true }   // usuario con cuenta
 * { nombre: "Carlos", es_registrado: false }   // fantasma
 */
export interface IntegranteInicial {
  /** Nickname (si registrado) o nombre libre (si fantasma) */
  nombre: string;

  /** True si es un usuario registrado buscado por nickname */
  es_registrado: boolean;
}

/**
 * Request para crear una nueva salida.
 *
 * ENDPOINT: POST /api/salidas
 *
 * El backend debe:
 * 1. Generar un código único de 6 caracteres alfanuméricos
 * 2. Crear la salida con el owner_id del usuario autenticado
 * 3. Agregar al owner como primer integrante
 * 4. Agregar los integrantes iniciales
 *
 * @example
 * {
 *   nombre: "Cumpleaños de Ana",
 *   descripcion: "Fiesta en el restaurante",
 *   fecha_hora: "2026-08-01T20:00:00.000Z",
 *   integrantes: [
 *     { nombre: "juanpe", es_registrado: true },
 *     { nombre: "Carlos (amigo)", es_registrado: false }
 *   ]
 * }
 */
export interface CreateSalidaRequest {
  /** Nombre de la salida. 2-100 caracteres. */
  nombre: string;

  /** Descripción opcional de la salida */
  descripcion?: string;

  /** Fecha y hora de la salida (ISO 8601) */
  fecha_hora: string;

  /** Lista de integrantes iniciales (además del owner que se agrega automáticamente) */
  integrantes: IntegranteInicial[];
}

/**
 * Respuesta exitosa al crear una salida.
 *
 * ENDPOINT: POST /api/salidas → 201 Created
 */
export interface CreateSalidaResponse {
  /** La salida recién creada con su código generado */
  salida: Salida;

  /** Lista de integrantes creados (incluyendo al owner) */
  integrantes: Integrante[];
}

/**
 * Request para unirse a una salida existente.
 *
 * ENDPOINT: POST /api/salidas/join
 *
 * El backend debe:
 * 1. Buscar la salida por código
 * 2. Verificar que el usuario no sea ya integrante
 * 3. Agregar al usuario como nuevo integrante
 *
 * @example
 * { codigo: "ABC123" }
 */
export interface JoinSalidaRequest {
  /** Código alfanumérico de 6 caracteres de la salida */
  codigo: string;
}

/**
 * Respuesta exitosa al unirse a una salida.
 *
 * ENDPOINT: POST /api/salidas/join → 200 OK
 */
export interface JoinSalidaResponse {
  /** La salida a la que se unió */
  salida: Salida;

  /** Los datos del integrante creado para el usuario */
  integrante: Integrante;
}

/**
 * Salida con información de balance personal del usuario.
 *
 * Usada para mostrar "Mis Salidas Activas" en el dashboard.
 * Incluye cuánto debe o le deben al usuario dentro de esa salida.
 */
export interface SalidaWithBalance {
  /** La salida */
  salida: Salida;

  /** Número de integrantes en la salida */
  num_integrantes: number;

  /**
   * Balance personal del usuario en esta salida.
   * - Positivo: le deben dinero al usuario
   * - Negativo: el usuario debe dinero
   * - Cero: está a mano
   */
  balance: number;
}

/**
 * Error retornado por los endpoints de salidas.
 *
 * Códigos de error esperados:
 * - `SALIDA_NOT_FOUND` (404) — El código no corresponde a ninguna salida
 * - `ALREADY_MEMBER` (409) — El usuario ya es integrante de esa salida
 * - `VALIDATION_ERROR` (400) — Error de validación en algún campo
 * - `NICKNAME_NOT_FOUND` (404) — Un nickname de integrante no existe
 */
export interface SalidasError {
  /** Código de error legible por la aplicación */
  code: 'SALIDA_NOT_FOUND' | 'ALREADY_MEMBER' | 'VALIDATION_ERROR' | 'NICKNAME_NOT_FOUND';

  /** Mensaje de error legible por el usuario (en español) */
  message: string;

  /** Campo del formulario que causó el error (opcional) */
  field?: string;
}
