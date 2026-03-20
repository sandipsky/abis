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
                loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'units',
                loadComponent: () => import('./modules/master/units/units').then(m => m.Units),
                canActivate: [loginGuard]
            },
            {
                path: 'packings',
                loadComponent: () => import('./modules/master/packings/packings').then(m => m.Packings),
                canActivate: [loginGuard]
            },
            {
                path: 'tax-types',
                loadComponent: () => import('./modules/master/tax-types/tax-types').then(m => m.TaxTypes),
                canActivate: [loginGuard]
            },
            {
                path: 'product-category',
                loadComponent: () => import('./modules/master/product-category/product-category').then(m => m.ProductCategory),
                canActivate: [loginGuard]
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
