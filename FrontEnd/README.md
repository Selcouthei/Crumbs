# 🍞 Crumbs — Frontend

Aplicación web optimizada para móviles para dividir gastos grupales de forma fácil y sin fricción.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Angular 21 (Standalone Components) |
| Lenguaje | TypeScript 5.6+ |
| Build / Dev Server | Angular CLI 21 + esbuild |
| UI | Angular Material 19 + Angular CDK |
| Estilos | SCSS |
| Reactividad | RxJS 7 + Angular Signals |
| HTTP | Angular HttpClient + Interceptors |
| Testing | Vitest |

---

## 📂 Estructura de Carpetas

```
src/
├── app/
│   ├── core/                      # Lógica singleton de la app
│   │   ├── guards/                # AuthGuard — protege rutas privadas
│   │   ├── interceptors/          # AuthInterceptor — adjunta JWT a cada request
│   │   ├── models/                # Interfaces TypeScript del dominio
│   │   └── services/              # Servicios globales (Auth, Salidas, Gastos, etc.)
│   │
│   ├── features/                  # Módulos funcionales (lazy loaded)
│   │   ├── auth/                  # Login y Registro
│   │   ├── dashboard/             # Home con lista de salidas
│   │   ├── salidas/               # Detalle, gastos y balances de una salida
│   │   ├── perfil/                # Gestión del perfil de usuario
│   │   └── amigos/                # Amigos y grupos favoritos
│   │
│   ├── shared/                    # Piezas reutilizables entre features
│   │   ├── components/            # Componentes genéricos (headers, modales, drawers)
│   │   ├── pipes/                 # Pipes personalizados (ej. moneda sin decimales)
│   │   └── directives/            # Directivas (ej. solo números, límite de caracteres)
│   │
│   ├── app.routes.ts              # Rutas principales con lazy loading
│   ├── app.config.ts              # Configuración de providers (standalone)
│   └── app.ts                     # Shell raíz con router-outlet
│
├── public/
│   └── favicon.ico
└── styles.scss                    # Estilos globales
```

---

## ⚙️ Instalación

### Requisitos previos

- Node.js >= 20.x
- npm >= 10.x
- Angular CLI >= 21.x — `npm install -g @angular/cli`

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Crumbs/FrontEnd
```

### 2. Instalar dependencias

```bash
npm install
```

---

## 🚀 Comandos de Desarrollo

### Ejecutar servidor local

```bash
ng serve
```

Abre `http://localhost:4200/` en el navegador. Recarga automáticamente ante cualquier cambio.

### Generar componentes con Angular CLI

```bash
# Componente
ng generate component features/dashboard/components/mi-componente

# Servicio
ng generate service core/services/mi-servicio

# Guard
ng generate guard core/guards/auth

# Pipe
ng generate pipe shared/pipes/currency-integer

# Directiva
ng generate directive shared/directives/number-only
```

### Compilar para producción

```bash
ng build
```

Genera los archivos optimizados en `dist/`. Usa esbuild por defecto para builds rápidos.

### Ejecutar tests unitarios

```bash
ng test
```

---

## 🗺️ Rutas de la Aplicación

| Ruta | Descripción | Guard |
|---|---|---|
| `/auth/login` | Pantalla de inicio de sesión | — |
| `/auth/register` | Pantalla de registro | — |
| `/dashboard` | Home con listado de salidas | ✅ Auth |
| `/salidas/:id` | Detalle de salida, gastos y balances | ✅ Auth |
| `/perfil` | Perfil del usuario | ✅ Auth |
| `/amigos` | Lista de amigos y grupos favoritos | ✅ Auth |

---

## 📐 Decisiones de Arquitectura

### Standalone Components
Toda la app usa la arquitectura standalone de Angular 21. No hay `NgModules`. Cada componente declara sus propias dependencias en el array `imports`.

### Lazy Loading
Cada feature se carga de forma diferida usando `loadComponent` y `loadChildren` en el router, reduciendo el bundle inicial.

### Mobile-First
El componente raíz actúa como shell con `max-width: 480px` centrado, simulando una experiencia de app móvil en escritorio.

### Path Aliases
Para evitar imports relativos profundos, se configuran aliases en `tsconfig.json`:

| Alias | Ruta real |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@features/*` | `src/app/features/*` |
| `@shared/*` | `src/app/shared/*` |

---

## 📋 Reglas de Negocio Clave

- **Montos:** siempre enteros positivos, sin decimales, máximo `$9,999,999`.
- **Integrantes:** pueden ser registrados (por nickname) o fantasmas (nombre manual, max 12 caracteres).
- **División equitativa:** redondeo a pesos enteros, remanente al pagador.
- **División manual:** la suma de partes debe ser exactamente igual al total del gasto.
- **Flag `is_guest`:** excluye al integrante del cobro y redistribuye su cuota entre los demás.
- **Código de salida:** 6 caracteres alfanuméricos únicos para compartir e invitar.
