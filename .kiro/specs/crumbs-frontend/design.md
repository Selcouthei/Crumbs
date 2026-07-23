# Crumbs Frontend — Diseño Técnico

## Arquitectura General

La aplicación sigue una arquitectura **Feature-based** con **Standalone Components** de Angular 21. No existen NgModules. Cada feature es una unidad autónoma con sus propios componentes, rutas y servicios locales, mientras que los servicios globales viven en `core/`.

```
Bootstrap (main.ts)
    └── AppComponent (shell)
            └── RouterOutlet
                    ├── /auth       → AuthFeature (lazy)
                    ├── /dashboard  → DashboardComponent (lazy, authGuard)
                    ├── /salidas/:id → SalidaDetailComponent (lazy, authGuard)
                    ├── /perfil     → PerfilComponent (lazy)
                    └── /amigos     → AmigosFeature (lazy)
```

---

## Modelos de Dominio

### User
```typescript
interface User {
  id: string;
  nombre: string;
  apellido: string;
  nickname: string;       // único, max 20 chars, sin espacios
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

### Salida
```typescript
interface Salida {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;         // 6 chars alfanuméricos únicos
  owner_id: string;
  fecha_hora: string;     // ISO 8601
  created_at: string;
  updated_at: string;
}
```

### Integrante
```typescript
interface Integrante {
  id: string;
  salida_id: string;
  linked_user_id: string | null;  // null si es fantasma
  nombre_display: string;          // nickname o nombre fantasma
  is_guest: boolean;
  color_avatar: string;
  created_at: string;
}
```

### Gasto
```typescript
interface Gasto {
  id: string;
  salida_id: string;
  descripcion: string;
  monto: number;               // entero positivo, max 9999999
  pagador_id: string;          // integrante_id del que pagó
  metodo_division: 'equitativo' | 'manual';
  participantes: ParticipanteGasto[];
  created_at: string;
}

