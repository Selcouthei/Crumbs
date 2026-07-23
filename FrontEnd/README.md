# Crumbs — Frontend

Aplicación web para dividir gastos entre amigos. Construida con **Angular 21**, **Angular Material** y **Tailwind CSS**.

## Stack Tecnológico

- **Framework:** Angular 21 (standalone components, signals)
- **UI Library:** Angular Material (M3 theme, Purple primary)
- **Styling:** Tailwind CSS + SCSS
- **Build:** Vite + Angular CLI
- **Containerización:** Docker (dev + prod)

## Desarrollo

### Con Docker (recomendado)

Solo necesitas Docker instalado. No necesitas Node, npm ni Angular CLI.

```bash
cd Crumbs
docker compose up          # Levanta en http://localhost:4200 con hot-reload
docker compose up --build  # Reconstruir si cambiaste package.json
docker compose down        # Detener
```

### Sin Docker

Requiere Node 22+ y npm 11+.

```bash
cd Crumbs/FrontEnd
npm install
npm start                  # http://localhost:4200
```

## Build de producción

```bash
npm run build              # Output en dist/crumbs/
```

O con Docker:

```bash
docker compose --profile prod up --build   # Sirve en http://localhost:80
```

## Estructura del Proyecto

```
FrontEnd/src/app/
├── core/                    # Servicios globales, modelos, guards, interceptors
│   ├── models/              # Interfaces de dominio (User, Salida, Gasto, Miembro)
│   ├── interfaces/          # DTOs/contratos del API
│   ├── services/            # Servicios HTTP (auth, salidas, gastos, miembros)
│   ├── guards/              # AuthGuard
│   └── interceptors/        # Auth interceptor + mocks para desarrollo
├── features/                # Módulos por feature (lazy loaded)
│   ├── auth/                # Login, Registro
│   ├── dashboard/           # Home: salidas activas, crear/unirse
│   ├── salidas/             # Detalle salida: gastos, miembros, drawers
│   └── perfil/              # Perfil del usuario
├── shared/                  # Pipes, directivas, componentes compartidos
└── environments/            # Configuración por entorno
```

## Datos de Prueba (Mock)

- **Login:** `demo@crumbs.app` / `demo` / contraseña: `123456`
- **Salidas mock:** "Cine / Spiderman" (A3B9X2), "Cumpleaños de Ana" (ANA123)
- **Mocks activos cuando:** `environment.useMocks = true`

## Conectar al Backend Real

1. En `src/environments/environment.development.ts` cambiar `useMocks: false`
2. Configurar `apiUrl` con la URL del backend (ej: `http://localhost:8000/api`)
3. Los mocks se desactivan automáticamente
4. Los contratos del API están en `core/interfaces/`

## Tema Visual

- **Color primario:** Purple `#6750A4` (Material M3)
- **Tipografía:** Roboto
- **Layout:** Responsive — desktop (grid 2 cols) / mobile (1 col stacked)
- **Header:** Toolbar purple con logo "Crumbs" (clickeable → dashboard)

## Tests

```bash
npm test     # Unit tests con Vitest
```

## Deploy

Ver `Docs/plan-deploy-aws.md` para el plan de deploy con AWS EC2 Free Tier ($0).
