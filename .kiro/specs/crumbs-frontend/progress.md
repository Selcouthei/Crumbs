# Crumbs Frontend — Progreso de Implementación

## Fecha: 2026-07-21

### Módulo Implementado: Detalle de Salida (`/salidas/:id`)

Se implementó el módulo completo de detalle de salida con todas las funcionalidades del MVP.

---

## Archivos Creados (21 archivos TypeScript + 4 config)

### Configuración Base
| Archivo | Descripción |
|---|---|
| `src/index.html` | HTML raíz con viewport mobile y fuentes |
| `src/main.ts` | Bootstrap de la aplicación |
| `src/styles.scss` | Tema Material + Tailwind directives |
| `src/app/app.component.ts` | Shell mobile-first (max-width 480px) |
| `src/app/app.config.ts` | Providers (router, animations, httpClient) |
| `src/app/app.routes.ts` | Rutas con lazy loading |
| `tailwind.config.js` | Configuración Tailwind CSS |
| `postcss.config.js` | PostCSS plugins |
| `vite.config.ts` | Actualizado con root: 'src' |

### Modelos (`@core/models/`)
| Archivo | Descripción |
|---|---|
| `salida.model.ts` | Interface Salida (id, titulo, codigo, fecha_creacion, miembros) |
| `gasto.model.ts` | Interface Gasto + MetodoDivision type |
| `miembro.model.ts` | Interface Miembro (con is_guest flag) |
| `participante.model.ts` | Interface Participante (miembro_id, monto_asignado) |
| `index.ts` | Barrel file |

### Servicios Mock (`@core/services/`)
| Archivo | Descripción |
|---|---|
| `salida.service.ts` | getSalidaById, agregarMiembroASalida (BehaviorSubject) |
| `gasto.service.ts` | CRUD completo: getGastosBySalida, crearGasto, editarGasto, eliminarGasto |
| `miembro.service.ts` | buscarPorUsername, buscarPorEmail, getMiembrosFrecuentes, crearFantasma |
| `index.ts` | Barrel file |

### Feature: Salidas (`@features/salidas/`)
| Archivo | Descripción |
|---|---|
| `salida-detail/salida-detail.component.ts` | Página principal con header, lista, drawers y CRUD wiring |
| `salida-detail/components/gasto-list/gasto-list.component.ts` | Lista de gastos con header y estado vacío |
| `salida-detail/components/gasto-item/gasto-item.component.ts` | Item de gasto con mat-menu (editar/eliminar) |
| `salida-detail/components/gasto-drawer/gasto-drawer.component.ts` | Drawer crear/editar gasto con división equitativa/manual |
| `salida-detail/components/miembros-drawer/miembros-drawer.component.ts` | Drawer buscar/agregar integrantes + fantasmas |

### Shared (`@shared/`)
| Archivo | Descripción |
|---|---|
| `pipes/currency-format.pipe.ts` | Formatea montos como $X,XXX (sin decimales) |
| `directives/only-numbers.directive.ts` | Restringe input a solo dígitos |
| `components/confirm-dialog/confirm-dialog.component.ts` | Dialog de confirmación reutilizable |

---

## Funcionalidades Implementadas

1. ✅ **Bootstrapping completo** — Angular 19 + Vite + Tailwind + Material
2. ✅ **Salida Page** — Título, código de invitación, lista cronológica de gastos
3. ✅ **CRUD de Gastos** — Crear, editar (precarga drawer), eliminar (confirm dialog)
4. ✅ **División Equitativa** — Math.floor(monto/n), remanente al pagador
5. ✅ **División Manual** — Input por miembro, validación suma === total en tiempo real
6. ✅ **Flag is_guest** — Invitados excluidos del cobro, cuota redistribuida
7. ✅ **Agregar Integrantes** — Búsqueda por username/email, miembros frecuentes
8. ✅ **Integrantes Fantasma** — Creación inline (max 12 chars), badge "(invitado)"
9. ✅ **Mobile-first** — Shell 480px centrado
10. ✅ **Servicios Mock** — Datos realistas con delay(300ms), BehaviorSubject reactivo

---

## Decisiones Técnicas

- **No NgModules** — Toda la app usa standalone components
- **inject() pattern** — DI via función en lugar de constructor injection
- **Inline templates** — Todos los componentes usan `template` en lugar de archivos separados
- **Tailwind + Material** — Tailwind para layout/spacing, Material para componentes interactivos
- **BehaviorSubject** — Estado reactivo en servicios mock (facilita swap a API real)
- **Drawer pattern** — Overlay con backdrop + panel deslizante (sin MatSidenav del layout)

---

## Pendiente para Próximas Fases

- Auth (login/registro, guards, interceptors)
- Dashboard (lista de salidas)
- Balances (cálculo de deudas)
- Perfil y Amigos
- Swap de servicios mock a HTTP real
- Unit tests
- E2E tests
