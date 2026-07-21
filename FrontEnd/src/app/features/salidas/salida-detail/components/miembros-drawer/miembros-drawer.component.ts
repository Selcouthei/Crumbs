import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MiembroService } from '@core/services';
import { Miembro } from '@core/models';

@Component({
  selector: 'app-miembros-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <!-- Backdrop -->
    @if (isOpen) {
      <div
        class="fixed inset-0 z-40 bg-black/50 transition-opacity"
        (click)="onCancelar()"
      ></div>
    }

    <!-- Drawer panel -->
    <div
      class="drawer-panel fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="isOpen"
      [class.translate-x-full]="!isOpen"
    >
      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
        <h2 class="text-lg font-semibold text-gray-900">Agregar Integrantes</h2>
        <button mat-icon-button (click)="onCancelar()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="drawer-content px-4 py-4">
        <!-- Search by username -->
        <div class="mb-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>UserName</mat-label>
            <input
              matInput
              [(ngModel)]="searchUsername"
              placeholder="Buscar por username"
              (keydown.enter)="buscarPorUsername()"
            />
            <button matSuffix mat-icon-button (click)="buscarPorUsername()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- Search by email -->
        <div class="mb-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Correo electrónico</mat-label>
            <input
              matInput
              [(ngModel)]="searchEmail"
              placeholder="Buscar por email"
              (keydown.enter)="buscarPorEmail()"
            />
            <button matSuffix mat-icon-button (click)="buscarPorEmail()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- Search results -->
        @if (searching) {
          <div class="mb-4 flex justify-center">
            <mat-spinner diameter="24" />
          </div>
        }

        @if (searchResults.length > 0) {
          <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-gray-700">Resultados</p>
            @for (miembro of searchResults; track miembro.id) {
              <div
                class="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
                (click)="agregarASeleccionados(miembro)"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600"
                >
                  {{ miembro.nombre.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ miembro.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ miembro.username || miembro.email }}</p>
                </div>
                <mat-icon class="text-gray-400">add_circle_outline</mat-icon>
              </div>
            }
          </div>
        }

        <!-- No results + ghost creation -->
        @if (showNoResults) {
          <div class="mb-4 rounded-lg bg-gray-50 p-4">
            <p class="mb-3 text-sm text-gray-600">No se encontró usuario</p>

            @if (!showGhostInput) {
              <button
                mat-stroked-button
                class="!w-full !rounded-lg"
                (click)="showGhostInput = true"
              >
                <mat-icon>person_add</mat-icon>
                Crear integrante fantasma
              </button>
            }

            @if (showGhostInput) {
              <div class="space-y-2">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Nombre del fantasma</mat-label>
                  <input
                    matInput
                    [(ngModel)]="ghostName"
                    [maxlength]="12"
                    placeholder="Max 12 caracteres"
                  />
                  <mat-hint align="end">{{ ghostName.length }}/12</mat-hint>
                </mat-form-field>
                <button
                  mat-flat-button
                  class="!w-full !rounded-lg !bg-gray-900 !text-white"
                  [disabled]="!ghostName.trim()"
                  (click)="crearFantasma()"
                >
                  Crear fantasma
                </button>
              </div>
            }
          </div>
        }

        <!-- Miembros Frecuentes -->
        @if (miembrosFrecuentes.length > 0) {
          <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-gray-700">Miembros Frecuentes</p>
            @for (miembro of miembrosFrecuentes; track miembro.id) {
              <div
                class="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
                (click)="agregarASeleccionados(miembro)"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600"
                >
                  {{ miembro.nombre.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ miembro.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ miembro.username || 'Sin username' }}</p>
                </div>
                <mat-icon class="text-gray-400">add_circle_outline</mat-icon>
              </div>
            }
          </div>
        }

        <!-- Miembros Seleccionados -->
        @if (miembrosSeleccionados.length > 0) {
          <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-gray-700">Miembros Seleccionados</p>
            @for (miembro of miembrosSeleccionados; track miembro.id) {
              <div class="flex items-center gap-3 rounded-lg bg-green-50 p-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-sm font-medium text-green-700"
                >
                  {{ miembro.nombre.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ miembro.nombre }}
                    @if (miembro.is_guest) {
                      <span class="ml-1 text-xs text-orange-500">(invitado)</span>
                    }
                  </p>
                </div>
                <button mat-icon-button (click)="quitarSeleccionado(miembro)">
                  <mat-icon class="!text-red-400">remove_circle_outline</mat-icon>
                </button>
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="flex shrink-0 gap-3 border-t border-gray-200 px-4 py-4">
        <button
          mat-stroked-button
          class="!flex-1 !rounded-lg"
          (click)="onCancelar()"
        >
          Cancelar
        </button>
        <button
          mat-flat-button
          class="!flex-1 !rounded-lg !bg-gray-900 !text-white"
          [disabled]="miembrosSeleccionados.length === 0"
          (click)="onAgregar()"
        >
          Agregar
        </button>
      </div>
    </div>
  `,
})
export class MiembrosDrawerComponent implements OnChanges {
  private miembroService = inject(MiembroService);

  @Input() isOpen = false;
  @Input() miembrosExistentes: Miembro[] = [];

  @Output() cerrar = new EventEmitter<void>();
  @Output() agregarMiembros = new EventEmitter<Miembro[]>();

  searchUsername = '';
  searchEmail = '';
  searching = false;
  searchResults: Miembro[] = [];
  showNoResults = false;
  showGhostInput = false;
  ghostName = '';

  miembrosFrecuentes: Miembro[] = [];
  miembrosSeleccionados: Miembro[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetState();
      this.loadFrecuentes();
    }
  }

  private resetState(): void {
    this.searchUsername = '';
    this.searchEmail = '';
    this.searchResults = [];
    this.showNoResults = false;
    this.showGhostInput = false;
    this.ghostName = '';
    this.miembrosSeleccionados = [];
  }

  private loadFrecuentes(): void {
    this.miembroService.getMiembrosFrecuentes('current-user').subscribe({
      next: (frecuentes) => {
        // Filter out members already in salida or already selected
        this.miembrosFrecuentes = frecuentes.filter(
          (f) => !this.isAlreadyInSalida(f.id) && !this.isAlreadySelected(f.id)
        );
      },
    });
  }

  buscarPorUsername(): void {
    if (!this.searchUsername.trim()) return;
    this.searching = true;
    this.showNoResults = false;
    this.showGhostInput = false;

    this.miembroService.buscarPorUsername(this.searchUsername.trim()).subscribe({
      next: (results) => {
        this.searchResults = results.filter(
          (r) => !this.isAlreadyInSalida(r.id) && !this.isAlreadySelected(r.id)
        );
        this.showNoResults = this.searchResults.length === 0;
        this.searching = false;
      },
      error: () => {
        this.searching = false;
        this.showNoResults = true;
      },
    });
  }

  buscarPorEmail(): void {
    if (!this.searchEmail.trim()) return;
    this.searching = true;
    this.showNoResults = false;
    this.showGhostInput = false;

    this.miembroService.buscarPorEmail(this.searchEmail.trim()).subscribe({
      next: (results) => {
        this.searchResults = results.filter(
          (r) => !this.isAlreadyInSalida(r.id) && !this.isAlreadySelected(r.id)
        );
        this.showNoResults = this.searchResults.length === 0;
        this.searching = false;
      },
      error: () => {
        this.searching = false;
        this.showNoResults = true;
      },
    });
  }

  agregarASeleccionados(miembro: Miembro): void {
    if (this.isAlreadySelected(miembro.id)) return;
    this.miembrosSeleccionados = [...this.miembrosSeleccionados, miembro];
    this.searchResults = this.searchResults.filter((r) => r.id !== miembro.id);
    this.miembrosFrecuentes = this.miembrosFrecuentes.filter((f) => f.id !== miembro.id);
    this.showNoResults = false;
  }

  quitarSeleccionado(miembro: Miembro): void {
    this.miembrosSeleccionados = this.miembrosSeleccionados.filter(
      (m) => m.id !== miembro.id
    );
    // Re-add to frecuentes if applicable (reload on next open)
  }

  crearFantasma(): void {
    if (!this.ghostName.trim()) return;

    this.miembroService.crearFantasma(this.ghostName.trim()).subscribe({
      next: (fantasma) => {
        this.miembrosSeleccionados = [...this.miembrosSeleccionados, fantasma];
        this.ghostName = '';
        this.showGhostInput = false;
        this.showNoResults = false;
      },
    });
  }

  onCancelar(): void {
    this.cerrar.emit();
  }

  onAgregar(): void {
    if (this.miembrosSeleccionados.length === 0) return;
    this.agregarMiembros.emit([...this.miembrosSeleccionados]);
    this.cerrar.emit();
  }

  private isAlreadyInSalida(miembroId: string): boolean {
    return this.miembrosExistentes.some((m) => m.id === miembroId);
  }

  private isAlreadySelected(miembroId: string): boolean {
    return this.miembrosSeleccionados.some((m) => m.id === miembroId);
  }
}
