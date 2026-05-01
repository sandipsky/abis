import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';

export const purchaseRoutes: Routes = [
    {
        path: 'purchase-order',
        loadComponent: () => import('./purchase-order/purchase-order').then(m => m.PurchaseOrder),
        canActivate: [authGuard]
    },
    {
        path: 'purchase-entry',
        loadComponent: () => import('./purchase-entry/purchase-entry').then(m => m.PurchaseEntry),
        canActivate: [authGuard]
    },
    {
        path: 'purchase-return',
        loadComponent: () => import('./purchase-return/purchase-return').then(m => m.PurchaseReturn),
        canActivate: [authGuard]
    },
    {
        path: 'vendors',
        loadComponent: () => import('./vendors/vendors').then(m => m.Vendors),
        canActivate: [authGuard]
    },
];
