# Plan de Trabajo y Cronograma de Tareas (MVP SplitApp)

Este documento define el flujo lineal y ordenado por fases de desarrollo para el Producto Mínimo Viable (MVP), enfocado exclusivamente en el módulo de **Salidas Grupales**. La estructura sigue una metodología ágil (Scrum) y está diseñada para dejar una base técnica extensible que permita incorporar a futuro los módulos de *Casas* y *Cadenas*.

---

## 📋 Fase 1: Análisis, Diseño y Arquitectura (Sprint 0)
*Esta fase sienta las bases conceptuales, visuales y técnicas para que el desarrollo fluya sin interrupciones ni bloqueos.*

### 1.1 Gestión de Producto
- [ ] Redactar el listado definitivo de Historias de Usuario (Backlog) para el módulo de Salidas Grupales.
- [ ] Definir los Criterios de Aceptación para cada historia utilizando el formato BDD (*Dado / Cuando / Entonces*).

### 1.2 Diseño de Experiencia de Usuario (UX/UI)
- [ ] Crear *wireframes* de baja fidelidad para mapear el flujo de las pantallas críticas (Calculadora de división y Escaneo QR).
- [ ] Definir la Guía de Estilo Visual (UI Kit): tipografías, componentes base y paleta de colores con contrastes llamativos (acentos neón) para los estados de cuenta (*Pagado / Pendiente*).
- [ ] Construir el prototipo interactivo de alta fidelidad en Figma.

### 1.3 Definición Técnica y Arquitectura
- [ ] Definir el *Stack* Tecnológico (Frontend independiente y Backend con soporte para REST y WebSockets).
- [ ] Diseñar el modelo de datos relacional (Diagrama Entidad-Relación) y el diccionario de datos.
- [ ] Inicializar los repositorios de Git y configurar los entornos locales de desarrollo (`.env`, linters, etc.).

---

## 👥 Fase 2: Implementación del Core - Gestión de Grupos y Accesos (Sprint 1)
*El objetivo es lograr que un usuario pueda crear el espacio de la salida y que sus amigos se unan al instante de forma eficiente.*

### 2.1 Desarrollo Backend
- [ ] Crear los modelos de la base de datos para `users`, `groups` (con tipo 'salida') y `group_members`.
- [ ] Desarrollar el endpoint para la creación de grupos (`POST /api/groups`).
- [ ] Implementar el algoritmo de generación de códigos únicos de 6 caracteres (`code_id`).
- [ ] Desarrollar el endpoint para unirse a un grupo mediante código (`POST /api/groups/join`).

### 2.2 Desarrollo Frontend
- [ ] Diseñar e implementar la pantalla/dashboard principal de "Mis Grupos".
- [ ] Desarrollar el formulario visual de "Crear Nuevo Grupo".
- [ ] Crear la vista de detalle del grupo donde se renderice el ID alfanumérico y se genere visualmente el código QR.
- [ ] Implementar la interfaz para "Unirse a un Grupo" (con soporte para digitar el código o activar la cámara para escanear el QR).

---

## 🍔 Fase 3: Registro de Gastos y Desglose Multilugar (Sprint 2)
*En esta fase habilitamos la capacidad de registrar en qué se gastó el dinero y estructurar los gastos complejos mediante subcategorías.*

### 3.1 Desarrollo Backend
- [ ] Crear las tablas/entidades para `expenses` y `expense_subcategories`.
- [ ] Desarrollar el endpoint para registrar un gasto (`POST /api/expenses`), asegurando la validación de que la suma de las subcategorías coincida exactamente con el monto total reportado.

### 3.2 Desarrollo Frontend
- [ ] Desarrollar la interfaz del formulario "Añadir Gasto" (Monto total, título, fecha).
- [ ] Diseñar el componente dinámico para agregar múltiples filas de subcategorías (ej: agregar fila para *Restaurante*, fila para *Bar*).
- [ ] Implementar validaciones en el cliente para que el deudor no pueda guardar si los montos parciales no cuadran con el total general.

---

## 🧮 Fase 4: Integración del Motor Matemático y Roles (Sprint 3)
*La fase más crítica a nivel lógico: calcular exactamente quién le debe a quién, aplicando las reglas del negocio.*

### 4.1 Desarrollo Backend
- [ ] Crear la entidad `expense_splits` que almacenará el estado de cuenta individual.
- [ ] Modificar la lógica para soportar el campo `is_guest` (booleano) por participante en un gasto.
- [ ] **Implementar Algoritmo 1 (Equitativo):** Dividir el total entre los miembros activos ($Total / (Miembros - Invitados)$).
- [ ] **Implementar Algoritmo 2 (Porcentaje):** Validar que la suma de porcentajes ingresados sea estrictamente 100% y calcular la cuota respectiva en dinero.
- [ ] Desarrollar el endpoint de balance (`GET /api/groups/{id}/balances`).

### 4.2 Desarrollo Frontend
- [ ] Diseñar el componente selector de participantes dentro del gasto, permitiendo activar un interruptor (*switch*) para marcar a alguien como "Invitado".
- [ ] Desarrollar los controles de interfaz para elegir el método de división ("Equitativo" o "Porcentaje").
- [ ] Implementar la pantalla de "Resumen de Saldos" dentro del grupo para visualizar quién debe y cuánto debe cada uno de forma clara.

---

## 🔔 Fase 5: Cierre de Ciclo - Fechas de Pago y Alertas (Sprint 4)
*Orientada a la gestión del tiempo del cobro y a asegurar canales de comunicación con los deudores.*

### 5.1 Desarrollo Backend
- [ ] Habilitar el soporte del campo `due_date` (permitiendo valores nulos para fecha libre) y estados de pago (`pendiente`, `pagado`).
- [ ] Crear un servicio o endpoint para disparar recordatorios de cobro manuales vía notificaciones push.
- [ ] Implementar un proceso en segundo plano (*Cron Job*) para automatizar el envío de alertas de vencimiento 24 horas antes de la fecha límite.

### 5.2 Desarrollo Frontend
- [ ] Integrar un selector de fecha (*Date Picker*) en el formulario de gastos con la opción explícita de "Dejar fecha libre".
- [ ] Implementar el botón "Recordar Pago" en la vista de deudas para que el creador del gasto pueda notificar a sus amigos.
- [ ] Aplicar las reglas visuales de colores (ej: colores intensos/neón para diferenciar rápidamente cuentas vencidas de las pagadas).

---

## 🚀 Fase 6: Pruebas del Sistema, Refactor y Despliegue (Sprint 5)
*Garantizar la calidad y estabilidad de la plataforma antes del lanzamiento inicial.*

### 6.1 Aseguramiento de Calidad (QA)
- [ ] Ejecutar pruebas unitarias (*Unit Tests*) en el backend enfocadas en el motor matemático de porcentajes, exclusión de invitados y redondeos de dinero.
- [ ] Realizar pruebas de integración de extremo a extremo (*End-to-End*) simulando el flujo completo con múltiples usuarios interactuando en tiempo real.

### 6.2 Despliegue y Cierre
- [ ] Configurar el entorno de producción (Servidor de API, Base de Datos en la nube, Hosting del Frontend).
- [ ] Realizar el despliegue inicial (Lanzamiento del MVP).
- [ ] **Sprint Retrospective:** Evaluar el rendimiento del código base para asegurar que está en óptimas condiciones para recibir, en el próximo gran ciclo de desarrollo, el módulo de **Casas / Servicios Públicos**.