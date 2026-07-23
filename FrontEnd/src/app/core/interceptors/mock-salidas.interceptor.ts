import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';

import { Salida } from '../models/salida.model';
import { Integrante } from '../models/integrante.model';
import {
  CreateSalidaRequest,
  CreateSalidaResponse,
  JoinSalidaRequest,
  JoinSalidaResponse,
  SalidaWithBalance,
  SalidasError,
} from '../interfaces/salidas.interfaces';

// ============================================================
// MOCK SALIDAS INTERCEPTOR — Simulación de API para desarrollo
// ============================================================
//
// Este interceptor simula las respuestas del backend para los
// endpoints de salidas. Permite desarrollar y hacer demos del
// frontend sin necesidad de tener el backend corriendo.
//
// ┌─────────────────────────────────────────────────────────┐
// │  PARA CONECTAR AL BACKEND REAL:                         │
// │                                                         │
// │  1. En src/environments/environment.ts:                 │
// │     Cambiar `useMocks: false`                           │
// │                                                         │
// │  2. En src/environments/environment.development.ts:     │
// │     Cambiar `useMocks: false`                           │
// │     Cambiar `apiUrl` a tu backend (ej: localhost:8000)  │
// │                                                         │
// │  3. El interceptor se desactiva automáticamente         │
// └─────────────────────────────────────────────────────────┘
//
// ENDPOINTS SIMULADOS:
//
// GET /api/salidas
//   200: SalidaWithBalance[]
//
// POST /api/salidas
//   Body: { nombre, descripcion?, fecha_hora, integrantes[] }
//   201: { salida: Salida, integrantes: Integrante[] }
//   400: { code: "VALIDATION_ERROR", message: "..." }
//
// POST /api/salidas/join
//   Body: { codigo: string }
//   200: { salida: Salida, integrante: Integrante }
//   404: { code: "SALIDA_NOT_FOUND", message: "..." }
//   409: { code: "ALREADY_MEMBER", message: "..." }
//
// ============================================================

/** Delay en milisegundos para simular latencia de red */
const MOCK_DELAY_MS = 500;

/** Colores disponibles para avatares de integrantes */
const AVATAR_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
  '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF',
  '#33FF8C', '#FF3333',
];

