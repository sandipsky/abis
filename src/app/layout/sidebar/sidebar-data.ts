
const sidebarData = [
    {
        title: 'MAIN MENU',
        items: [
            {
                link: 'dashboard',
                tooltip: 'Dashboard',
                label: 'Dashboard',
                icon: 'dashboard',
                activeIcon: 'dashboard-active',
                permission: true,
            },
            {
                link: '',
                label: 'Purchase',
                tooltip: 'Purchase',
                icon: 'purchase',
                activeIcon: 'purchase-active',
                children: [
                    {
                        link: 'purchase-order',
                        label: 'Purchase Order',
                        tooltip: 'Purchase Order',
                        icon: 'purchase-order',
                        activeIcon: 'purchase-order-active',
                        permission: 'ViewPurchaseOrder'
                    },
                    {
                        link: 'purchase-entry',
                        label: 'Purchase Entry',
                        tooltip: 'Purchase Entry',
                        icon: 'purchase-entry',
                        activeIcon: 'purchase-entry-active',
                        permission: 'ViewPurchaseEntries'
                    },
                    {
                        link: 'purchase-return',
                        label: 'Purchase Return',
                        tooltip: 'Purchase Return',
                        icon: 'purchase-return',
                        activeIcon: 'purchase-return-active',
                        permission: 'ViewPurchaseReturns'
                    },
                    {
                        link: 'vendors',
                        label: 'Vendor',
                        tooltip: 'Vendor',
                        icon: 'vendor',
                        activeIcon: 'vendor-active',
                        permission: 'ViewVendor'
                    },
                ]
            },
            {
                link: '',
                label: 'Sales',
                tooltip: 'Sales',
                icon: 'sales',
                activeIcon: 'sales-active',
                children: [
                    {
                        link: 'sales-order',
                        label: 'Sales Order',
                        tooltip: 'Sales Order',
                        icon: 'sales-order',
                        activeIcon: 'sales-order-active',
                        permission: 'ViewSalesOrder'
                    },
                    {
                        link: 'sales-entry',
                        label: 'Sales Entry',
                        tooltip: 'Sales Entry',
                        icon: 'sales-entry',
                        activeIcon: 'sales-entry-active',
                        permission: 'ViewSalesEntries'
                    },
                    {
                        link: 'sales-return',
                        label: 'Sales Return',
                        tooltip: 'Sales Return',
                        icon: 'sales-return',
                        activeIcon: 'sales-return-active',
                        permission: 'ViewSalesReturns'
                    },
                    {
                        link: 'bde',
                        label: 'BDE',
                        tooltip: 'BDE',
                        icon: 'bde',
                        activeIcon: 'bde-active',
                        permission: 'ViewB/D/E'
                    },
                    {
                        link: 'customers',
                        label: 'Customer',
                        tooltip: 'Customer',
                        icon: 'customer',
                        activeIcon: 'customer-active',
                        permission: 'ViewCustomer'
                    },
                ]
            },
            {
                link: '',
                label: 'Inventory',
                tooltip: 'Inventory',
                icon: 'inventory',
                activeIcon: 'inventory-active',
                children: [
                    {
                        link: 'stock-adjustment',
                        label: 'Stock Adjustment',
                        tooltip: 'Stock Adjustment',
                        icon: 'stock-adjustment',
                        activeIcon: 'stock-adjustment-active',
                        permission: 'ViewStockAdjustment'
                    },
                    {
                        link: 'stock-edit',
                        label: 'Stock Edit',
                        tooltip: 'Stock Edit',
                        icon: 'stock-edit',
                        activeIcon: 'stock-edit-active',
                        permission: 'ViewStockEdit'
                    },
                    {
                        link: 'opening-stock',
                        label: 'Opening Stock',
                        tooltip: 'Opening Stock',
                        icon: 'opening-stock',
                        activeIcon: 'opening-stock-active',
                        permission: 'ViewOpeningStock'
                    },
                    {
                        link: 'physical-stock-master',
                        label: 'Physical Stock Master',
                        tooltip: 'Physical Stock Master',
                        icon: 'physical-stock-master',
                        activeIcon: 'physical-stock-master-active',
                        permission: 'ViewPhysicalStocks'
                    },
                ]
            },
            {
                link: '',
                label: 'Accounting',
                tooltip: 'Accounting',
                icon: 'accounting',
                activeIcon: 'accounting-active',
                children: [
                    {
                        link: 'journal-entry',
                        label: 'Journal Entry',
                        tooltip: 'Journal Entry',
                        icon: 'journal-entry',
                        activeIcon: 'journal-entry-active',
                        permission: 'ViewJournalEntries'
                    },
                    {
                        link: 'payment',
                        label: 'Payment',
                        tooltip: 'Payment',
                        icon: 'payment',
                        activeIcon: 'payment-active',
                        permission: ['ViewCustomerPayment', 'ViewVendorPayment']
                    },
                    {
                        link: 'payment-adjustment',
                        label: 'Payment Adjustment',
                        tooltip: 'Payment Adjustment',
                        icon: 'payment-adjustment',
                        activeIcon: 'payment-adjustment-active',
                        permission: 'ViewPaymentAdjustment'
                    },
                    {
                        link: 'credit-note',
                        label: 'Credit Note',
                        tooltip: 'Credit Note',
                        icon: 'credit-note',
                        activeIcon: 'credit-note-active',
                        permission: ['ViewVendorCreditNotes', 'ViewCustomerCreditNotes']
                    },
                    {
                        link: 'debit-note',
                        label: 'Debit Note',
                        tooltip: 'Debit Note',
                        icon: 'debit-note',
                        activeIcon: 'debit-note-active',
                        permission: ['ViewCustomerDebitNotes', 'ViewVendorDebitNotes']
                    },
                    {
                        link: 'opening-balance',
                        label: 'Opening Balance',
                        tooltip: 'Opening Balance',
                        icon: 'opening-balance',
                        activeIcon: 'opening-balance-active',
                        permission: 'ViewOpeningBalance'
                    },
                    {
                        link: 'master-account',
                        label: 'Account',
                        tooltip: 'Account',
                        icon: 'account',
                        activeIcon: 'account-active',
                        permission: 'ViewAccount'
                    },
                ]
            },
        ]
    },
    {
        title: 'SETUP',
        items: [
            {
                link: 'products',
                tooltip: 'Products',
                label: 'Products',
                icon: 'products',
                activeIcon: 'products-active',
                permission: 'ViewProduct',
            },
            {
                link: 'master',
                label: 'Masters',
                tooltip: 'Masters',
                icon: 'master',
                activeIcon: 'master-active',
                children: [
                    { link: 'units', label: 'Unit', tooltip: 'Unit', icon: 'unit', activeIcon: 'unit-active', permission: 'ViewUnit' },
                    { link: 'packings', label: 'Packing', tooltip: 'Packing', icon: 'packing', activeIcon: 'packing-active', permission: 'ViewPackings' },
                    { link: 'tax-types', label: 'Tax Type', tooltip: 'Tax Type', icon: 'tax-type', activeIcon: 'tax-type-active', permission: 'ViewTaxType' },
                    { link: 'product-category', label: 'Product Category', tooltip: 'Product Category', icon: 'product-category', activeIcon: 'product-category-active', permission: 'ViewProductCategories' },
                ]
            },
            {
                link: 'reports',
                tooltip: 'Reports',
                label: 'Reports',
                icon: 'reports',
                activeIcon: 'reports-active',
                permission: true,
            },
            {
                link: '',
                label: 'User & Roles',
                tooltip: 'User & Roles',
                icon: 'users',
                activeIcon: 'users-active',
                children: [
                    {
                        link: 'user',
                        label: 'User',
                        tooltip: 'User',
                        icon: 'user',
                        activeIcon: 'user-active',
                        permission: 'ViewUser'
                    },
                    {
                        link: 'roles-permissions',
                        label: 'Roles and Permission',
                        tooltip: 'Roles and Permission',
                        icon: 'roles-permission',
                        activeIcon: 'roles-permission-active',
                        permission: 'ViewRoles'
                    },
                ]
            },
            {
                link: '',
                label: 'Settings',
                tooltip: 'Settings',
                icon: 'settings',
                activeIcon: 'settings-active',
                children: [
                    {
                        link: 'configuration',
                        label: 'Configuration',
                        tooltip: 'Configuration',
                        icon: 'configuration',
                        activeIcon: 'configuration-active',
                        permission: 'ViewConfig'
                    },

                    {
                        link: 'auto-code-generator',
                        label: 'Auto Code Generator',
                        tooltip: 'Auto Code Generator',
                        icon: 'auto-code-generator',
                        activeIcon: 'auto-code-generator-active',
                        permission: 'ViewAutoCodeGenerator'
                    },
                    {
                        link: 'document-number-scheme',
                        label: 'Document Numbering',
                        tooltip: 'Document Numbering',
                        icon: 'document-numbering-scheme',
                        activeIcon: 'document-numbering-scheme-active',
                        permission: 'ViewDocumentNumberingScheme'
                    },
                    {
                        link: 'backup-restore',
                        label: 'Backup and Restore',
                        tooltip: 'Backup and Restore',
                        icon: 'backup-restore',
                        activeIcon: 'backup-restore-active',
                        permission: 'CreateDatabaseBackup'
                    },
                    {
                        link: 'closing',
                        label: 'Closing',
                        tooltip: 'Closing',
                        icon: 'closing',
                        activeIcon: 'closing-active',
                        permission: 'CloseCurrentFicalYear'
                    },
                ]
            },

        ]
    }

]


export default sidebarData;