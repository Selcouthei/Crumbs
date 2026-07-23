import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../core/services/auth.service';
import { SalidasService } from '../../core/services/salidas.service';
import { SalidaWithBalance } from '../../core/interfaces/salidas.interfaces';
import { SalidaCardComponent } from './components/salida-card/salida-card.component';
import { CrearSalidaModalComponent } from './components/crear-salida-modal/crear-salida-modal.component';
import { UnirseSalidaModalComponent } from './components/unirse-salida-modal/unirse-salida-modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SalidaCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly salidasService = inject(SalidasService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  /** Nickname del usuario para el saludo */
  nickname = signal<string>('');

  /** Lista de salidas activas con balance */
  salidas = signal<SalidaWithBalance[]>([]);

  /** Estado de carga */
  isLoading = signal(true);

  ngOnInit(): void {
    // Obtener nickname del usuario actual
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.nickname.set(user.nickname);
      }
    });

    // Cargar salidas activas
    this.loadSalidas();
  }

  /**
   * Carga las salidas activas del usuario desde el backend/mock.
   */
  loadSalidas(): void {
    this.isLoading.set(true);
    this.salidasService.getMisSalidas().subscribe({
      next: (salidas) => {
        this.salidas.set(salidas);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Abre el modal para crear una nueva salida.
   * Al cerrar con resultado, navega al detalle de la salida creada.
   */
  openCrearSalida(): void {
    const dialogRef = this.dialog.open(CrearSalidaModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.salidaId) {
        this.router.navigate(['/salidas', result.salidaId]);
      }
    });
  }

  /**
   * Abre el modal para unirse a una salida con código.
   * Al cerrar con resultado, navega al detalle de la salida.
   */
  openUnirseSalida(): void {
    const dialogRef = this.dialog.open(UnirseSalidaModalComponent, {
      width: '400px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.salidaId) {
        this.router.navigate(['/salidas', result.salidaId]);
      }
    });
  }

  /**
   * Navega al detalle de una salida (click en tarjeta).
   */
  onSalidaClick(salidaId: string): void {
    this.router.navigate(['/salidas', salidaId]);
  }

  /**
   * Cierra sesión y redirige al login.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Navega al perfil del usuario.
   */
  goToPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Navega al dashboard (para el logo clickeable).
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
