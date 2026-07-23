import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { Gasto } from '@core/models';

@Component({
  selector: 'app-gasto-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CurrencyFormatPipe,
  ],
  template: `
    <div
      class="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
    >
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ gasto.nombre }}</p>
        <p class="text-xs text-gray-500">
          {{ gasto.monto | currencyFormat }} · Pagó: {{ pagadorNombre }} ·
          {{ gasto.participantes.length }} participantes
        </p>
        <p class="text-xs text-gray-400">
          {{ gasto.fecha | date: 'dd/MM/yyyy HH:mm' }}
        </p>
      </div>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="!ml-2">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="editar.emit(gasto)">
          <mat-icon>edit</mat-icon>
          <span>Editar</span>
        </button>
        <button mat-menu-item (click)="eliminar.emit(gasto)">
          <mat-icon>delete</mat-icon>
          <span>Eliminar</span>
        </button>
      </mat-menu>
    </div>
  `,
})
export class GastoItemComponent {
  @Input({ required: true }) gasto!: Gasto;
  @Input() pagadorNombre = '';
  @Output() editar = new EventEmitter<Gasto>();
  @Output() eliminar = new EventEmitter<Gasto>();
}