interface ParticipanteGasto {
  integrante_id: string;
  monto_asignado: number;      // entero positivo
  is_guest: boolean;           // true = excluido del cobro
}
```

### Pago
```typescript
interface Pago {
  id: string;
  salida_id: string;
  pagador_id: string;
  receptor_id: string;
  monto: number;               // entero positivo
  created_at: string;
}
```

---

## Servicios Core

| Servicio | Responsabilidad | Estado |
|---|---|---|
| `AuthService` | Login, registro, manejo de token JWT, estado del usuario actual | ✅ Implementado |
| `SalidasService` | getMisSalidas, crearSalida, unirseSalida | ✅ Implementado |
| `IntegrantesService` | Agregar/eliminar integrantes (registrados y fantasmas) | ❌ Pendiente |
| `GastosService` | CRUD de gastos, lógica de división | ❌ Pendiente |
| `BalancesService` | Cálculo y consulta de balances por salida | ❌ Pendiente |
| `AmigosService` | Gestión de amigos y grupos favoritos | ❌ Pendiente |

Todos los servicios usan `HttpClient` y retornan `Observable<T>`. El estado global del usuario se maneja con un `BehaviorSubject<User | null>` en `AuthService`.

---

## Guards e Interceptors

### AuthGuard (`core/guards/auth.guard.ts`) ✅
- Función guard (`CanActivateFn`).
- Si no hay token válido en `localStorage`, redirige a `/auth/login`.

### AuthInterceptor (`core/interceptors/auth.interceptor.ts`) ✅
- Función interceptor (`HttpInterceptorFn`).
- Adjunta el header `Authorization: Bearer <token>` a todas las requests.
- Si recibe un `401`, limpia el token y redirige al login.

### MockAuthInterceptor (`core/interceptors/mock-auth.interceptor.ts`) ✅
- Simula respuestas de `POST /api/auth/login` y `POST /api/auth/register`.
- Delay de 500ms. Usuario de prueba: `demo@crumbs.app` / `demo` / `123456`.
- Se activa solo cuando `environment.useMocks = true`.

### MockSalidasInterceptor (`core/interceptors/mock-salidas.interceptor.ts`) ✅
- Simula respuestas de `GET /api/salidas`, `POST /api/salidas`, `POST /api/salidas/join`.
- Base de datos en memoria con 3 salidas y 9 integrantes mock.
- Genera códigos alfanuméricos de 6 caracteres y UUIDs.
- Delay de 500ms. Se activa solo cuando `environment.useMocks = true`.
- **Para conectar al backend real:** cambiar `useMocks` a `false` en environments.

---

## Interfaces/DTOs

### Auth (`core/interfaces/auth.interfaces.ts`) ✅
- `LoginRequest`, `LoginResponse`
- `RegisterRequest`, `RegisterResponse`
- `AuthError` (codes: INVALID_CREDENTIALS, DUPLICATE_NICKNAME, DUPLICATE_EMAIL, VALIDATION_ERROR)

### Salidas (`core/interfaces/salidas.interfaces.ts`) ✅
- `IntegranteInicial` (nombre + es_registrado)
- `CreateSalidaRequest`, `CreateSalidaResponse`
- `JoinSalidaRequest`, `JoinSalidaResponse`
- `SalidaWithBalance` (salida + num_integrantes + balance personal)
- `SalidasError` (codes: SALIDA_NOT_FOUND, ALREADY_MEMBER, VALIDATION_ERROR, NICKNAME_NOT_FOUND)

---

## Componentes Shared

| Componente | Descripción | Estado |
|---|---|---|
| `PageHeaderComponent` | Header reutilizable con título, botón back y acciones opcionales | ❌ Pendiente |
| `ConfirmDialogComponent` | Dialog genérico de confirmación (sí/no) | ❌ Pendiente |
| `EmptyStateComponent` | Ilustración + mensaje cuando una lista está vacía | ❌ Pendiente |

### Pipes
| Pipe | Descripción | Estado |
|---|---|---|
| `CurrencyIntegerPipe` | Formatea números como `$1.234` (sin decimales, con separador de miles) | ❌ Pendiente |

### Directives
| Directiva | Descripción | Estado |
|---|---|---|
| `NumberOnlyDirective` | Restringe input a solo dígitos enteros positivos | ❌ Pendiente |
| `MaxLengthRestrictionDirective` | Limita caracteres en un input sin contar espacios | ❌ Pendiente |

---

## Tema Visual (Angular Material)

- **Paleta primaria:** Purple (`#6750A4`) — M3 baseline.
- **Paleta de acento:** Teal.
- **Tipografía:** Roboto.
- El tema se define en `styles.scss` usando la API `@use '@angular/material' as mat`.

---

## Estructura de Features

### Auth ✅
```
features/auth/
├── auth.routes.ts
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   └── login.component.scss
└── register/
    ├── register.component.ts
    ├── register.component.html
    └── register.component.scss
```

### Dashboard ✅
```
features/dashboard/
├── dashboard.component.ts          ← Página principal (saludo, botones, lista)
├── dashboard.component.html
├── dashboard.component.scss
└── components/
    ├── salida-card/
    │   ├── salida-card.component.ts       ← Tarjeta con nombre y balance
    │   ├── salida-card.component.html
    │   └── salida-card.component.scss
    ├── crear-salida-modal/
    │   ├── crear-salida-modal.component.ts  ← MatDialog formulario + integrantes
    │   ├── crear-salida-modal.component.html
    │   └── crear-salida-modal.component.scss
    └── unirse-salida-modal/
        ├── unirse-salida-modal.component.ts   ← MatDialog código 6 chars
        ├── unirse-salida-modal.component.html
        └── unirse-salida-modal.component.scss
```

### Salidas (en progreso — implementado por otro miembro del equipo)
```
features/salidas/
├── salida-placeholder.component.ts   ← Placeholder temporal
├── salida-detail/                     ← TODO: Detalle de salida
│   └── salida-detail.component.ts
├── components/
│   ├── gastos-list/
│   ├── agregar-gasto-drawer/
│   ├── agregar-integrante-drawer/
│   └── balances-view/
```

