import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { AuthError } from '../../../core/interfaces/auth.interfaces';

/**
 * Validador personalizado: verifica que los campos password y confirmPassword coincidan.
 */
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Estado de carga durante la petición */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Toggle para mostrar/ocultar contraseña */
  hidePassword = signal(true);

  /** Toggle para mostrar/ocultar confirmar contraseña */
  hideConfirmPassword = signal(true);

  /** Formulario reactivo de registro */
  registerForm: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nickname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^\S+$/), // Sin espacios
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordsMatchValidator,
    }
  );

  /**
   * Envía los datos de registro al AuthService.
   * En caso de éxito → navega al home (queda logueado automáticamente).
   * En caso de error → muestra mensaje de error (duplicado de nickname/email u otro).
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { nombre, apellido, nickname, email, password } = this.registerForm.value;

    this.authService.register({ nombre, apellido, nickname, email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const authError = error.error as AuthError;

        // Si el error es de campo específico, marcar ese campo como inválido
        if (authError?.field) {
          const control = this.registerForm.get(authError.field);
          if (control) {
            control.setErrors({ serverError: authError.message });
          }
        }

        this.serverError.set(
          authError?.message || 'Error al registrarse. Intenta de nuevo.'
        );
      },
    });
  }

  /** Toggle visibilidad de la contraseña */
  togglePasswordVisibility(): void {
    this.hidePassword.update((hide) => !hide);
  }

  /** Toggle visibilidad de confirmar contraseña */
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((hide) => !hide);
  }

  /** Verifica si las contraseñas no coinciden (para mostrar error) */
  get passwordsMismatch(): boolean {
    return (
      this.registerForm.hasError('passwordsMismatch') &&
      this.registerForm.get('confirmPassword')!.touched
    );
  }
}
