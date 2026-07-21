# 🍞 Crumbs — Frontend

Aplicación web optimizada para móviles para dividir gastos grupales de forma fácil y sin fricción.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Angular 19 (Standalone Components) |
| Lenguaje | TypeScript 5.6+ |
| Build / Dev Server | Vite 5 + @analogjs/vite-plugin-angular |
| UI | Angular Material 19 + Angular CDK |
| Estilos utilitarios | Tailwind CSS 3 |
| Reactividad | RxJS 7 + Angular Signals |
| HTTP | Angular HttpClient + Interceptors |

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
│   └── app.component.ts           # Shell raíz con router-outlet
│
├── assets/
│   ├── icons/                     # Íconos SVG y favicon
│   └── images/                    # Imágenes estáticas
│
├── styles.scss                    # Estilos globales y tema de Angular Material
├── index.html                     # HTML raíz
└── main.ts                        # Bootstrap de la aplicación
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos

- Node.js >= 20.x
- npm >= 10.x

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Crumbs
```

### 2. Instalar dependencias

```bash
npm install
```

---

## 🚀 Comandos de Desarrollo

### Ejecutar servidor local (Vite)

```bash
npm run dev
```

Abre automáticamente `http://localhost:4200`. El servidor recarga en caliente ante cualquier cambio.

### Compilar para producción

```bash
npm run build
```

Genera los archivos optimizados en la carpeta `dist/`.

### Previsualizar el build de producción

```bash
npm run preview
```

Sirve el contenido de `dist/` localmente para verificar el build antes de desplegarlo.

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
Toda la app usa la arquitectura standalone de Angular 19. No hay `NgModules`. Cada componente declara sus propias dependencias en el array `imports`.

### Lazy Loading
Cada feature se carga de forma diferida usando `loadComponent` y `loadChildren` en el router, reduciendo el bundle inicial.

### Mobile-First
El `AppComponent` actúa como shell con `max-width: 480px` centrado, simulando una experiencia de app móvil incluso en escritorio.

### Path Aliases
Para evitar imports relativos profundos, se configuraron aliases en `tsconfig.json` y `vite.config.ts`:

| Alias | Ruta real |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@features/*` | `src/app/features/*` |
| `@shared/*` | `src/app/shared/*` |
| `@assets/*` | `src/assets/*` |

---

## 📋 Reglas de Negocio Clave

- **Montos:** siempre enteros positivos, sin decimales, máximo `$9,999,999`.
- **Integrantes:** pueden ser registrados (por nickname) o fantasmas (nombre manual, max 12 caracteres).
- **División equitativa:** redondeo a pesos enteros, remanente al pagador.
- **División manual:** la suma de partes debe ser exactamente igual al total del gasto.
- **Flag `is_guest`:** excluye al integrante del cobro y redistribuye su cuota entre los demás.
- **Código de salida:** 6 caracteres alfanuméricos únicos para compartir e invitar.
