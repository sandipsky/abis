import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';

export const inventoryRoutes: Routes = [
    {
        path: 'stock-adjustment',
        loadComponent: () => import('./stock-adjustment/stock-adjustment').then(m => m.StockAdjustment),
        canActivate: [authGuard]
    },
    {
        path: 'stock-edit',
        loadComponent: () => import('./stock-edit/stock-edit').then(m => m.StockEdit),
        canActivate: [authGuard]
    },
    {
        path: 'opening-stock',
        loadComponent: () => import('./opening-stock/opening-stock').then(m => m.OpeningStock),
        canActivate: [authGuard]
    },
];
