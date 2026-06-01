import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sync-status',
    loadComponent: () => import('./components/sync/sync-status').then(m => m.SyncStatusComponent),
    canActivate: [authGuard]
  },
  {
    path: 'courses',
    loadComponent: () => import('./components/courses/courses').then(m => m.CoursesComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'library',
    loadComponent: () => import('./components/library/library').then(m => m.LibraryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'help-center',
    loadComponent: () => import('./components/help-center/help-center').then(m => m.HelpCenterComponent)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
