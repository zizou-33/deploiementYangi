import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { customerGuard } from './core/guards/customer-guard';
import { driverGuard } from './core/guards/driver-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: 'customer/dashboard',
    loadComponent: () =>
      import('./features/customer/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'customer/create-ride',
    loadComponent: () =>
      import('./features/customer/create-ride/create-ride').then((m) => m.CreateRideComponent),
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'customer/history',
    loadComponent: () =>
      import('./features/customer/history/history').then((m) => m.HistoryComponent),
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'customer/profile',
    loadComponent: () =>
      import('./features/customer/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'customer/become-driver',
    loadComponent: () =>
      import('./features/customer/become-driver/become-driver').then(
        (m) => m.BecomeDriverComponent,
      ),
    canActivate: [authGuard, customerGuard],
  },

  {
    path: 'driver/dashboard',
    loadComponent: () =>
      import('./features/driver/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard, driverGuard],
  },
  {
    path: 'driver/available-rides',
    loadComponent: () =>
      import('./features/driver/available-rides/available-rides').then(
        (m) => m.AvailableRidesComponent,
      ),
    canActivate: [authGuard, driverGuard],
  },
  {
    path: 'driver/history',
    loadComponent: () =>
      import('./features/driver/history/history').then((m) => m.HistoryComponent),
    canActivate: [authGuard, driverGuard],
  },
  {
    path: 'driver/profile',
    loadComponent: () =>
      import('./features/driver/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [authGuard, driverGuard],
  },

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./features/admin/users/users').then((m) => m.UsersComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/requests',
    loadComponent: () =>
      import('./features/admin/requests/requests').then((m) => m.RequestsComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/rides',
    loadComponent: () => import('./features/admin/rides/rides').then((m) => m.RidesComponent),
    canActivate: [authGuard, adminGuard],
  },

  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/list/list').then((m) => m.NotificationListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'notifications/:id',
    loadComponent: () =>
      import('./features/notifications/detail/detail').then((m) => m.NotificationDetailComponent),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'login' },
];
