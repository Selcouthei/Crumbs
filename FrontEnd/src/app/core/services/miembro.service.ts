import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Miembro } from '@core/models';

const MOCK_USUARIOS: Miembro[] = [
  {
    id: 'u1',
    nombre: 'Diego Ramírez',
    username: 'diegorz',
    email: 'diego@email.com',
    avatar_url: null,
    is_guest: false,
  },
  {
    id: 'u2',
    nombre: 'Sofía Herrera',
    username: 'sofiah',
    email: 'sofia@email.com',
    avatar_url: null,
    is_guest: false,
  },
  {
    id: 'u3',
    nombre: 'Martín Vega',
    username: 'martinv',
    email: 'martin@email.com',
    avatar_url: null,
    is_guest: false,
  },
  {
    id: 'u4',
    nombre: 'Valentina Cruz',
    username: 'valcruz',
    email: 'valentina@email.com',
    avatar_url: null,
    is_guest: false,
  },
  {
    id: 'u5',
    nombre: 'Roberto Sánchez',
    username: 'robertos',
    email: 'roberto@email.com',
    avatar_url: null,
    is_guest: false,
  },
];

const MOCK_FRECUENTES: Miembro[] = [
  MOCK_USUARIOS[0], // Diego
  MOCK_USUARIOS[1], // Sofía
  MOCK_USUARIOS[2], // Martín
];

@Injectable({ providedIn: 'root' })
export class MiembroService {
  buscarPorUsername(query: string): Observable<Miembro[]> {
    const resultados = MOCK_USUARIOS.filter(
      (u) =>
        u.username !== null &&
        u.username.toLowerCase() === query.toLowerCase()
    );
    return of(resultados).pipe(delay(300));
  }

  buscarPorEmail(query: string): Observable<Miembro[]> {
    const resultados = MOCK_USUARIOS.filter(
      (u) =>
        u.email !== null &&
        u.email.toLowerCase() === query.toLowerCase()
    );
    return of(resultados).pipe(delay(300));
  }

  getMiembrosFrecuentes(_userId: string): Observable<Miembro[]> {
    return of(MOCK_FRECUENTES).pipe(delay(300));
  }

  crearFantasma(nombre: string): Observable<Miembro> {
    const fantasma: Miembro = {
      id: `ghost_${Date.now()}`,
      nombre: nombre.substring(0, 12),
      username: null,
      email: null,
      avatar_url: null,
      is_guest: true,
    };
    return of(fantasma).pipe(delay(300));
  }
}
