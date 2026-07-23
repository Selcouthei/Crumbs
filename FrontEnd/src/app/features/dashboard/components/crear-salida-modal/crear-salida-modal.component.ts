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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

import { SalidasService } from '../../../../core/services/salidas.service';
import { IntegranteInicial, SalidasError } from '../../../../core/interfaces/salidas.interfaces';

/**
 * CrearSalidaModalComponent — Modal para crear una nueva salida.
 *
 * Formulario con:
 * - Nombre (required, 2-100 chars)
 * - Descripción (optional)
 * - Fecha (MatDatepicker con calendario visual)
 * - Hora (MatSelect con opciones predefinidas cada 30 min)
 * - Lista dinámica de integrantes (nickname o nombre libre)
 *   mostrados como tarjetas con avatar y botón eliminar
 *
 * Al crear exitosamente, cierra el modal retornando { salidaId: string }
 * para que el DashboardComponent navegue al detalle.
 */
@Component({
  selector: 'app-crear-salida-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatListModule,
  ],
  templateUrl: './crear-salida-modal.component.html',
  styleUrl: './crear-salida-modal.component.scss',
})
export class CrearSalidaModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly salidasService = inject(SalidasService);
  private readonly dialogRef = inject(MatDialogRef<CrearSalidaModalComponent>);

  /** Estado de carga */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Lista de integrantes agregados */
  integrantes = signal<IntegranteInicial[]>([]);

  /** Input temporal para agregar integrante */
  nuevoIntegranteNombre = signal('');

  /** Controla la visibilidad del input de nuevo integrante */
  showIntegranteInput = false;

  /** Opciones de hora generadas (cada 30 min) */
  horasDisponibles: { value: string; label: string }[] = this.generarHoras();

  /** Formulario principal */
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    descripcion: [''],
    fecha: [null, Validators.required],
    hora: ['20:00', Validators.required],
  });

  /**
   * Genera opciones de hora cada 30 minutos (00:00 a 23:30).
   */
  private generarHoras(): { value: string; label: string }[] {
    const horas: { value: string; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const value = `${hour}:${min}`;
        // Formato 12h para display
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const label = `${displayHour}:${min} ${period}`;
        horas.push({ value, label });
      }
    }
    return horas;
  }

  /**
   * Agrega un integrante a la lista.
   * Si el nombre empieza con "@", se considera un usuario registrado (nickname).
   * Si no, se considera un integrante fantasma (nombre libre).
   */
  agregarIntegrante(inputValue: string): void {
    const nombre = inputValue.trim();
    if (!nombre) return;

    // Verificar si ya existe
    const yaExiste = this.integrantes().some(
      (i) => i.nombre.toLowerCase() === nombre.replace('@', '').toLowerCase()
    );
    if (yaExiste) return;

    const esRegistrado = nombre.startsWith('@');
    const nombreLimpio = esRegistrado ? nombre.substring(1) : nombre;

    if (nombreLimpio.length < 2) return;

    this.integrantes.update((list) => [
      ...list,
      { nombre: nombreLimpio, es_registrado: esRegistrado },
    ]);
    this.nuevoIntegranteNombre.set('');
  }

  /**
   * Elimina un integrante de la lista por índice.
   */
  eliminarIntegrante(index: number): void {
    this.integrantes.update((list) => list.filter((_, i) => i !== index));
  }

  /**
   * Envía el formulario para crear la salida.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { nombre, descripcion, fecha, hora } = this.form.value;

    // Combinar fecha y hora en ISO 8601
    const fechaDate = new Date(fecha);
    const [hours, minutes] = hora.split(':').map(Number);
    fechaDate.setHours(hours, minutes, 0, 0);

    this.salidasService.crearSalida({
      nombre,
      descripcion: descripcion || undefined,
      fecha_hora: fechaDate.toISOString(),
      integrantes: this.integrantes(),
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.dialogRef.close({ salidaId: response.salida.id });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const salidasError = error.error as SalidasError;
        this.serverError.set(
          salidasError?.message || 'Error al crear la salida. Intenta de nuevo.'
        );
      },
    });
  }

  /**
   * Cierra el modal sin crear nada.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
