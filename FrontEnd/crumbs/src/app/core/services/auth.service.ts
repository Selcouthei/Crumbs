import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

import { User } from '../models/user.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/auth.interfaces';
import { environment } from '../../../environments/environment';

/**
 * AuthService — Servicio principal de autenticación de Crumbs
 *
 * Responsabilidades:
 * - Login y registro de usuarios
 * - Manejo del token JWT (guardar, leer, eliminar de localStorage)
 * - Estado reactivo del usuario actual (currentUser$)
 * - Navegación post-autenticación
 *
 * CLAVE DE LOCALSTORAGE: `crumbs_token`
 *
 * ENDPOINTS CONSUMIDOS:
 * - POST {apiUrl}/auth/login   → LoginRequest → LoginResponse
 * - POST {apiUrl}/auth/register → RegisterRequest → RegisterResponse
 *
 * PARA CONECTAR AL BACKEND REAL:
 * - Este servicio ya hace llamadas HTTP reales.
 * - Solo necesitas configurar `environment.apiUrl` con la URL de tu backend.
 * - El mock interceptor simula las respuestas mientras `environment.useMocks = true`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'crumbs_token';
  private readonly API_URL = environment.apiUrl;

  /** Subject interno del usuario actual */
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Observable del usuario autenticado. Null si no hay sesión activa. */
  readonly currentUser$ = this.currentUserSubject.asObservable();

  /** Observable booleano que indica si hay un usuario autenticado. */
  readonly isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  constructor() {
    this.rehydrateSession();
  }

  /**
   * Inicia sesión con email/nickname y contraseña.
   *
   * Al recibir respuesta exitosa:
   * 1. Guarda el token JWT en localStorage
   * 2. Actualiza el estado del usuario actual
   *
   * @param request - Credenciales del usuario (identifier + password)
   * @returns Observable con el token y datos del usuario
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  /**
   * Registra un nuevo usuario.
   *
   * Al recibir respuesta exitosa:
   * 1. Guarda el token JWT en localStorage (queda logueado automáticamente)
   * 2. Actualiza el estado del usuario actual
   *
   * @param request - Datos del nuevo usuario
   * @returns Observable con el token y datos del usuario creado
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, request).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  /**
   * Cierra la sesión del usuario.
   *
   * 1. Elimina el token de localStorage
   * 2. Limpia el estado del usuario
   * 3. Redirige a /auth/login
   */
  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Obtiene el token JWT almacenado.
   * @returns Token string o null si no hay sesión
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si hay un usuario con sesión activa.
   * @returns true si hay token en localStorage
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Guarda el token JWT en localStorage.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Elimina el token JWT de localStorage.
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Rehidrata la sesión al inicializar el servicio.
   * Si hay un token guardado, intenta restaurar el estado del usuario.
   *
   * NOTA: En producción, aquí se podría hacer una petición al backend
   * para validar el token y obtener los datos frescos del usuario.
   * Por ahora, decodificamos el payload del JWT (si es válido).
   */
  private rehydrateSession(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.decodeTokenPayload(token);
        if (payload?.user) {
          this.currentUserSubject.next(payload.user);
        }
      } catch {
        // Token inválido o corrupto — limpiar sesión
        this.removeToken();
      }
    }
  }

  /**
   * Decodifica el payload de un JWT (sin verificar firma).
   * En producción, la verificación de firma la hace el backend.
   */
  private decodeTokenPayload(token: string): { user: User } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  }
}
