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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { GastoService } from '@core/services';
import { Gasto, MetodoDivision, Miembro, Participante } from '@core/models';

interface MiembroCheck {
  miembro: Miembro;
  checked: boolean;
  montoControl: FormControl<number | null>;
}

@Component({
  selector: 'app-gasto-drawer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    OnlyNumbersDirective,
    CurrencyFormatPipe,
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
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ gastoToEdit ? 'Editar Gasto' : 'Agregar Gasto' }}
        </h2>
        <button mat-icon-button (click)="onCancelar()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="drawer-content flex-1 overflow-y-auto px-4 py-4">
        <form [formGroup]="gastoForm" class="drawer-form flex flex-col gap-1">
          <!-- Nombre -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" placeholder="Ej: Pizza" />
            @if (gastoForm.get('nombre')?.hasError('required') && gastoForm.get('nombre')?.touched) {
              <mat-error>El nombre es obligatorio</mat-error>
            }
          </mat-form-field>

          <!-- Descripción -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Descripción</mat-label>
            <textarea
              matInput
              formControlName="descripcion"
              placeholder="Detalles del gasto..."
              rows="2"
            ></textarea>
          </mat-form-field>

          <!-- Monto -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Monto</mat-label>
            <span matPrefix class="pl-2 text-gray-500">$&nbsp;</span>
            <input
              matInput
              formControlName="monto"
              appOnlyNumbers
              placeholder="0"
            />
            @if (gastoForm.get('monto')?.hasError('required') && gastoForm.get('monto')?.touched) {
              <mat-error>El monto es obligatorio</mat-error>
            }
            @if (gastoForm.get('monto')?.hasError('min') && gastoForm.get('monto')?.touched) {
              <mat-error>El monto debe ser mayor a 0</mat-error>
            }
            @if (gastoForm.get('monto')?.hasError('max') && gastoForm.get('monto')?.touched) {
              <mat-error>El monto máximo es 9,999,999</mat-error>
            }
          </mat-form-field>

          <!-- Fecha -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Fecha / Hora</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="fecha" />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
          </mat-form-field>

          <!-- Divider -->
          <hr class="my-3 border-gray-200" />

          <!-- División toggle -->
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Método de división</span>
            <mat-slide-toggle
              [checked]="equitativo"
              (change)="onToggleDivision($event.checked)"
              color="primary"
            >
              {{ equitativo ? 'Equitativo' : 'Manual' }}
            </mat-slide-toggle>
          </div>

          <!-- Quién pagó -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>¿Quién pagó?</mat-label>
            <mat-select formControlName="pagadorId">
              @for (m of miembros; track m.id) {
                <mat-option [value]="m.id">
                  {{ m.nombre }}
                  @if (m.is_guest) {
                    <span class="text-xs text-orange-500">(invitado)</span>
                  }
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Miembros participantes -->
          <div class="mt-2 space-y-2">
            <p class="text-sm font-medium text-gray-700">Participantes</p>

            @for (mc of miembrosCheck; track mc.miembro.id) {
              <div class="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-gray-50">
                <mat-checkbox
                  [checked]="mc.checked"
                  (change)="onToggleMiembro(mc, $event.checked)"
                  color="primary"
                >
                  {{ mc.miembro.nombre }}
                  @if (mc.miembro.is_guest) {
                    <span class="text-xs text-orange-500">(invitado)</span>
                  }
                </mat-checkbox>

                @if (!equitativo && mc.checked) {
                  <div class="ml-auto flex items-center gap-1">
                    <span class="text-xs text-gray-500">$</span>
                    <input
                      type="text"
                      appOnlyNumbers
                      class="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      [value]="mc.montoControl.value ?? ''"
                      (input)="onMontoParticipanteChange(mc, $event)"
                    />
                  </div>
                }
              </div>
            }
          </div>

          <!-- Manual mode: sum vs total -->
          @if (!equitativo) {
            <div class="mt-3 rounded-lg bg-gray-50 p-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Suma asignada:</span>
                <span
                  [class.text-red-500]="sumaManual !== montoTotal"
                  [class.text-green-600]="sumaManual === montoTotal"
                  class="font-medium"
                >
                  {{ sumaManual | currencyFormat }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total del gasto:</span>
                <span class="font-medium text-gray-900">{{ montoTotal | currencyFormat }}</span>
              </div>
              @if (sumaManual !== montoTotal && miembrosCheckedCount > 0) {
                <p class="mt-1 text-xs text-red-500">
                  La suma de los montos debe ser igual al total del gasto
                </p>
              }
            </div>
          }
        </form>
      </div>

      <!-- Footer -->
      <div class="flex shrink-0 gap-3 border-t border-gray-200 px-4 py-3">
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
          [disabled]="!isFormValid()"
          (click)="onGuardar()"
        >
          {{ gastoToEdit ? 'Guardar cambios' : 'Agregar' }}
        </button>
      </div>
    </div>
  `,
})
export class GastoDrawerComponent implements OnChanges {
  private gastoService = inject(GastoService);

  @Input() isOpen = false;
  @Input() miembros: Miembro[] = [];
  @Input() gastoToEdit: Gasto | null = null;
  @Input() salidaId = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<void>();

  equitativo = true;
  miembrosCheck: MiembroCheck[] = [];

  gastoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true }),
    monto: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(9999999),
    ]),
    fecha: new FormControl<Date>(new Date(), { nonNullable: true }),
    pagadorId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get montoTotal(): number {
    return this.gastoForm.get('monto')?.value ?? 0;
  }

  get sumaManual(): number {
    return this.miembrosCheck
      .filter((mc) => mc.checked)
      .reduce((sum, mc) => sum + (mc.montoControl.value ?? 0), 0);
  }

  get miembrosCheckedCount(): number {
    return this.miembrosCheck.filter((mc) => mc.checked).length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['miembros']) {
      this.buildMiembrosCheck();
    }

    if (changes['isOpen'] && this.isOpen) {
      if (this.gastoToEdit) {
        this.prefillForm(this.gastoToEdit);
      } else {
        this.resetForm();
      }
    }

    if (changes['gastoToEdit'] && this.gastoToEdit && this.isOpen) {
      this.prefillForm(this.gastoToEdit);
    }
  }

  private buildMiembrosCheck(): void {
    this.miembrosCheck = this.miembros.map((m) => ({
      miembro: m,
      checked: true,
      montoControl: new FormControl<number | null>(null),
    }));
  }

  private resetForm(): void {
    this.gastoForm.reset({
      nombre: '',
      descripcion: '',
      monto: null,
      fecha: new Date(),
      pagadorId: this.miembros.length > 0 ? this.miembros[0].id : '',
    });
    this.equitativo = true;
    this.miembrosCheck.forEach((mc) => {
      mc.checked = true;
      mc.montoControl.setValue(null);
    });
  }

  private prefillForm(gasto: Gasto): void {
    this.gastoForm.patchValue({
      nombre: gasto.nombre,
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      fecha: new Date(gasto.fecha),
      pagadorId: gasto.pagador_id,
    });
    this.equitativo = gasto.metodo_division === 'equitativo';

    this.miembrosCheck.forEach((mc) => {
      const participante = gasto.participantes.find(
        (p) => p.miembro_id === mc.miembro.id
      );
      mc.checked = !!participante;
      mc.montoControl.setValue(participante?.monto_asignado ?? null);
    });
  }

  onToggleDivision(checked: boolean): void {
    this.equitativo = checked;
    if (checked) {
      this.miembrosCheck.forEach((mc) => mc.montoControl.setValue(null));
    }
  }

  onToggleMiembro(mc: MiembroCheck, checked: boolean): void {
    mc.checked = checked;
    if (!checked) {
      mc.montoControl.setValue(null);
    }
  }

  onMontoParticipanteChange(mc: MiembroCheck, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    mc.montoControl.setValue(isNaN(value) ? null : value);
  }

  isFormValid(): boolean {
    if (this.gastoForm.invalid) return false;
    if (this.miembrosCheckedCount === 0) return false;
    if (!this.equitativo && this.sumaManual !== this.montoTotal) return false;
    return true;
  }

  onCancelar(): void {
    this.cerrar.emit();
  }

  onGuardar(): void {
    if (!this.isFormValid()) return;

    const formValue = this.gastoForm.getRawValue();
    const monto = formValue.monto!;
    const pagadorId = formValue.pagadorId;
    const metodoDivision: MetodoDivision = this.equitativo ? 'equitativo' : 'manual';

    const participantes = this.calcularParticipantes(monto, pagadorId);

    if (this.gastoToEdit) {
      // Edit mode
      const gastoEditado: Gasto = {
        ...this.gastoToEdit,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        monto,
        fecha: formValue.fecha,
        pagador_id: pagadorId,
        metodo_division: metodoDivision,
        participantes,
      };

      this.gastoService.editarGasto(gastoEditado).subscribe({
        next: () => {
          this.guardar.emit();
          this.cerrar.emit();
        },
      });
    } else {
      // Create mode
      const nuevoGasto: Omit<Gasto, 'id'> = {
        salida_id: this.salidaId,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        monto,
        fecha: formValue.fecha,
        pagador_id: pagadorId,
        metodo_division: metodoDivision,
        participantes,
      };

      this.gastoService.crearGasto(nuevoGasto).subscribe({
        next: () => {
          this.guardar.emit();
          this.cerrar.emit();
        },
      });
    }
  }

  private calcularParticipantes(monto: number, pagadorId: string): Participante[] {
    const checkedMiembros = this.miembrosCheck.filter((mc) => mc.checked);

    if (this.equitativo) {
      // Equitativo: Math.floor(monto/n), remainder to pagador
      // Guest members have their share redistributed to non-guests
      const nonGuestChecked = checkedMiembros.filter((mc) => !mc.miembro.is_guest);
      const guestChecked = checkedMiembros.filter((mc) => mc.miembro.is_guest);

      if (nonGuestChecked.length === 0) {
        // Edge case: all are guests - just divide equally
        const perPerson = Math.floor(monto / checkedMiembros.length);
        const remainder = monto - perPerson * checkedMiembros.length;

        return checkedMiembros.map((mc, index) => ({
          miembro_id: mc.miembro.id,
          monto_asignado: perPerson + (mc.miembro.id === pagadorId || (index === 0 && !checkedMiembros.find(c => c.miembro.id === pagadorId)) ? 0 : 0) ,
        })).map((p, i) => ({
          ...p,
          monto_asignado: p.monto_asignado + (i === 0 ? remainder : 0),
        }));
      }

      // Calculate guest share and redistribute
      const totalParticipants = checkedMiembros.length;
      const perPerson = Math.floor(monto / totalParticipants);
      const guestTotalShare = perPerson * guestChecked.length;
      const baseForNonGuests = monto - guestTotalShare;

      // Divide among non-guests
      const perNonGuest = Math.floor(baseForNonGuests / nonGuestChecked.length);
      const remainder = baseForNonGuests - perNonGuest * nonGuestChecked.length;

      const participantes: Participante[] = [];

      // Guests get 0
      guestChecked.forEach((mc) => {
        participantes.push({
          miembro_id: mc.miembro.id,
          monto_asignado: 0,
        });
      });

      // Non-guests share the total, with remainder going to pagador
      const pagadorIsNonGuest = nonGuestChecked.find((mc) => mc.miembro.id === pagadorId);

      nonGuestChecked.forEach((mc) => {
        const isTargetForRemainder = pagadorIsNonGuest
          ? mc.miembro.id === pagadorId
          : mc === nonGuestChecked[0];

        participantes.push({
          miembro_id: mc.miembro.id,
          monto_asignado: perNonGuest + (isTargetForRemainder ? remainder : 0),
        });
      });

      return participantes;
    } else {
      // Manual mode: use user-defined values
      // Guest members have their share redistributed
      const guestChecked = checkedMiembros.filter((mc) => mc.miembro.is_guest);
      const nonGuestChecked = checkedMiembros.filter((mc) => !mc.miembro.is_guest);

      if (guestChecked.length === 0 || nonGuestChecked.length === 0) {
        // No guests or no non-guests: use as-is
        return checkedMiembros.map((mc) => ({
          miembro_id: mc.miembro.id,
          monto_asignado: mc.montoControl.value ?? 0,
        }));
      }

      // Redistribute guest amounts to non-guests
      const guestTotal = guestChecked.reduce(
        (sum, mc) => sum + (mc.montoControl.value ?? 0),
        0
      );
      const extraPerNonGuest = Math.floor(guestTotal / nonGuestChecked.length);
      const extraRemainder = guestTotal - extraPerNonGuest * nonGuestChecked.length;

      const pagadorIsNonGuest = nonGuestChecked.find((mc) => mc.miembro.id === pagadorId);
      const participantes: Participante[] = [];

      guestChecked.forEach((mc) => {
        participantes.push({
          miembro_id: mc.miembro.id,
          monto_asignado: 0,
        });
      });

      nonGuestChecked.forEach((mc) => {
        const isTargetForRemainder = pagadorIsNonGuest
          ? mc.miembro.id === pagadorId
          : mc === nonGuestChecked[0];

        participantes.push({
          miembro_id: mc.miembro.id,
          monto_asignado:
            (mc.montoControl.value ?? 0) +
            extraPerNonGuest +
            (isTargetForRemainder ? extraRemainder : 0),
        });
      });

      return participantes;
    }
  }
}
