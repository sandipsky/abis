import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const inventoryRoutes: Routes = [
    {
        path: 'stock-adjustment',
        loadComponent: () => import('./stock-adjustment/stock-adjustment').then(m => m.StockAdjustment),
        canActivate: [permissionGuard],
        data: { permission: 'ViewStockAdjustment' }
    },
    {
        path: 'stock-edit',
        loadComponent: () => import('./stock-edit/stock-edit').then(m => m.StockEdit),
        canActivate: [permissionGuard],
        data: { permission: 'ViewStockEdit' }
    },
    {
        path: 'opening-stock',
        loadComponent: () => import('./opening-stock/opening-stock').then(m => m.OpeningStock),
        canActivate: [permissionGuard],
        data: { permission: 'ViewOpeningStock' }
    },
];
