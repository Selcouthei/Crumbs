import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SalidaService, GastoService } from '@core/services';
import { Salida, Gasto, Miembro } from '@core/models';
import { AuthService } from '@core/services/auth.service';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoDrawerComponent } from './components/gasto-drawer/gasto-drawer.component';
import { MiembrosDrawerComponent } from './components/miembros-drawer/miembros-drawer.component';

@Component({
  selector: 'app-salida-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    GastoListComponent,
    GastoDrawerComponent,
    MiembrosDrawerComponent,
  ],
  template: `
    <!-- Header consistente con dashboard -->
    <mat-toolbar class="dashboard-header">
      <span class="logo">Crumbs</span>
      <span class="spacer"></span>
      <button mat-button class="header-link" (click)="goToPerfil()">
        <mat-icon>person_outline</mat-icon>
        Perfil
      </button>
      <button mat-button class="header-link" (click)="logout()">
        <mat-icon>logout</mat-icon>
        Salir
      </button>
    </mat-toolbar>

    <!-- Main Content -->
    <main class="detail-content">
      @if (salida) {
        <!-- Header de la salida -->
        <header class="salida-header">
          <div class="salida-header-left">
            <button mat-icon-button (click)="goBack()" aria-label="Volver al dashboard">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="salida-title">Salida: {{ salida.nombre }}</h1>
          </div>
          <span class="salida-code">
            Código de invitación: <strong>#{{ salida.codigo }}</strong>
          </span>
        </header>

        <div class="detail-grid">
          <!-- Columna izquierda: Botones de acción -->
          <section class="acciones-section">
            <button
              mat-flat-button
              color="primary"
              class="action-button"
              (click)="onRegistrarGasto()"
            >
              <mat-icon>add_circle_outline</mat-icon>
              + Registrar Gastos
            </button>
            <button
              mat-flat-button
              color="primary"
              class="action-button"
              (click)="onAgregarMiembro()"
            >
              <mat-icon>group_add</mat-icon>
              + Agregar Miembro
            </button>
          </section>

          <!-- Columna derecha: Lista de gastos -->
          <section class="gastos-section">
            <app-gasto-list [gastos]="gastos" [miembros]="salida.miembros ?? []" />
          </section>
        </div>
      } @else {
        <div class="loading">
          <p>Cargando...</p>
        </div>
      }
    </main>

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
  styles: [`
    .dashboard-header {
      background-color: #6750a4;
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .spacer { flex: 1; }
    .header-link {
      color: white;
      font-size: 0.875rem;
      mat-icon {
        margin-right: 4px;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    .detail-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .salida-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .salida-header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .salida-title {
      font-size: 1.75rem;
      font-weight: 400;
      margin: 0;
      color: #1c1b1f;
    }
    .salida-code {
      font-size: 0.875rem;
      color: #6b6b6b;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    .acciones-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }
    .action-button {
      width: 100%;
      max-width: 400px;
      height: 56px;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 12px;
      mat-icon {
        margin-right: 8px;
      }
    }
    .gastos-section {
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 1.5rem;
      background: #fefefe;
      min-height: 200px;
    }
    .loading {
      text-align: center;
      padding: 4rem;
      color: #6b6b6b;
    }
    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .salida-title {
        font-size: 1.5rem;
      }
      .detail-content {
        padding: 1.5rem 1rem;
      }
    }
  `],
})
export class SalidaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private salidaService = inject(SalidaService);
  private gastoService = inject(GastoService);
  private authService = inject(AuthService);

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

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goToPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    this.authService.logout();
  }
}
