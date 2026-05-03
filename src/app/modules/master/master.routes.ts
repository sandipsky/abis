import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const masterRoutes: Routes = [
    {
        path: 'units',
        loadComponent: () => import('./units/units').then(m => m.Units),
        canActivate: [permissionGuard],
        data: { permission: 'ViewUnit' }
    },
    {
        path: 'packings',
        loadComponent: () => import('./packings/packings').then(m => m.Packings),
        canActivate: [permissionGuard],
        data: { permission: 'ViewPacking' }
    },
    {
        path: 'tax-types',
        loadComponent: () => import('./tax-types/tax-types').then(m => m.TaxTypes),
        canActivate: [permissionGuard],
        data: { permission: 'ViewTaxType' }
    },
    {
        path: 'category',
        loadComponent: () => import('./category/category').then(m => m.Category),
        canActivate: [permissionGuard],
        data: { permission: 'ViewCategory' }
    },
];
