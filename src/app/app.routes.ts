import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { masterRoutes } from './modules/master/master.routes';
import { settingsRoutes } from './modules/settings/settings.routes';

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
                loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'products',
                loadComponent: () => import('./modules/products/products').then(m => m.Products),
            },
           ...masterRoutes,
           ...settingsRoutes,
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login),
        canActivate: [loginGuard]
    },
    { path: '**', redirectTo: 'dashboard' },
];
