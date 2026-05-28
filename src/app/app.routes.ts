import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'GreenBin — Dashboard'
  },
  {
    path: 'dispositivos',
    loadComponent: () =>
      import('./features/dispositivos/dispositivos.component').then(m => m.DispositivosComponent),
    title: 'GreenBin — Dispositivos'
  },
  {
    path: 'clasificador',
    loadComponent: () =>
      import('./features/clasificador/clasificador.component').then(m => m.ClasificadorComponent),
    title: 'GreenBin — Clasificador'
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./features/info/info.component').then(m => m.InfoComponent),
    title: 'GreenBin — Información'
  },
  { path: '**', redirectTo: 'dashboard' }
];
