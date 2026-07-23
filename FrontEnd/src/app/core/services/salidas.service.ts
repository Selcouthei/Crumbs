import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateSalidaRequest,
  CreateSalidaResponse,
  JoinSalidaRequest,
  JoinSalidaResponse,
  SalidaWithBalance,
} from '../interfaces/salidas.interfaces';
import { environment } from '../../../environments/environment';

/**
 * SalidasService — Servicio principal de gestión de salidas de Crumbs
 *
 * Responsabilidades:
 * - Obtener la lista de salidas activas del usuario autenticado
 * - Crear una nueva salida con integrantes iniciales
 * - Unirse a una salida existente mediante código de 6 caracteres
 *
 * ENDPOINTS CONSUMIDOS:
 * - GET  {apiUrl}/salidas       → SalidaWithBalance[]
 * - POST {apiUrl}/salidas       → CreateSalidaRequest → CreateSalidaResponse
 * - POST {apiUrl}/salidas/join  → JoinSalidaRequest → JoinSalidaResponse
 *
 * PARA CONECTAR AL BACKEND REAL:
 * - Este servicio ya hace llamadas HTTP reales.
 * - Solo necesitas configurar `environment.apiUrl` con la URL de tu backend.
 * - El mock interceptor simula las respuestas mientras `environment.useMocks = true`.
 */
@Injectable({ providedIn: 'root' })
export class SalidasService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  /**
   * Obtiene la lista de salidas activas del usuario autenticado.
   * Incluye el balance personal (cuánto debe o le deben) en cada salida.
   *
   * ENDPOINT: GET /api/salidas
   * HEADERS: Authorization: Bearer <token> (adjuntado por authInterceptor)
   *
   * @returns Observable con la lista de salidas y su balance
   */
  getMisSalidas(): Observable<SalidaWithBalance[]> {
    return this.http.get<SalidaWithBalance[]>(`${this.API_URL}/salidas`);
  }

  /**
   * Crea una nueva salida con integrantes iniciales.
   *
   * El usuario autenticado se agrega automáticamente como owner e integrante.
   * Los integrantes adicionales se agregan por nickname (registrados) o nombre libre (fantasmas).
   *
   * ENDPOINT: POST /api/salidas
   *
   * @param request - Datos de la nueva salida (nombre, descripción, fecha, integrantes)
   * @returns Observable con la salida creada y sus integrantes
   */
  crearSalida(request: CreateSalidaRequest): Observable<CreateSalidaResponse> {
    return this.http.post<CreateSalidaResponse>(`${this.API_URL}/salidas`, request);
  }

  /**
   * Se une a una salida existente mediante código de 6 caracteres.
   *
   * El backend valida que:
   * - El código exista
   * - El usuario no sea ya integrante de la salida
   *
   * ENDPOINT: POST /api/salidas/join
   *
   * @param request - Código de la salida (6 caracteres alfanuméricos)
   * @returns Observable con la salida y el integrante creado
   */
  unirseSalida(request: JoinSalidaRequest): Observable<JoinSalidaResponse> {
    return this.http.post<JoinSalidaResponse>(`${this.API_URL}/salidas/join`, request);
  }
}
