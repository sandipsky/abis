import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const salesRoutes: Routes = [
    {
        path: 'sales-order',
        loadComponent: () => import('./sales-order/sales-order').then(m => m.SalesOrder),
        canActivate: [permissionGuard],
        data: { permission: 'ViewSalesOrder' }
    },
    {
        path: 'sales-entry',
        loadComponent: () => import('./sales-entry/sales-entry').then(m => m.SalesEntry),
        canActivate: [permissionGuard],
        data: { permission: 'ViewSalesEntries' }
    },
    {
        path: 'sales-return',
        loadComponent: () => import('./sales-return/sales-return').then(m => m.SalesReturn),
        canActivate: [permissionGuard],
        data: { permission: 'ViewSalesReturns' }
    },
    {
        path: 'bde',
        loadComponent: () => import('./bde/bde').then(m => m.Bde),
        canActivate: [permissionGuard],
        data: { permission: 'ViewB/D/E' }
    },
    {
        path: 'customers',
        loadComponent: () => import('./customers/customers').then(m => m.Customers),
        canActivate: [permissionGuard],
        data: { permission: 'ViewCustomer' }
    },
];
