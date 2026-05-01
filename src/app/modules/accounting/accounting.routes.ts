import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';

export const accountingRoutes: Routes = [
    {
        path: 'journal-entry',
        loadComponent: () => import('./journal-entry/journal-entry').then(m => m.JournalEntry),
        canActivate: [authGuard]
    },
    {
        path: 'payment',
        loadComponent: () => import('./payment/payment').then(m => m.Payment),
        canActivate: [authGuard]
    },
    {
        path: 'payment-adjustment',
        loadComponent: () => import('./payment-adjustment/payment-adjustment').then(m => m.PaymentAdjustment),
        canActivate: [authGuard]
    },
    {
        path: 'opening-balance',
        loadComponent: () => import('./opening-balance/opening-balance').then(m => m.OpeningBalance),
        canActivate: [authGuard]
    },
    {
        path: 'master-account',
        loadComponent: () => import('./master-account/master-account').then(m => m.MasterAccount),
        canActivate: [authGuard]
    },
];
