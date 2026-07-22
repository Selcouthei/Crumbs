/**
 * Configuración de entorno — Desarrollo
 *
 * useMocks: true — Activa el mock interceptor que simula respuestas del backend.
 * apiUrl: '/api' — URL base para las peticiones HTTP (interceptada por el mock en dev).
 *
 * PARA CONECTAR AL BACKEND REAL:
 * 1. Cambiar `useMocks` a `false`
 * 2. Cambiar `apiUrl` a la URL de tu backend local (ej: 'http://localhost:8000/api')
 */
export const environment = {
  production: false,
  useMocks: true,
  apiUrl: '/api',
};
