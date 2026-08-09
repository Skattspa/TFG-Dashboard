import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DetailsComponent } from './features/details/details.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default route
  { path: 'details', component: DetailsComponent },
  { path: '**', redirectTo: '' } // If error
];