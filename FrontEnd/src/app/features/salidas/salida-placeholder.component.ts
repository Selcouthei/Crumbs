import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * SalidaPlaceholderComponent — Componente temporal para /salidas/:id
 *
 * Este componente es un placeholder que muestra el ID de la salida
 * mientras el compañero de equipo implementa el detalle completo.
 *
 * REEMPLAZAR con el componente real (SalidaDetailComponent) cuando esté listo.
 */
@Component({
  selector: 'app-salida-placeholder',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h2>Detalle de Salida</h2>
      <p style="color: #6b6b6b;">ID: {{ salidaId() }}</p>
      <p style="color: #999; font-size: 0.875rem;">
        Este módulo está siendo implementado por otro miembro del equipo.
      </p>
      <button mat-flat-button color="primary" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Volver al Dashboard
      </button>
    </div>
  `,
})
export class SalidaPlaceholderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  salidaId = signal('');

  ngOnInit(): void {
    this.salidaId.set(this.route.snapshot.paramMap.get('id') || '');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
