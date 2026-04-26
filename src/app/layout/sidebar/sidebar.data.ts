
const sidebarData = [
    {
        title: 'MAIN MENU',
        items: [
            {
                link: 'dashboard',
                tooltip: 'Dashboard',
                label: 'Dashboard',
                icon: 'dashboard',
                permission: true,
            },
            {
                link: '',
                label: 'Purchase',
                tooltip: 'Purchase',
                icon: 'purchase',
                children: [
                    {
                        link: 'purchase-order',
                        label: 'Purchase Order',
                        tooltip: 'Purchase Order',
                        icon: 'purchase-order',
                        permission: 'ViewPurchaseOrder'
                    },
                    {
                        link: 'purchase-entry',
                        label: 'Purchase Entry',
                        tooltip: 'Purchase Entry',
                        icon: 'purchase-entry',
                        permission: 'ViewPurchaseEntries'
                    },
                    {
                        link: 'purchase-return',
                        label: 'Purchase Return',
                        tooltip: 'Purchase Return',
                        icon: 'purchase-return',
                        permission: 'ViewPurchaseReturns'
                    },
                    {
                        link: 'vendors',
                        label: 'Vendor',
                        tooltip: 'Vendor',
                        icon: 'vendor',
                        permission: 'ViewVendor'
                    },
                ]
            },
            {
                link: '',
                label: 'Sales',
                tooltip: 'Sales',
                icon: 'sales',
                children: [
                    {
                        link: 'sales-order',
                        label: 'Sales Order',
                        tooltip: 'Sales Order',
                        icon: 'sales-order',
                        permission: 'ViewSalesOrder'
                    },
                    {
                        link: 'sales-entry',
                        label: 'Sales Entry',
                        tooltip: 'Sales Entry',
                        icon: 'sales-entry',
                        permission: 'ViewSalesEntries'
                    },
                    {
                        link: 'sales-return',
                        label: 'Sales Return',
                        tooltip: 'Sales Return',
                        icon: 'sales-return',
                        permission: 'ViewSalesReturns'
                    },
                    {
                        link: 'bde',
                        label: 'BDE',
                        tooltip: 'BDE',
                        icon: 'bde',
                        permission: 'ViewB/D/E'
                    },
                    {
                        link: 'customers',
                        label: 'Customer',
                        tooltip: 'Customer',
                        icon: 'customer',
                        permission: 'ViewCustomer'
                    },
                ]
            },
            {
                link: '',
                label: 'Inventory',
                tooltip: 'Inventory',
                icon: 'inventory',
                children: [
                    {
                        link: 'stock-adjustment',
                        label: 'Stock Adjustment',
                        tooltip: 'Stock Adjustment',
                        icon: 'stock-adjustment',
                        permission: 'ViewStockAdjustment'
                    },
                    {
                        link: 'stock-edit',
                        label: 'Stock Edit',
                        tooltip: 'Stock Edit',
                        icon: 'stock-edit',
                        permission: 'ViewStockEdit'
                    },
                    {
                        link: 'opening-stock',
                        label: 'Opening Stock',
                        tooltip: 'Opening Stock',
                        icon: 'opening-stock',
                        permission: 'ViewOpeningStock'
                    },
                ]
            },
            {
                link: '',
                label: 'Accounting',
                tooltip: 'Accounting',
                icon: 'accounting',
                children: [
                    {
                        link: 'journal-entry',
                        label: 'Journal Entry',
                        tooltip: 'Journal Entry',
                        icon: 'journal-entry',
                        permission: 'ViewJournalEntries'
                    },
                    {
                        link: 'payment',
                        label: 'Payment',
                        tooltip: 'Payment',
                        icon: 'payment',
                        permission: ['ViewCustomerPayment', 'ViewVendorPayment']
                    },
                    {
                        link: 'payment-adjustment',
                        label: 'Payment Adjustment',
                        tooltip: 'Payment Adjustment',
                        icon: 'payment-adjustment',
                        permission: 'ViewPaymentAdjustment'
                    },
                    {
                        link: 'opening-balance',
                        label: 'Opening Balance',
                        tooltip: 'Opening Balance',
                        icon: 'opening-balance',
                        permission: 'ViewOpeningBalance'
                    },
                    {
                        link: 'master-account',
                        label: 'Account',
                        tooltip: 'Account',
                        icon: 'account',
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
                permission: 'ViewProduct',
            },
            {
                link: 'master',
                label: 'Masters',
                tooltip: 'Masters',
                icon: 'master',
                children: [
                    { link: 'units', label: 'Unit', tooltip: 'Unit', icon: 'unit', permission: 'ViewUnit' },
                    { link: 'packings', label: 'Packing', tooltip: 'Packing', icon: 'packing', permission: 'ViewPackings' },
                    { link: 'tax-types', label: 'Tax Type', tooltip: 'Tax Type', icon: 'taxtype', permission: 'ViewTaxType' },
                    { link: 'category', label: 'Category', tooltip: 'Category', icon: 'category', permission: 'ViewProductCategories' },
                ]
            },
            {
                link: 'reports',
                tooltip: 'Reports',
                label: 'Reports',
                icon: 'reports',
                permission: true,
            },
            {
                link: '',
                label: 'User & Roles',
                tooltip: 'User & Roles',
                icon: 'users',
                children: [
                    {
                        link: 'user',
                        label: 'User',
                        tooltip: 'User',
                        icon: 'user',
                        permission: 'ViewUser'
                    },
                    {
                        link: 'roles-permissions',
                        label: 'Roles and Permission',
                        tooltip: 'Roles and Permission',
                        icon: 'roles-permission',
                        permission: 'ViewRoles'
                    },
                ]
            },
            {
                link: '',
                label: 'Settings',
                tooltip: 'Settings',
                icon: 'settings',
                children: [
                    {
                        link: 'configuration',
                        label: 'Configuration',
                        tooltip: 'Configuration',
                        icon: 'configuration',
                        permission: 'ViewConfig'
                    },
                    {
                        link: 'document-number-scheme',
                        label: 'Document Numbering',
                        tooltip: 'Document Numbering',
                        icon: 'document-numbering-scheme',
                        permission: 'ViewDocumentNumberingScheme'
                    },
                ]
            },

        ]
    }

]


export default sidebarData;