### Core ✅
```
core/
├── models/
│   ├── user.model.ts               ✅
│   ├── salida.model.ts             ✅
│   └── integrante.model.ts         ✅
├── interfaces/
│   ├── auth.interfaces.ts          ✅
│   └── salidas.interfaces.ts       ✅
├── services/
│   ├── auth.service.ts             ✅
│   └── salidas.service.ts          ✅
├── guards/
│   └── auth.guard.ts               ✅
└── interceptors/
    ├── auth.interceptor.ts          ✅
    ├── mock-auth.interceptor.ts     ✅
    └── mock-salidas.interceptor.ts  ✅
```

### Environments ✅
```
src/environments/
├── environment.ts                   ← Producción (useMocks: false)
└── environment.development.ts       ← Desarrollo (useMocks: true)
```

### Perfil
```
features/perfil/
└── perfil.component.ts              ← TODO
```

### Amigos
```
features/amigos/
├── amigos.routes.ts                 ← TODO
├── amigos-list/
│   └── amigos-list.component.ts
└── grupos/
    └── grupos.component.ts
```

---

## Docker (Containerización)

### Archivos
```
Crumbs/
├── docker-compose.yml           ← Orquestador global (frontend + backend futuro)
└── FrontEnd/
    ├── Dockerfile               ← Multi-stage: dev (Node + ng serve) y prod (Nginx)
    ├── nginx.conf               ← Config de Nginx para SPA routing en producción
    └── .dockerignore            ← Excluye node_modules, dist, .git del build
```

### Cómo levantar el proyecto

**Con Docker (recomendado — solo necesitan Docker instalado):**
```bash
cd Crumbs
docker compose up          # Levanta con hot-reload en http://localhost:4200
docker compose up --build  # Reconstruye si cambiaste package.json
docker compose down        # Detiene el container
```

**Sin Docker (necesitan Node 22+ y npm 11+):**
```bash
cd Crumbs/FrontEnd
npm install
npm start                  # http://localhost:4200
```

### Producción
```bash
cd Crumbs
docker compose --profile prod up --build
# Sirve en http://localhost:80
```

### Deploy AWS (EC2 t2.micro — Free Tier)
Ver `Docs/plan-deploy-aws.md` para el plan completo de deploy con costo $0.
```bash
# En la EC2:
git clone https://github.com/Selcouthei/Crumbs.git
cd Crumbs
docker compose --profile prod up -d
```

### Requisitos para el equipo
- **Con Docker:** Solo necesitan Docker instalado (Docker Desktop en Windows/Mac, docker + docker-compose en Linux). No necesitan Node, npm, ni Angular CLI.
- **Sin Docker:** Necesitan Node 22+ y npm 11+.
- Los cambios en código se reflejan automáticamente (volumen montado + polling)
- Si se agrega un paquete nuevo al `package.json`, reconstruir con `--build`

---

## Flujo de Usuario Implementado

```
1. Usuario abre la app → Redirige a /dashboard
2. Si no está autenticado → AuthGuard redirige a /auth/login
3. Login con demo/123456 → Navega a /dashboard
4. Dashboard muestra:
   - Header con "Crumbs", "Perfil", "Salir"
   - "¡Hola, demo!"
   - Botones "Crear Salida" y "Agregar Salida"
   - Lista de 3 salidas mock con balance personal
5. Click "Crear Salida" → Modal con formulario
   - Llena nombre, descripción, fecha/hora
   - Agrega integrantes (@nickname o nombre libre)
   - Click "Crear" → Mock crea salida → Navega a /salidas/:id
6. Click "Agregar Salida" → Modal con input código
   - Escribe código 6 chars (ej: ANA123)
   - Click "Unirme" → Mock valida → Navega a /salidas/:id
7. Click en tarjeta de salida → Navega a /salidas/:id (placeholder)
8. Click "Salir" → Logout → Redirige a /auth/login
```

### Datos Mock de Prueba
- **Usuario:** demo@crumbs.app / demo / 123456
- **Salidas:** "Cumpleaños de Ana" (ANA123), "Almuerzo del viernes" (FRI456), "Viaje a la costa" (VIA789)
- **Balances mock:** -$15.000, +$8.500, $0
