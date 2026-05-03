import { Routes } from '@angular/router';
import { permissionGuard } from '@/auth/permission.guard';

export const accountingRoutes: Routes = [
    {
        path: 'journal-entry',
        loadComponent: () => import('./journal-entry/journal-entry').then(m => m.JournalEntry),
        canActivate: [permissionGuard],
        data: { permission: 'ViewJournalEntries' }
    },
    {
        path: 'payment',
        loadComponent: () => import('./payment/payment').then(m => m.Payment),
        canActivate: [permissionGuard],
        data: { permission: ['ViewCustomerPayment', 'ViewVendorPayment'] }
    },
    {
        path: 'payment-adjustment',
        loadComponent: () => import('./payment-adjustment/payment-adjustment').then(m => m.PaymentAdjustment),
        canActivate: [permissionGuard],
        data: { permission: 'ViewPaymentAdjustment' }
    },
    {
        path: 'opening-balance',
        loadComponent: () => import('./opening-balance/opening-balance').then(m => m.OpeningBalance),
        canActivate: [permissionGuard],
        data: { permission: 'ViewOpeningBalance' }
    },
    {
        path: 'master-account',
        loadComponent: () => import('./master-account/master-account').then(m => m.MasterAccount),
        canActivate: [permissionGuard],
        data: { permission: 'ViewAccount' }
    },
];
