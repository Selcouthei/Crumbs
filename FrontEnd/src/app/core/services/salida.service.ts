import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Salida } from '@core/models';
import { Miembro } from '@core/models';

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
      {
        id: 'm1',
        nombre: 'Carlos Méndez',
        username: 'carlosmz',
        email: 'carlos@email.com',
        avatar_url: null,
        is_guest: false,
      },
      {
        id: 'm2',
        nombre: 'Laura García',
        username: 'lauragg',
        email: 'laura@email.com',
        avatar_url: null,
        is_guest: false,
      },
      {
        id: 'm3',
        nombre: 'Pedro López',
        username: 'pedrolz',
        email: 'pedro@email.com',
        avatar_url: null,
        is_guest: false,
      },
      {
        id: 'm4',
        nombre: 'Ana Torres',
        username: 'anatorres',
        email: 'ana@email.com',
        avatar_url: null,
        is_guest: false,
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class SalidaService {
  private salidas$ = new BehaviorSubject<Salida[]>(MOCK_SALIDAS);

  getSalidaById(id: string): Observable<Salida> {
    const salidas = this.salidas$.getValue();
    const salida = salidas.find((s) => s.id === id);
    if (!salida) {
      throw new Error(`Salida con id ${id} no encontrada`);
    }
    return of(salida);
  }

  agregarMiembroASalida(
    salidaId: string,
    miembro: Miembro
  ): Observable<Salida> {
    const salidas = this.salidas$.getValue();
    const index = salidas.findIndex((s) => s.id === salidaId);

    if (index === -1) {
      throw new Error(`Salida con id ${salidaId} no encontrada`);
    }

    const salida = { ...salidas[index] };
    salida.miembros = [...(salida.miembros ?? []), miembro];

    const updated = [...salidas];
    updated[index] = salida;
    this.salidas$.next(updated);

    return this.getSalidaById(salidaId);
  }
}
