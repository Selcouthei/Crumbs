import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SalidaService, GastoService } from '@core/services';
import { Salida, Gasto, Miembro } from '@core/models';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoDrawerComponent } from './components/gasto-drawer/gasto-drawer.component';
import { MiembrosDrawerComponent } from './components/miembros-drawer/miembros-drawer.component';

@Component({
  selector: 'app-salida-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    GastoListComponent,
    GastoDrawerComponent,
    MiembrosDrawerComponent,
  ],
  template: `
    <div class="flex min-h-screen flex-col p-4">
      @if (salida) {
        <!-- Header -->
        <header class="mb-6">
          <div class="flex items-start justify-between">
            <h1 class="text-2xl font-light text-gray-900">
              Salida: {{ salida.titulo }}
            </h1>
            <span class="whitespace-nowrap text-sm text-gray-500">
              Código de invitación:
              <span class="font-medium text-gray-700">#{{ salida.codigo }}</span>
            </span>
          </div>
        </header>

        <!-- Gastos list -->
        <section class="mb-6 flex-1">
          <app-gasto-list [gastos]="gastos" [miembros]="salida.miembros" />
        </section>

        <!-- Action buttons -->
        <footer class="mt-auto space-y-3 pt-6">
          <button
            mat-flat-button
            class="!w-full !rounded-lg !bg-gray-900 !py-3 !text-white"
            (click)="onRegistrarGasto()"
          >
            + Registrar Gastos
          </button>
          <button
            mat-flat-button
            class="!w-full !rounded-lg !bg-gray-800 !py-3 !text-white"
            (click)="onAgregarMiembro()"
          >
            + Agregar Miembro
          </button>
        </footer>
      } @else {
        <p>Cargando...</p>
      }
    </div>

    <!-- Gasto Drawer -->
    <app-gasto-drawer
      [isOpen]="gastoDrawerOpen"
      [miembros]="salida?.miembros ?? []"
      [gastoToEdit]="gastoToEdit"
      [salidaId]="salidaId"
      (cerrar)="gastoDrawerOpen = false; gastoToEdit = null"
      (guardar)="onGastoGuardado()"
    />

    <!-- Miembros Drawer -->
    <app-miembros-drawer
      [isOpen]="miembrosDrawerOpen"
      [miembrosExistentes]="salida?.miembros ?? []"
      (cerrar)="miembrosDrawerOpen = false"
      (agregarMiembros)="onMiembrosAgregados($event)"
    />
  `,
})
export class SalidaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private salidaService = inject(SalidaService);
  private gastoService = inject(GastoService);

  salida: Salida | null = null;
  gastos: Gasto[] = [];
  gastoDrawerOpen = false;
  gastoToEdit: Gasto | null = null;
  miembrosDrawerOpen = false;
  salidaId = '1';

  ngOnInit(): void {
    this.salidaId = this.route.snapshot.paramMap.get('id') ?? '1';
    this.loadSalida();
    this.loadGastos();
  }

  private loadSalida(): void {
    this.salidaService.getSalidaById(this.salidaId).subscribe((salida) => {
      this.salida = salida;
    });
  }

  private loadGastos(): void {
    this.gastoService.getGastosBySalida(this.salidaId).subscribe((gastos) => {
      this.gastos = gastos;
    });
  }

  onRegistrarGasto(): void {
    this.gastoToEdit = null;
    this.gastoDrawerOpen = true;
  }

  onAgregarMiembro(): void {
    this.miembrosDrawerOpen = true;
  }

  onMiembrosAgregados(miembros: Miembro[]): void {
    miembros.forEach((miembro) => {
      this.salidaService.agregarMiembroASalida(this.salidaId, miembro).subscribe({
        next: (salidaActualizada) => {
          this.salida = salidaActualizada;
        },
      });
    });
    this.miembrosDrawerOpen = false;
  }

  onGastoGuardado(): void {
    this.loadGastos();
  }
}
