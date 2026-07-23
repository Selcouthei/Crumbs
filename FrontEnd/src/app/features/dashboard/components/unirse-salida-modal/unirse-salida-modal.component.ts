import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SalidasService } from '../../../../core/services/salidas.service';
import { SalidasError } from '../../../../core/interfaces/salidas.interfaces';

/**
 * UnirseSalidaModalComponent — Modal para unirse a una salida con código.
 *
 * Formulario simple con un input de 6 caracteres alfanuméricos.
 * Al unirse exitosamente, cierra el modal retornando { salidaId: string }
 * para que el DashboardComponent navegue al detalle.
 */
@Component({
  selector: 'app-unirse-salida-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './unirse-salida-modal.component.html',
  styleUrl: './unirse-salida-modal.component.scss',
})
export class UnirseSalidaModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly salidasService = inject(SalidasService);
  private readonly dialogRef = inject(MatDialogRef<UnirseSalidaModalComponent>);

  /** Estado de carga */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Formulario con campo código */
  form: FormGroup = this.fb.group({
    codigo: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^[A-Za-z0-9]{6}$/),
    ]],
  });

  /**
   * Envía el código para unirse a la salida.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { codigo } = this.form.value;

    this.salidasService.unirseSalida({ codigo: codigo.toUpperCase() }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.dialogRef.close({ salidaId: response.salida.id });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const salidasError = error.error as SalidasError;
        this.serverError.set(
          salidasError?.message || 'Error al unirse a la salida. Intenta de nuevo.'
        );
      },
    });
  }

  /**
   * Cierra el modal sin hacer nada.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
