import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SalidaWithBalance } from '../../../../core/interfaces/salidas.interfaces';

/**
 * SalidaCardComponent — Tarjeta individual para una salida activa.
 *
 * Muestra:
 * - Nombre de la salida
 * - Número de integrantes
 * - Balance personal (cuánto debes o te deben)
 *
 * Emite un evento al hacer click para navegar al detalle.
 */
@Component({
  selector: 'app-salida-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './salida-card.component.html',
  styleUrl: './salida-card.component.scss',
})
export class SalidaCardComponent {
  /** Datos de la salida con balance */
  salidaWithBalance = input.required<SalidaWithBalance>();

  /** Evento emitido al hacer click en la tarjeta (emite el salida.id) */
  cardClick = output<string>();

  /**
   * Texto del balance formateado:
   * - Positivo: "Te deben $X"
   * - Negativo: "Debes $X"
   * - Cero: "A mano"
   */
  get balanceText(): string {
    const balance = this.salidaWithBalance().balance;
    if (balance > 0) {
      return `Te deben $${this.formatNumber(balance)}`;
    } else if (balance < 0) {
      return `Debes $${this.formatNumber(Math.abs(balance))}`;
    }
    return 'A mano';
  }

  /**
   * Clase CSS según el estado del balance (para colores).
   */
  get balanceClass(): string {
    const balance = this.salidaWithBalance().balance;
    if (balance > 0) return 'balance-positive';
    if (balance < 0) return 'balance-negative';
    return 'balance-neutral';
  }

  /**
   * Maneja el click en la tarjeta.
   */
  onClick(): void {
    this.cardClick.emit(this.salidaWithBalance().salida.id);
  }

  /**
   * Formatea un número con separador de miles (sin decimales).
   */
  private formatNumber(value: number): string {
    return value.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }
}
