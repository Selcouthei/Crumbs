import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'salidas/:id',
    loadComponent: () =>
      import('@features/salidas/salida-detail/salida-detail.component').then(
        (m) => m.SalidaDetailComponent
      ),
  },
  {
    path: '',
    redirectTo: 'salidas/1',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'salidas/1',
  },
];
