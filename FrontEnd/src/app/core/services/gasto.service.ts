import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';
import { Gasto } from '@core/models';

const MOCK_GASTOS: Gasto[] = [
  {
    id: 'g1',
    salida_id: '1',
    nombre: 'Entradas de cine',
    descripcion: 'Boletos para 4 personas función 3D',
    monto: 48000,
    fecha: new Date('2026-07-15T19:00:00'),
    pagador_id: 'm1',
    metodo_division: 'equitativo',
    participantes: [
      { miembro_id: 'm1', monto_asignado: 12000 },
      { miembro_id: 'm2', monto_asignado: 12000 },
      { miembro_id: 'm3', monto_asignado: 12000 },
      { miembro_id: 'm4', monto_asignado: 12000 },
    ],
  },
  {
    id: 'g2',
    salida_id: '1',
    nombre: 'Palomitas y bebidas',
    descripcion: 'Combo familiar grande',
    monto: 35000,
    fecha: new Date('2026-07-15T19:30:00'),
    pagador_id: 'm2',
    metodo_division: 'equitativo',
    participantes: [
      { miembro_id: 'm1', monto_asignado: 8750 },
      { miembro_id: 'm2', monto_asignado: 8750 },
      { miembro_id: 'm3', monto_asignado: 8750 },
      { miembro_id: 'm4', monto_asignado: 8750 },
    ],
  },
  {
    id: 'g3',
    salida_id: '1',
    nombre: 'Uber al cine',
    descripcion: 'Viaje de ida compartido',
    monto: 15000,
    fecha: new Date('2026-07-15T18:00:00'),
    pagador_id: 'm3',
    metodo_division: 'manual',
    participantes: [
      { miembro_id: 'm1', monto_asignado: 5000 },
      { miembro_id: 'm2', monto_asignado: 5000 },
      { miembro_id: 'm3', monto_asignado: 5000 },
    ],
  },
  {
    id: 'g4',
    salida_id: '1',
    nombre: 'Cena después del cine',
    descripcion: 'Hamburguesas en Johnny Rockets',
    monto: 72000,
    fecha: new Date('2026-07-15T22:00:00'),
    pagador_id: 'm1',
    metodo_division: 'equitativo',
    participantes: [
      { miembro_id: 'm1', monto_asignado: 18000 },
      { miembro_id: 'm2', monto_asignado: 18000 },
      { miembro_id: 'm3', monto_asignado: 18000 },
      { miembro_id: 'm4', monto_asignado: 18000 },
    ],
  },
  {
    id: 'g5',
    salida_id: '1',
    nombre: 'Uber de regreso',
    descripcion: 'Viaje de vuelta',
    monto: 18000,
    fecha: new Date('2026-07-15T23:00:00'),
    pagador_id: 'm4',
    metodo_division: 'equitativo',
    participantes: [
      { miembro_id: 'm1', monto_asignado: 4500 },
      { miembro_id: 'm2', monto_asignado: 4500 },
      { miembro_id: 'm3', monto_asignado: 4500 },
      { miembro_id: 'm4', monto_asignado: 4500 },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class GastoService {
  private gastos$ = new BehaviorSubject<Gasto[]>(MOCK_GASTOS);

  getGastosBySalida(salidaId: string): Observable<Gasto[]> {
    const gastos = this.gastos$.getValue()
      .filter((g) => g.salida_id === salidaId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return of(gastos);
  }

  crearGasto(gasto: Omit<Gasto, 'id'>): Observable<Gasto> {
    const nuevoGasto: Gasto = {
      ...gasto,
      id: `g${Date.now()}`,
    };
    const gastos = [...this.gastos$.getValue(), nuevoGasto];
    this.gastos$.next(gastos);
    return of(nuevoGasto).pipe(delay(300));
  }

  editarGasto(gasto: Gasto): Observable<Gasto> {
    const gastos = this.gastos$.getValue();
    const index = gastos.findIndex((g) => g.id === gasto.id);

    if (index === -1) {
      throw new Error(`Gasto con id ${gasto.id} no encontrado`);
    }

    const updated = [...gastos];
    updated[index] = gasto;
    this.gastos$.next(updated);

    return of(gasto).pipe(delay(300));
  }

  eliminarGasto(gastoId: string): Observable<void> {
    const gastos = this.gastos$.getValue().filter((g) => g.id !== gastoId);
    this.gastos$.next(gastos);
    return of(undefined).pipe(delay(300));
  }
}
