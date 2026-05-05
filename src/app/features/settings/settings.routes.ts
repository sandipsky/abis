import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const settingsRoutes: Routes = [
    {
        path: 'configuration',
        loadComponent: () => import('./configuration/configuration').then(m => m.Configuration),
        canActivate: [permissionGuard],
        data: { permission: 'ViewConfiguration' }
    },
    {
        path: 'document-number-scheme',
        loadComponent: () => import('./document-number-scheme/document-number-scheme').then(m => m.DocumentNumberScheme),
        canActivate: [permissionGuard],
        data: { permission: 'ViewDocumentNumbering' }
    },
];
