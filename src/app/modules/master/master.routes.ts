import { Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

export const masterRoutes: Routes = [{
    path: 'units',
    loadComponent: () => import('./units/units').then(m => m.Units),
    canActivate: [authGuard]
},
{
    path: 'packings',
    loadComponent: () => import('./packings/packings').then(m => m.Packings),
    canActivate: [authGuard]
},
{
    path: 'tax-types',
    loadComponent: () => import('./tax-types/tax-types').then(m => m.TaxTypes),
    canActivate: [authGuard]
},
{
    path: 'product-category',
    loadComponent: () => import('./product-category/product-category').then(m => m.ProductCategory),
    canActivate: [authGuard]
},
];
