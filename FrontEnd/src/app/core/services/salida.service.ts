import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Salida } from '@core/models';
import { Miembro } from '@core/models';

/**
 * SalidaService — Servicio de detalle de salidas (mock para demo del frontend)
 *
 * IMPORTANTE: Este servicio usa datos mock para demostrar el UI.
 * En producción, cada método hará una llamada HTTP real al backend:
 * - getSalidaById → GET /api/salidas/:id
 * - agregarMiembroASalida → POST /api/salidas/:id/miembros
 *
 * Las interfaces y DTOs ya están definidos en:
 * - core/interfaces/salidas.interfaces.ts
 * - core/models/salida.model.ts, miembro.model.ts
 *
 * El backend solo necesita implementar estos endpoints con los mismos contratos.
 */

const MOCK_SALIDAS: Salida[] = [
  {
    id: '1',
    nombre: 'Cine / Spiderman',
    descripcion: 'Salida al cine a ver Spiderman',
    codigo: 'A3B9X2',
    owner_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    fecha_hora: '2026-07-15T18:00:00.000Z',
    created_at: '2026-07-10T12:00:00.000Z',
    updated_at: '2026-07-15T18:00:00.000Z',
    miembros: [
      { id: 'm1', nombre: 'Carlos Méndez', username: 'carlosmz', email: 'carlos@email.com', avatar_url: null, is_guest: false },
      { id: 'm2', nombre: 'Laura García', username: 'lauragg', email: 'laura@email.com', avatar_url: null, is_guest: false },
      { id: 'm3', nombre: 'Pedro López', username: 'pedrolz', email: 'pedro@email.com', avatar_url: null, is_guest: false },
      { id: 'm4', nombre: 'Ana Torres', username: 'anatorres', email: 'ana@email.com', avatar_url: null, is_guest: false },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class SalidaService {
  private salidas$ = new BehaviorSubject<Salida[]>(MOCK_SALIDAS);

  /**
   * Obtiene una salida por ID.
   * Mock: si el ID no existe, retorna la salida demo con ese ID.
   * Producción: GET /api/salidas/:id
   */
  getSalidaById(id: string): Observable<Salida> {
    const salidas = this.salidas$.getValue();
    const salida = salidas.find((s) => s.id === id);
    // Mock fallback: si no existe, usar primera salida como plantilla
    // En producción: return this.http.get<Salida>(`${apiUrl}/salidas/${id}`);
    return of(salida ?? { ...salidas[0], id });
  }

  /**
   * Agrega un miembro a una salida.
   * Producción: POST /api/salidas/:id/miembros
   */
  agregarMiembroASalida(salidaId: string, miembro: Miembro): Observable<Salida> {
    const salidas = this.salidas$.getValue();
    let index = salidas.findIndex((s) => s.id === salidaId);

    // Si no existe en el mock, crearla dinámicamente a partir de la plantilla
    if (index === -1) {
      const nuevaSalida = { ...salidas[0], id: salidaId, miembros: [...(salidas[0].miembros ?? [])] };
      salidas.push(nuevaSalida);
      this.salidas$.next(salidas);
      index = salidas.length - 1;
    }

    const salida = { ...salidas[index] };
    salida.miembros = [...(salida.miembros ?? []), miembro];

    const updated = [...salidas];
    updated[index] = salida;
    this.salidas$.next(updated);

    return this.getSalidaById(salidaId);
  }
}
