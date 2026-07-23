import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent — Shell principal de Crumbs.
 *
 * Layout responsive:
 * - Desktop: contenido centrado con max-width 1200px
 * - Mobile: full-width sin restricciones
 *
 * NO forzar max-width 480px — eso rompe la vista web.
 * Cada feature maneja su propio layout responsive internamente.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
      .app-shell {
        min-height: 100vh;
        background: #fefbff;
      }
    `,
  ],
})
export class AppComponent {}
