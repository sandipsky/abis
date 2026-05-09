import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const purchaseRoutes: Routes = [
    {
        path: 'purchase-order',
        loadComponent: () => import('./purchase-order/purchase-order').then(m => m.PurchaseOrder),
        canActivate: [permissionGuard],
        data: { permission: 'ViewPurchaseOrder' }
    },
    {
        path: 'purchase-entry',
        loadComponent: () => import('./purchase-entry/purchase-entry').then(m => m.PurchaseEntry),
        canActivate: [permissionGuard],
        data: { permission: 'ViewPurchaseEntry' }
    },
    {
        path: 'purchase-return',
        loadComponent: () => import('./purchase-return/purchase-return').then(m => m.PurchaseReturn),
        canActivate: [permissionGuard],
        data: { permission: 'ViewPurchaseReturn' }
    },
    {
        path: 'vendors',
        loadComponent: () => import('./vendors/vendors').then(m => m.Vendors),
        canActivate: [permissionGuard],
        data: { permission: 'ViewVendor' }
    },
];
