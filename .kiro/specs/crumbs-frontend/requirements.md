# Crumbs Frontend — Requerimientos

## Descripción General

Crumbs es una aplicación web optimizada para dispositivos móviles que permite a grupos de personas registrar y dividir gastos compartidos durante salidas, viajes o eventos. El frontend consume una API REST y maneja toda la lógica de presentación, validación y cálculo de balances.

---

## Requerimientos Funcionales

### HU_CRUMBS_001 — Registro de Usuario
- **Como** usuario nuevo, **quiero** crear una cuenta con nombre, apellido, nickname, email y contraseña, **para** acceder a la plataforma.
- El nickname debe ser único, sin espacios y máximo 20 caracteres.
- El sistema debe mostrar feedback inmediato si el nickname o email ya están en uso.

### HU_CRUMBS_002 — Login de Usuario
- **Como** usuario registrado, **quiero** iniciar sesión con email y contraseña, **para** acceder a mis salidas.
- Al autenticarse correctamente, el token JWT se almacena y se adjunta a todas las requests posteriores.
- Si el token expira, el usuario es redirigido al login automáticamente.

### HU_CRUMBS_003 — Dashboard / Mis Salidas
- **Como** usuario autenticado, **quiero** ver una lista de todas las salidas en las que participo, **para** acceder rápidamente a cada una.
- Desde el dashboard puedo crear una nueva salida o unirme a una existente mediante código.
- Cada tarjeta de salida muestra nombre, cantidad de integrantes y total de gastos.

### HU_CRUMBS_004 — Agregar Integrantes a una Salida
- **Como** organizador, **quiero** agregar integrantes a mi salida, **para** registrar quiénes participan.
- Integrante registrado: se busca por nickname y se vincula a su cuenta.
- Integrante fantasma: se ingresa solo un nombre (máximo 12 caracteres), sin cuenta en la plataforma.

### HU_CRUMBS_005 — Ver Detalle de Salida
- **Como** integrante, **quiero** ver el detalle de una salida, **para** conocer los gastos registrados y quiénes participan.
- El detalle muestra: nombre de la salida, código, lista de integrantes, lista de gastos y acceso a balances.

### HU_CRUMBS_006 — Agregar Gasto con División Equitativa
- **Como** integrante, **quiero** registrar un gasto dividido en partes iguales, **para** no calcular manualmente cuánto le toca a cada uno.
- El monto se distribuye en partes iguales entre los participantes seleccionados.
- El redondeo a pesos enteros genera un remanente que se carga al pagador.
- El monto es un entero positivo (sin decimales), máximo $9,999,999.

### HU_CRUMBS_007 — Agregar Gasto con División Manual
- **Como** integrante, **quiero** asignar manualmente cuánto paga cada participante, **para** casos donde la división no es equitativa.
- La suma de los montos individuales debe ser exactamente igual al total del gasto.
- El sistema valida en tiempo real y bloquea el guardado si la suma no coincide.

### HU_CRUMBS_008 — Flag "Es Invitado" en un Gasto
- **Como** integrante, **quiero** marcar a alguien como invitado en un gasto específico, **para** excluirlo del cobro en ese gasto.
- La cuota del invitado se redistribuye entre los demás participantes.

### HU_CRUMBS_009 — Ver Balances de una Salida
- **Como** integrante, **quiero** ver quién le debe a quién y cuánto, **para** saldar cuentas al final.
- Se muestra el balance neto de cada integrante (positivo = le deben, negativo = debe).
- Se presentan sugerencias de pagos para simplificar la liquidación.

### HU_CRUMBS_010 — Gestión de Amigos
- **Como** usuario, **quiero** agregar amigos por nickname, **para** agregarlos fácilmente a futuras salidas.
- Puedo ver mi lista de amigos y eliminar contactos.

### HU_CRUMBS_011 — Grupos Favoritos
- **Como** usuario, **quiero** crear grupos de amigos favoritos, **para** agregar rápidamente a un conjunto habitual de personas a una salida.

---

## Requerimientos No Funcionales

### RNF_001 — Mobile-First
- La aplicación debe verse y comportarse como una app móvil nativa.
- Layout máximo de 480px de ancho, centrado en pantallas de escritorio.
- Todos los elementos interactivos deben tener un área táctil mínima de 44x44px.

### RNF_002 — Performance
- El bundle inicial debe ser inferior a 200KB (gzipped).
- Todas las features se cargan de forma diferida (lazy loading).
- Las animaciones no deben superar los 300ms.

### RNF_003 — Validación de Formularios
- Toda validación de formato ocurre en el cliente antes de enviar al servidor.
- Los campos numéricos aceptan solo enteros positivos (directiva `NumberOnly`).
- Los campos de nombre de fantasma tienen límite de 12 caracteres (directiva `MaxLengthRestriction`).

### RNF_004 — Seguridad
- El token JWT se almacena en `localStorage` con clave `crumbs_token`.
- Todas las rutas excepto `/auth/*` están protegidas por `AuthGuard`.
- El `AuthInterceptor` adjunta el token como `Bearer` en cada request HTTP.

### RNF_005 — Accesibilidad
- Los componentes de Angular Material ya cumplen WCAG 2.1 AA en su base.
- Todos los íconos deben tener `aria-label` descriptivo.
- El contraste de colores del tema personalizado debe cumplir ratio mínimo 4.5:1.
