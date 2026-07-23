# Crumbs Frontend — Tareas de Implementación

## Estado: Frontend completo (solo falta pulir + conectar backend)

---

## Fase 1 — Base y Configuración

- [x] **T01** Crear `index.html` con meta tags mobile-first y fuentes de Angular Material
- [x] **T02** Crear `src/main.ts` con `bootstrapApplication`
- [x] **T03** Crear `src/styles.scss` con tema personalizado de Angular Material + Tailwind
- [x] **T04** Crear `src/app/app.routes.ts` con todas las rutas y lazy loading
- [x] **T05** Crear `src/app/app.config.ts` con todos los providers (router, httpClient, animations, NativeDateAdapter)
- [x] **T06** Crear `src/app/app.component.ts` como shell mobile-first
- [x] **T06b** Crear `FrontEnd/Dockerfile` multi-stage (desarrollo con hot-reload + producción con Nginx)
- [x] **T06c** Crear `docker-compose.yml` en raíz del proyecto para levantar con `docker compose up`
- [x] **T06d** Crear `FrontEnd/nginx.conf` para SPA routing en producción
- [x] **T06e** Crear `FrontEnd/.dockerignore` para optimizar build context
- [x] **T06f** Crear `tailwind.config.js` y `postcss.config.js`
- [x] **T06g** Crear `vite.config.ts`

## Fase 2 — Core: Modelos

- [x] **T07** Crear `core/models/user.model.ts`
- [x] **T08** Crear `core/models/salida.model.ts` (con miembros[] opcional)
- [x] **T09** Crear `core/models/gasto.model.ts` + MetodoDivision type
- [x] **T10** Crear `core/models/integrante.model.ts`
- [x] **T10b** Crear `core/models/miembro.model.ts`
- [x] **T10c** Crear `core/models/participante.model.ts`
- [x] **T11** Crear `core/models/index.ts` (barrel exports)

## Fase 3 — Core: Seguridad

- [x] **T12** Crear `core/guards/auth.guard.ts` (`CanActivateFn`)
- [x] **T13** Crear `core/interceptors/auth.interceptor.ts` (`HttpInterceptorFn`) con manejo de 401

## Fase 4 — Core: Servicios

- [x] **T14** Crear `core/services/auth.service.ts` (login, register, token, currentUser$)
- [x] **T15** Crear `core/services/salidas.service.ts` (getMisSalidas, crearSalida, unirseSalida — dashboard)
- [x] **T15b** Crear `core/services/salida.service.ts` (getSalidaById, agregarMiembro — detalle)
- [x] **T16** Crear `core/services/miembro.service.ts` (buscarPorUsername, buscarPorEmail, frecuentes, fantasma)
- [x] **T17** Crear `core/services/gasto.service.ts` (CRUD completo)
- [x] **T18** Crear `core/services/index.ts` (barrel exports)
- [ ] **T19** Crear `core/services/balances.service.ts` (cálculo de balances y deudas)
- [ ] **T20** Crear `core/services/amigos.service.ts` (amigos y grupos favoritos)

## Fase 5 — Core: Interceptors Mock

- [x] **T21** Crear `core/interceptors/mock-auth.interceptor.ts`
- [x] **T22** Crear `core/interceptors/mock-salidas.interceptor.ts`

## Fase 6 — Shared

- [x] **T23** Crear `shared/pipes/currency-format.pipe.ts`
- [x] **T24** Crear `shared/directives/only-numbers.directive.ts`
- [x] **T25** Crear `shared/components/confirm-dialog/confirm-dialog.component.ts`
- [ ] **T26** Crear `shared/components/page-header/page-header.component.ts`
- [ ] **T27** Crear `shared/components/empty-state/empty-state.component.ts`

## Fase 7 — Feature: Auth ✅

- [x] **T28** Crear `features/auth/auth.routes.ts`
- [x] **T29** Crear `features/auth/login/login.component.ts`
- [x] **T30** Crear `features/auth/register/register.component.ts`

## Fase 8 — Feature: Dashboard ✅

- [x] **T31** Crear `features/dashboard/dashboard.component.ts` (saludo, botones, lista)
- [x] **T32** Crear `features/dashboard/components/salida-card/salida-card.component.ts`
- [x] **T33** Crear `features/dashboard/components/crear-salida-modal/crear-salida-modal.component.ts`
- [x] **T34** Crear `features/dashboard/components/unirse-salida-modal/unirse-salida-modal.component.ts`

## Fase 9 — Feature: Detalle de Salida ✅

- [x] **T35** Crear `features/salidas/salida-detail/salida-detail.component.ts`
- [x] **T36** Crear `features/salidas/salida-detail/components/gasto-list/gasto-list.component.ts`
- [x] **T37** Crear `features/salidas/salida-detail/components/gasto-item/gasto-item.component.ts`
- [x] **T38** Crear `features/salidas/salida-detail/components/gasto-drawer/gasto-drawer.component.ts`
- [x] **T39** Crear `features/salidas/salida-detail/components/miembros-drawer/miembros-drawer.component.ts`

## Fase 10 — Feature: Perfil ✅

- [x] **T40** Crear `features/perfil/perfil.component.ts`

## Fase 11 — Pendiente (pulir)

- [ ] **T41** Feature: Amigos (amigos-list, grupos)
- [ ] **T42** Feature: Balances (vista de quién debe a quién)
- [ ] **T43** Swap servicios mock → HTTP real (solo cambiar useMocks: false)
- [ ] **T44** Unit tests
- [ ] **T45** E2E tests

---

## Resumen de Estado

| Módulo | Estado | Notas |
|---|---|---|
| Auth (login/register) | ✅ Completo | Mock interceptor, JWT fake |
| Dashboard | ✅ Completo | Crear salida, unirse, lista con balance |
| Detalle Salida | ✅ Completo | CRUD gastos, agregar miembros, drawers |
| Perfil | ✅ Completo | Visualización de datos del usuario |
| Docker | ✅ Completo | Dev (hot-reload) + Prod (Nginx) |
| Amigos | ❌ Pendiente | No es MVP crítico |
| Balances | ❌ Pendiente | Cálculo de deudas |

## Para conectar al Backend Real

1. Cambiar `environment.useMocks` a `false`
2. Configurar `environment.apiUrl` con la URL del backend
3. Los servicios ya hacen llamadas HTTP reales (los mocks solo interceptan)
4. Los DTOs/interfaces en `core/interfaces/` son el contrato del API
