import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { Dashboard } from './modules/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard,
            },
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login),
        canActivate: [loginGuard]
    },
    { path: '**', redirectTo: 'dashboard' },
];
