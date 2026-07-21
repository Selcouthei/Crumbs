# Crumbs Frontend — Diseño Técnico

## Arquitectura General

La aplicación sigue una arquitectura **Feature-based** con **Standalone Components** de Angular 19. No existen NgModules. Cada feature es una unidad autónoma con sus propios componentes, rutas y servicios locales, mientras que los servicios globales viven en `core/`.

```
Bootstrap (main.ts)
    └── AppComponent (shell)
            └── RouterOutlet
                    ├── /auth       → AuthFeature (lazy)
                    ├── /dashboard  → DashboardComponent (lazy)
                    ├── /salidas/:id → SalidaDetailComponent (lazy)
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

| Servicio | Responsabilidad |
|---|---|
| `AuthService` | Login, registro, manejo de token JWT, estado del usuario actual |
| `SalidasService` | CRUD de salidas, código de unión |
| `IntegrantesService` | Agregar/eliminar integrantes (registrados y fantasmas) |
| `GastosService` | CRUD de gastos, lógica de división |
| `BalancesService` | Cálculo y consulta de balances por salida |
| `AmigosService` | Gestión de amigos y grupos favoritos |

Todos los servicios usan `HttpClient` y retornan `Observable<T>`. El estado global del usuario se maneja con un `BehaviorSubject<User | null>` en `AuthService`.

---

## Guards e Interceptors

### AuthGuard (`core/guards/auth.guard.ts`)
- Función guard (`CanActivateFn`).
- Si no hay token válido en `localStorage`, redirige a `/auth/login`.

### AuthInterceptor (`core/interceptors/auth.interceptor.ts`)
- Función interceptor (`HttpInterceptorFn`).
- Adjunta el header `Authorization: Bearer <token>` a todas las requests.
- Si recibe un `401`, limpia el token y redirige al login.

### MockAuthInterceptor (`core/interceptors/mock-auth.interceptor.ts`)
- Función interceptor (`HttpInterceptorFn`) para desarrollo.
- Simula respuestas de `POST /api/auth/login` y `POST /api/auth/register`.
- Delay de 500ms para simular latencia de red.
- Usuario de prueba: `demo@crumbs.app` / `demo` / `123456`.
- Se activa solo cuando `environment.useMocks = true`.
- **Para conectar al backend real:** cambiar `useMocks` a `false` en environments.

---

## Componentes Shared

| Componente | Descripción |
|---|---|
| `PageHeaderComponent` | Header reutilizable con título, botón back y acciones opcionales |
| `ConfirmDialogComponent` | Dialog genérico de confirmación (sí/no) |
| `EmptyStateComponent` | Ilustración + mensaje cuando una lista está vacía |

### Pipes
| Pipe | Descripción |
|---|---|
| `CurrencyIntegerPipe` | Formatea números como `$1.234` (sin decimales, con separador de miles) |

### Directives
| Directiva | Descripción |
|---|---|
| `NumberOnlyDirective` | Restringe input a solo dígitos enteros positivos |
| `MaxLengthRestrictionDirective` | Limita caracteres en un input sin contar espacios |

---

## Tema Visual (Angular Material)

- **Paleta primaria:** Purple (`#6750A4`) — M3 baseline.
- **Paleta de acento:** Teal.
- **Tipografía:** Roboto.
- El tema se define en `styles.scss` usando la API `@use '@angular/material' as mat`.

---

## Estructura de Features

### Auth
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

### Core (Implementado)
```
core/
├── models/
│   └── user.model.ts
├── interfaces/
│   └── auth.interfaces.ts          ← Contratos API documentados (DTOs)
├── services/
│   └── auth.service.ts
├── guards/
│   └── auth.guard.ts
└── interceptors/
    ├── auth.interceptor.ts          ← Producción: adjunta Bearer token
    └── mock-auth.interceptor.ts     ← Desarrollo: simula backend
```

### Environments
```
src/environments/
├── environment.ts                   ← Producción (useMocks: false)
└── environment.development.ts       ← Desarrollo (useMocks: true)
```

### Dashboard
```
features/dashboard/
├── dashboard.component.ts
├── components/
│   ├── salida-card/
│   ├── crear-salida-modal/
│   └── unirse-salida-modal/
```

### Salidas
```
features/salidas/
├── salida-detail/
│   └── salida-detail.component.ts
├── components/
│   ├── gastos-list/
│   ├── agregar-gasto-drawer/
│   ├── agregar-integrante-drawer/
│   └── balances-view/
```

### Perfil
```
features/perfil/
└── perfil.component.ts
```

### Amigos
```
features/amigos/
├── amigos.routes.ts
├── amigos-list/
│   └── amigos-list.component.ts
└── grupos/
    └── grupos.component.ts
```
