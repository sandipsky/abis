import { Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

export const settingsRoutes: Routes = [{
    path: 'configuration',
    loadComponent: () => import('./configuration/configuration').then(m => m.Configuration),
    canActivate: [authGuard]
},
];
