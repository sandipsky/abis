import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { permissionGuard } from './auth/permission.guard';
import { masterRoutes } from './modules/master/master.routes';
import { settingsRoutes } from './modules/settings/settings.routes';
import { purchaseRoutes } from './modules/purchase/purchase.routes';
import { salesRoutes } from './modules/sales/sales.routes';
import { inventoryRoutes } from './modules/inventory/inventory.routes';
import { accountingRoutes } from './modules/accounting/accounting.routes';

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
                canActivate: [permissionGuard],
                data: { permission: 'ViewProduct' }
            },
            {
                path: 'reports',
                loadComponent: () => import('./modules/reports/reports').then(m => m.Reports),
            },
            {
                path: 'user',
                loadComponent: () => import('./modules/user/user').then(m => m.User),
                canActivate: [permissionGuard],
                data: { permission: 'ViewUser' }
            },
            {
                path: 'roles-permissions',
                loadComponent: () => import('./modules/roles-permission/roles-permission').then(m => m.RolesPermission),
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
