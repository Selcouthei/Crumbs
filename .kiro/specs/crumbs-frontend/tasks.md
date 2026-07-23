# Crumbs Frontend — Tareas de Implementación

## Fase 1 — Base y Configuración

- [x] **T01** Crear `index.html` con meta tags mobile-first y fuentes de Angular Material
- [x] **T02** Crear `src/main.ts` con `bootstrapApplication`
- [x] **T03** Crear `src/styles.scss` con tema personalizado de Angular Material
- [x] **T04** Crear `src/app/app.routes.ts` con todas las rutas y lazy loading
- [x] **T05** Crear `src/app/app.config.ts` con todos los providers (router, httpClient, animations)
- [x] **T06** Crear `src/app/app.component.ts` como shell mobile-first
- [x] **T06b** Crear `tailwind.config.js` y `postcss.config.js`
- [x] **T06c** Actualizar `vite.config.ts` (root: 'src')
- [x] **T06d** Crear `FrontEnd/Dockerfile` multi-stage (desarrollo con hot-reload + producción con Nginx)
- [x] **T06e** Crear `docker-compose.yml` en raíz del proyecto para levantar con `docker compose up`
- [x] **T06f** Crear `FrontEnd/nginx.conf` para SPA routing en producción
- [x] **T06g** Crear `FrontEnd/.dockerignore` para optimizar build context

## Fase 2 — Core: Modelos

- [x] **T07** Crear `core/models/user.model.ts`
- [x] **T08** Crear `core/models/salida.model.ts`
- [x] **T09** Crear `core/models/gasto.model.ts` (incluye MetodoDivision type)
- [x] **T10** Crear `core/models/miembro.model.ts` / `integrante.model.ts`
- [x] **T10b** Crear `core/models/participante.model.ts`
- [x] **T10c** Crear `core/models/index.ts` (barrel file)
- [ ] **T11** Crear `core/models/pago.model.ts`

## Fase 3 — Core: Seguridad

- [x] **T12** Crear `core/guards/auth.guard.ts` (`CanActivateFn`)
- [x] **T13** Crear `core/interceptors/auth.interceptor.ts` (`HttpInterceptorFn`) con manejo de 401

## Fase 4 — Core: Servicios

- [x] **T14** Crear `core/services/auth.service.ts` (login, register, token, currentUser$)
- [x] **T15** Crear `core/services/salida.service.ts` / `salidas.service.ts` (getMisSalidas, crearSalida, unirseSalida)
- [x] **T16** Crear `core/services/miembro.service.ts` (búsqueda, frecuentes, fantasma — MOCK)
- [x] **T17** Crear `core/services/gasto.service.ts` (CRUD completo — MOCK)
- [x] **T17b** Crear `core/services/index.ts` (barrel file)
- [ ] **T18** Crear `core/services/balances.service.ts` (cálculo de balances y deudas)
- [ ] **T19** Crear `core/services/amigos.service.ts` (amigos y grupos favoritos)

## Fase 5 — Shared

- [x] **T20** Crear `shared/pipes/currency-format.pipe.ts` (formatea montos como $X,XXX sin decimales)
- [x] **T21** Crear `shared/directives/only-numbers.directive.ts`
- [x] **T24** Crear `shared/components/confirm-dialog/confirm-dialog.component.ts`
- [ ] **T22** Crear `shared/directives/max-length-restriction.directive.ts`
- [ ] **T23** Crear `shared/components/page-header/page-header.component.ts`
- [ ] **T25** Crear `shared/components/empty-state/empty-state.component.ts`

## Fase 6 — Feature: Auth

- [x] **T26** Crear `features/auth/auth.routes.ts`
- [x] **T27** Crear `features/auth/login/login.component.ts` (HU_CRUMBS_001)
- [x] **T28** Crear `features/auth/register/register.component.ts` (HU_CRUMBS_002)

## Fase 7 — Feature: Dashboard

- [x] **T29** Crear `features/dashboard/dashboard.component.ts` (HU_CRUMBS_003)
- [x] **T30** Crear `features/dashboard/components/salida-card/salida-card.component.ts`
- [x] **T31** Crear `features/dashboard/components/crear-salida-modal/crear-salida-modal.component.ts`
- [x] **T32** Crear `features/dashboard/components/unirse-salida-modal/unirse-salida-modal.component.ts`
- [x] **T32b** Crear `core/interceptors/mock-salidas.interceptor.ts` (mock de salidas para desarrollo)
- [x] **T32c** Crear `core/interfaces/salidas.interfaces.ts` (DTOs del módulo de salidas)

## Fase 8 — Feature: Salidas (en progreso — otro miembro del equipo)

- [x] **T33** Crear `features/salidas/salida-detail/salida-detail.component.ts` (HU_CRUMBS_005)
- [x] **T34** Crear `features/salidas/salida-detail/components/gasto-list/gasto-list.component.ts`
- [x] **T34b** Crear `features/salidas/salida-detail/components/gasto-item/gasto-item.component.ts`
- [x] **T35** Crear `features/salidas/salida-detail/components/miembros-drawer/miembros-drawer.component.ts` (HU_CRUMBS_004)
- [x] **T36** Crear `features/salidas/salida-detail/components/gasto-drawer/gasto-drawer.component.ts` (HU_CRUMBS_006, 007, 008)
- [ ] **T37** Crear `features/salidas/components/balances-view/balances-view.component.ts` (HU_CRUMBS_009)

## Fase 9 — Feature: Perfil y Amigos

- [x] **T38** Crear `features/perfil/perfil.component.ts`
- [ ] **T39** Crear `features/amigos/amigos.routes.ts`
- [ ] **T40** Crear `features/amigos/amigos-list/amigos-list.component.ts` (HU_CRUMBS_010)
- [ ] **T41** Crear `features/amigos/grupos/grupos.component.ts` (HU_CRUMBS_011)
