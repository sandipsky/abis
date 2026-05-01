import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';

export const salesRoutes: Routes = [
    {
        path: 'sales-order',
        loadComponent: () => import('./sales-order/sales-order').then(m => m.SalesOrder),
        canActivate: [authGuard]
    },
    {
        path: 'sales-entry',
        loadComponent: () => import('./sales-entry/sales-entry').then(m => m.SalesEntry),
        canActivate: [authGuard]
    },
    {
        path: 'sales-return',
        loadComponent: () => import('./sales-return/sales-return').then(m => m.SalesReturn),
        canActivate: [authGuard]
    },
    {
        path: 'bde',
        loadComponent: () => import('./bde/bde').then(m => m.Bde),
        canActivate: [authGuard]
    },
    {
        path: 'customers',
        loadComponent: () => import('./customers/customers').then(m => m.Customers),
        canActivate: [authGuard]
    },
];
