import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/public',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'public',
    loadComponent: () => import('./components/public/public-view.component').then(m => m.PublicViewComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'cuyes',
        pathMatch: 'full'
      },
      {
        path: 'cuyes',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/admin/cuy-list.component').then(m => m.CuyListComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () => import('./components/admin/cuy-form.component').then(m => m.CuyFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/admin/cuy-detail.component').then(m => m.CuyDetailComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () => import('./components/admin/cuy-form.component').then(m => m.CuyFormComponent)
          }
        ]
      },
      {
        path: 'galpones',
        loadComponent: () => import('./components/admin/galpon-list.component').then(m => m.GalponListComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/admin/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/admin/user-management.component').then(m => m.UserManagementComponent)
      }
    ]
  }
];