/** Genera un UUID v4 fake */
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Genera un código alfanumérico de 6 caracteres */
function generateCodigo(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/** Selecciona un color de avatar aleatorio */
function randomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// --- Base de datos en memoria ---

let mockSalidas: Salida[] = [
  {
    id: 'sal-001-uuid',
    nombre: 'Cumpleaños de Ana',
    descripcion: 'Fiesta en el restaurante italiano',
    codigo: 'ANA123',
    owner_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    fecha_hora: '2026-07-25T20:00:00.000Z',
    created_at: '2026-07-20T10:00:00.000Z',
    updated_at: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'sal-002-uuid',
    nombre: 'Almuerzo del viernes',
    descripcion: 'Comida de equipo',
    codigo: 'FRI456',
    owner_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    fecha_hora: '2026-07-26T12:30:00.000Z',
    created_at: '2026-07-21T08:00:00.000Z',
    updated_at: '2026-07-21T08:00:00.000Z',
  },
  {
    id: 'sal-003-uuid',
    nombre: 'Viaje a la costa',
    descripcion: 'Fin de semana largo',
    codigo: 'VIA789',
    owner_id: 'other-user-uuid',
    fecha_hora: '2026-08-01T06:00:00.000Z',
    created_at: '2026-07-22T14:00:00.000Z',
    updated_at: '2026-07-22T14:00:00.000Z',
  },
];

let mockIntegrantes: Integrante[] = [
  // Cumpleaños de Ana - 4 integrantes
  {
    id: 'int-001',
    salida_id: 'sal-001-uuid',
    linked_user_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    nombre_display: 'demo',
    is_guest: false,
    color_avatar: '#FF5733',
    created_at: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'int-002',
    salida_id: 'sal-001-uuid',
    linked_user_id: null,
    nombre_display: 'Carlos',
    is_guest: false,
    color_avatar: '#33FF57',
    created_at: '2026-07-20T10:01:00.000Z',
  },
  {
    id: 'int-003',
    salida_id: 'sal-001-uuid',
    linked_user_id: null,
    nombre_display: 'María',
    is_guest: false,
    color_avatar: '#3357FF',
    created_at: '2026-07-20T10:02:00.000Z',
  },
  {
    id: 'int-004',
    salida_id: 'sal-001-uuid',
    linked_user_id: null,
    nombre_display: 'Ana',
    is_guest: true,
    color_avatar: '#FF33F5',
    created_at: '2026-07-20T10:03:00.000Z',
  },
  // Almuerzo del viernes - 3 integrantes
  {
    id: 'int-005',
    salida_id: 'sal-002-uuid',
    linked_user_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    nombre_display: 'demo',
    is_guest: false,
    color_avatar: '#FF5733',
    created_at: '2026-07-21T08:00:00.000Z',
  },
  {
    id: 'int-006',
    salida_id: 'sal-002-uuid',
    linked_user_id: null,
    nombre_display: 'Pedro',
    is_guest: false,
    color_avatar: '#33FFF5',
    created_at: '2026-07-21T08:01:00.000Z',
  },
  {
    id: 'int-007',
    salida_id: 'sal-002-uuid',
    linked_user_id: null,
    nombre_display: 'Laura',
    is_guest: false,
    color_avatar: '#F5FF33',
    created_at: '2026-07-21T08:02:00.000Z',
  },
  // Viaje a la costa - 2 integrantes
  {
    id: 'int-008',
    salida_id: 'sal-003-uuid',
    linked_user_id: 'other-user-uuid',
    nombre_display: 'otro_user',
    is_guest: false,
    color_avatar: '#FF8C33',
    created_at: '2026-07-22T14:00:00.000Z',
  },
  {
    id: 'int-009',
    salida_id: 'sal-003-uuid',
    linked_user_id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    nombre_display: 'demo',
    is_guest: false,
    color_avatar: '#FF5733',
    created_at: '2026-07-22T14:01:00.000Z',
  },
];

/** Balances mock por salida (positivo = te deben, negativo = debes) */
const mockBalances: Record<string, number> = {
  'sal-001-uuid': -15000,  // Debes $15.000
  'sal-002-uuid': 8500,    // Te deben $8.500
  'sal-003-uuid': 0,       // A mano
};

/** ID del usuario autenticado actual (demo user) */
const CURRENT_USER_ID = '1a2b3c4d-5e6f-7890-abcd-ef1234567890';

/**
 * Mock Salidas Interceptor
 *
 * Intercepta peticiones a /api/salidas/* y retorna respuestas simuladas.
 * Solo se activa cuando `environment.useMocks = true` (configurado en app.config.ts).
 */
export const mockSalidasInterceptor: HttpInterceptorFn = (req, next) => {
  // GET /api/salidas — Obtener mis salidas
  if (req.url.includes('/api/salidas') && req.method === 'GET' && !req.url.includes('/join')) {
    return handleGetMisSalidas();
  }

  // POST /api/salidas/join — Unirse a una salida
  if (req.url.includes('/api/salidas/join') && req.method === 'POST') {
    return handleJoinSalida(req.body as JoinSalidaRequest);
  }

  // POST /api/salidas — Crear una nueva salida
  if (req.url.includes('/api/salidas') && req.method === 'POST') {
    return handleCrearSalida(req.body as CreateSalidaRequest);
  }

  // Si no es un endpoint de salidas, pasar al siguiente interceptor
  return next(req);
};

/**
 * Simula GET /api/salidas
 *
 * Retorna las salidas donde el usuario actual es integrante,
 * con el balance personal en cada una.
 */
function handleGetMisSalidas(): Observable<HttpResponse<SalidaWithBalance[]>> {
  // Filtrar salidas donde el usuario es integrante
  const misSalidasIds = mockIntegrantes
    .filter((i) => i.linked_user_id === CURRENT_USER_ID)
    .map((i) => i.salida_id);

  const salidasWithBalance: SalidaWithBalance[] = mockSalidas
    .filter((s) => misSalidasIds.includes(s.id))
    .map((salida) => ({
      salida,
      num_integrantes: mockIntegrantes.filter((i) => i.salida_id === salida.id).length,
      balance: mockBalances[salida.id] ?? 0,
    }));

  return of(new HttpResponse({ status: 200, body: salidasWithBalance })).pipe(
    delay(MOCK_DELAY_MS)
  );
}

/**
 * Simula POST /api/salidas
 *
 * Crea una nueva salida con los integrantes iniciales.
 * El owner se agrega automáticamente como primer integrante.
 */
function handleCrearSalida(body: CreateSalidaRequest): Observable<HttpResponse<CreateSalidaResponse>> {
  const { nombre, descripcion, fecha_hora, integrantes } = body;

  // Validación básica
  if (!nombre || nombre.length < 2) {
    const error: SalidasError = {
      code: 'VALIDATION_ERROR',
      message: 'El nombre debe tener al menos 2 caracteres.',
      field: 'nombre',
    };
    return throwError(
      () => new HttpErrorResponse({ status: 400, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  const now = new Date().toISOString();

  // Crear la salida
  const nuevaSalida: Salida = {
    id: generateUuid(),
    nombre,
    descripcion: descripcion || undefined,
    codigo: generateCodigo(),
    owner_id: CURRENT_USER_ID,
    fecha_hora,
    created_at: now,
    updated_at: now,
  };

  // Crear integrante del owner
  const ownerIntegrante: Integrante = {
    id: generateUuid(),
    salida_id: nuevaSalida.id,
    linked_user_id: CURRENT_USER_ID,
    nombre_display: 'demo',
    is_guest: false,
    color_avatar: '#FF5733',
    created_at: now,
  };

  // Crear integrantes adicionales
  const nuevosIntegrantes: Integrante[] = [ownerIntegrante];
  for (const int of integrantes) {
    nuevosIntegrantes.push({
      id: generateUuid(),
      salida_id: nuevaSalida.id,
      linked_user_id: int.es_registrado ? generateUuid() : null,
      nombre_display: int.nombre,
      is_guest: false,
      color_avatar: randomColor(),
      created_at: now,
    });
  }

  // Guardar en la "base de datos" en memoria
  mockSalidas.push(nuevaSalida);
  mockIntegrantes.push(...nuevosIntegrantes);
  mockBalances[nuevaSalida.id] = 0;

  const response: CreateSalidaResponse = {
    salida: nuevaSalida,
    integrantes: nuevosIntegrantes,
  };

  return of(new HttpResponse({ status: 201, body: response })).pipe(
    delay(MOCK_DELAY_MS)
  );
}

/**
 * Simula POST /api/salidas/join
 *
 * Busca una salida por código y agrega al usuario como integrante.
 */
function handleJoinSalida(body: JoinSalidaRequest): Observable<HttpResponse<JoinSalidaResponse>> {
  const { codigo } = body;

  // Buscar salida por código (case insensitive)
  const salida = mockSalidas.find(
    (s) => s.codigo.toUpperCase() === codigo.toUpperCase()
  );

  if (!salida) {
    const error: SalidasError = {
      code: 'SALIDA_NOT_FOUND',
      message: `No se encontró una salida con el código "${codigo}".`,
    };
    return throwError(
      () => new HttpErrorResponse({ status: 404, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  // Verificar si ya es miembro
  const yaEsMiembro = mockIntegrantes.some(
    (i) => i.salida_id === salida.id && i.linked_user_id === CURRENT_USER_ID
  );

  if (yaEsMiembro) {
    const error: SalidasError = {
      code: 'ALREADY_MEMBER',
      message: 'Ya eres integrante de esta salida.',
    };
    return throwError(
      () => new HttpErrorResponse({ status: 409, error })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  // Crear nuevo integrante
  const now = new Date().toISOString();
  const nuevoIntegrante: Integrante = {
    id: generateUuid(),
    salida_id: salida.id,
    linked_user_id: CURRENT_USER_ID,
    nombre_display: 'demo',
    is_guest: false,
    color_avatar: randomColor(),
    created_at: now,
  };

  // Guardar en memoria
  mockIntegrantes.push(nuevoIntegrante);
  mockBalances[salida.id] = 0;

  const response: JoinSalidaResponse = {
    salida,
    integrante: nuevoIntegrante,
  };

  return of(new HttpResponse({ status: 200, body: response })).pipe(
    delay(MOCK_DELAY_MS)
  );
}
