import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'details/:metric',
    loadComponent: () =>
      import('./features/details/details.component').then((m) => m.DetailsComponent),
  },
  {
    path: 'details',
    redirectTo: 'details/temperatura',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
