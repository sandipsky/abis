import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { permissionGuard } from './auth/permission.guard';
import { masterRoutes } from './features/master/master.routes';
import { settingsRoutes } from './features/settings/settings.routes';
import { purchaseRoutes } from './features/purchase/purchase.routes';
import { salesRoutes } from './features/sales/sales.routes';
import { inventoryRoutes } from './features/inventory/inventory.routes';
import { accountingRoutes } from './features/accounting/accounting.routes';

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
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/products').then(m => m.Products),
                canActivate: [permissionGuard],
                data: { permission: 'ViewProduct' }
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports').then(m => m.Reports),
            },
            {
                path: 'user',
                loadComponent: () => import('./features/user/user').then(m => m.User),
                canActivate: [permissionGuard],
                data: { permission: 'ViewUser' }
            },
            {
                path: 'roles-permissions',
                loadComponent: () => import('./features/roles-permission/roles-permission').then(m => m.RolesPermission),
                canActivate: [permissionGuard],
                data: { permission: 'ViewRole' }
            },
            ...masterRoutes,
            ...settingsRoutes,
            ...purchaseRoutes,
            ...salesRoutes,
            ...inventoryRoutes,
            ...accountingRoutes,
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login),
        canActivate: [loginGuard]
    },
    { path: '**', redirectTo: 'dashboard' },
];
