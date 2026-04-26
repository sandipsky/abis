import { Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

export const settingsRoutes: Routes = [
    {
        path: 'document-number-scheme',
        loadComponent: () => import('./document-number-scheme/document-number-scheme').then(m => m.DocumentNumberScheme),
        canActivate: [authGuard]
    },
];
