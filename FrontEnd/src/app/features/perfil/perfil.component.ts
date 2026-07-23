import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** Usuario actual */
  user = signal<User | null>(null);

  /** Modo edición activo */
  isEditing = signal(false);

  /** Nombre completo calculado */
  fullName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.nombre} ${u.apellido}`;
  });

  /** Fecha de nacimiento formateada */
  fechaNacimientoFormatted = computed(() => {
    const u = this.user();
    if (!u?.fecha_nacimiento) return 'No especificada';
    return new Date(u.fecha_nacimiento).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  });

  /** Formulario de edición */
  editForm!: FormGroup;

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.user.set(user);
      if (user) {
        this.initForm(user);
      }
    });
  }

  /** Inicializa el formulario con los datos del usuario */
  private initForm(user: User): void {
    this.editForm = this.fb.group({
      nombre: [user.nombre, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: [user.apellido, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nickname: [user.nickname, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      fecha_nacimiento: [user.fecha_nacimiento ? new Date(user.fecha_nacimiento) : null],
    });
  }

  /** Activa el modo edición */
  enableEdit(): void {
    const user = this.user();
    if (user) {
      this.initForm(user);
    }
    this.isEditing.set(true);
  }

  /** Cancela la edición */
  cancelEdit(): void {
    this.isEditing.set(false);
  }

  /** Guarda los cambios del perfil */
  saveChanges(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    // TODO: Integrar con un endpoint PUT /api/users/me cuando exista el backend
    const formValue = this.editForm.value;
    const updatedUser: User = {
      ...this.user()!,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      nickname: formValue.nickname,
      fecha_nacimiento: formValue.fecha_nacimiento
        ? new Date(formValue.fecha_nacimiento).toISOString().split('T')[0]
        : null,
      updated_at: new Date().toISOString(),
    };

    this.user.set(updatedUser);
    this.isEditing.set(false);
  }

  /** Navega al perfil */
  goToPerfil(): void {
    // Ya estamos en perfil
  }

  /** Cierra sesión */
  logout(): void {
    this.authService.logout();
  }
}
