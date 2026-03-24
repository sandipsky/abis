import { Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

export const settingsRoutes: Routes = [
    {
        path: 'configuration',
        loadComponent: () => import('./configuration/configuration').then(m => m.Configuration),
        canActivate: [authGuard]
    },
    {
        path: 'auto-code-generator',
        loadComponent: () => import('./auto-code-generator/auto-code-generator').then(m => m.AutoCodeGenerator),
        canActivate: [authGuard]
    },
    {
        path: 'document-number-scheme',
        loadComponent: () => import('./document-number-scheme/document-number-scheme').then(m => m.DocumentNumberScheme),
        canActivate: [authGuard]
    },
];
