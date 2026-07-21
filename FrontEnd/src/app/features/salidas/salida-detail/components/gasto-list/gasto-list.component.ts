import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gasto, Miembro } from '@core/models';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <div class="rounded-xl border border-gray-200 bg-white">
      <div class="border-b border-gray-200 px-4 py-3">
        <h2 class="text-base font-semibold text-gray-900">Gastos</h2>
      </div>

      @if (gastos.length === 0) {
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-gray-400">No hay gastos registrados</p>
        </div>
      }

      @for (gasto of gastos; track gasto.id) {
        <div class="border-b border-gray-100 px-4 py-3 last:border-b-0">
          <p class="text-sm font-medium text-gray-900">{{ gasto.nombre }}</p>
          <p class="text-xs text-gray-500">
            {{ gasto.monto | currencyFormat }} · Pagó: {{ getPagadorNombre(gasto.pagador_id) }} ·
            {{ gasto.participantes.length }} participantes
          </p>
          <p class="text-xs text-gray-400">
            {{ gasto.fecha | date: 'dd/MM/yyyy HH:mm' }}
          </p>
        </div>
      }
    </div>
  `,
})
export class GastoListComponent {
  @Input() gastos: Gasto[] = [];
  @Input() miembros: Miembro[] = [];

  getPagadorNombre(pagadorId: string): string {
    const miembro = this.miembros.find((m) => m.id === pagadorId);
    return miembro?.nombre ?? 'Desconocido';
  }
}
