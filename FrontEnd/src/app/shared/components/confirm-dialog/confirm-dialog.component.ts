import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="!text-lg !font-semibold !text-gray-900">
      {{ data.titulo }}
    </h2>
    <mat-dialog-content>
      <p class="text-sm text-gray-600">{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="!gap-2 !pb-4 !pr-4">
      <button mat-stroked-button (click)="onCancelar()" class="!rounded-lg">
        {{ data.textoCancelar || 'Cancelar' }}
      </button>
      <button
        mat-flat-button
        (click)="onConfirmar()"
        class="!rounded-lg !bg-red-600 !text-white"
      >
        {{ data.textoConfirmar || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  onCancelar(): void {
    this.dialogRef.close(false);
  }

  onConfirmar(): void {
    this.dialogRef.close(true);
  }
}
