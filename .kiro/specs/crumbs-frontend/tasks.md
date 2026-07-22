# Crumbs Frontend — Tareas de Implementación

## Fase 1 — Base y Configuración

- [x] **T01** Crear `index.html` con meta tags mobile-first y fuentes de Angular Material
- [x] **T02** Crear `src/main.ts` con `bootstrapApplication`
- [x] **T03** Crear `src/styles.scss` con tema personalizado de Angular Material
- [x] **T04** Crear `src/app/app.routes.ts` con todas las rutas y lazy loading
- [x] **T05** Crear `src/app/app.config.ts` con todos los providers (router, httpClient, animations)
- [x] **T06** Crear `src/app/app.component.ts` como shell mobile-first
- [x] **T06b** Crear `FrontEnd/Dockerfile` multi-stage (desarrollo con hot-reload + producción con Nginx)
- [x] **T06c** Crear `docker-compose.yml` en raíz del proyecto para levantar con `docker compose up`
- [x] **T06d** Crear `FrontEnd/nginx.conf` para SPA routing en producción
- [x] **T06e** Crear `FrontEnd/.dockerignore` para optimizar build context

## Fase 2 — Core: Modelos

- [x] **T07** Crear `core/models/user.model.ts`
- [ ] **T08** Crear `core/models/salida.model.ts`
- [ ] **T09** Crear `core/models/gasto.model.ts`
- [ ] **T10** Crear `core/models/integrante.model.ts`
- [ ] **T11** Crear `core/models/pago.model.ts`

## Fase 3 — Core: Seguridad

- [x] **T12** Crear `core/guards/auth.guard.ts` (`CanActivateFn`)
- [x] **T13** Crear `core/interceptors/auth.interceptor.ts` (`HttpInterceptorFn`) con manejo de 401

## Fase 4 — Core: Servicios

- [x] **T14** Crear `core/services/auth.service.ts` (login, register, token, currentUser$)
- [ ] **T15** Crear `core/services/salidas.service.ts` (CRUD + código de unión)
- [ ] **T16** Crear `core/services/integrantes.service.ts` (registrados y fantasmas)
- [ ] **T17** Crear `core/services/gastos.service.ts` (CRUD + lógica de división)
- [ ] **T18** Crear `core/services/balances.service.ts` (cálculo de balances y deudas)
- [ ] **T19** Crear `core/services/amigos.service.ts` (amigos y grupos favoritos)

## Fase 5 — Shared

- [ ] **T20** Crear `shared/pipes/currency-integer.pipe.ts`
- [ ] **T21** Crear `shared/directives/number-only.directive.ts`
- [ ] **T22** Crear `shared/directives/max-length-restriction.directive.ts`
- [ ] **T23** Crear `shared/components/page-header/page-header.component.ts`
- [ ] **T24** Crear `shared/components/confirm-dialog/confirm-dialog.component.ts`
- [ ] **T25** Crear `shared/components/empty-state/empty-state.component.ts`

## Fase 6 — Feature: Auth

- [x] **T26** Crear `features/auth/auth.routes.ts`
- [x] **T27** Crear `features/auth/login/login.component.ts` (HU_CRUMBS_001)
- [x] **T28** Crear `features/auth/register/register.component.ts` (HU_CRUMBS_002)

## Fase 7 — Feature: Dashboard

- [ ] **T29** Crear `features/dashboard/dashboard.component.ts` (HU_CRUMBS_003)
- [ ] **T30** Crear `features/dashboard/components/salida-card/salida-card.component.ts`
- [ ] **T31** Crear `features/dashboard/components/crear-salida-modal/crear-salida-modal.component.ts`
- [ ] **T32** Crear `features/dashboard/components/unirse-salida-modal/unirse-salida-modal.component.ts`

## Fase 8 — Feature: Salidas

- [ ] **T33** Crear `features/salidas/salida-detail/salida-detail.component.ts` (HU_CRUMBS_005)
- [ ] **T34** Crear `features/salidas/components/gastos-list/gastos-list.component.ts`
- [ ] **T35** Crear `features/salidas/components/agregar-integrante-drawer/agregar-integrante-drawer.component.ts` (HU_CRUMBS_004)
- [ ] **T36** Crear `features/salidas/components/agregar-gasto-drawer/agregar-gasto-drawer.component.ts` (HU_CRUMBS_006, 007, 008)
- [ ] **T37** Crear `features/salidas/components/balances-view/balances-view.component.ts` (HU_CRUMBS_009)

## Fase 9 — Feature: Perfil y Amigos

- [ ] **T38** Crear `features/perfil/perfil.component.ts`
- [ ] **T39** Crear `features/amigos/amigos.routes.ts`
- [ ] **T40** Crear `features/amigos/amigos-list/amigos-list.component.ts` (HU_CRUMBS_010)
- [ ] **T41** Crear `features/amigos/grupos/grupos.component.ts` (HU_CRUMBS_011)
