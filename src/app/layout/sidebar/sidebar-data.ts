
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
                        permission: true
                    },
                    {
                        link: 'billing-term',
                        label: 'Billing Term',
                        tooltip: 'Billing Term',
                        icon: 'billing-term',
                        activeIcon: 'billing-term-active',
                        permission: true
                    },
                    {
                        link: 'purchase-entry',
                        label: 'Purchase Entry',
                        tooltip: 'Purchase Entry',
                        icon: 'purchase-entry',
                        activeIcon: 'purchase-entry-active',
                        permission: true
                    },
                    {
                        link: 'purchase-return',
                        label: 'Purchase Return',
                        tooltip: 'Purchase Return',
                        icon: 'purchase-return',
                        activeIcon: 'purchase-return-active',
                        permission: true
                    },
                    {
                        link: 'vendor',
                        label: 'Vendor',
                        tooltip: 'Vendor',
                        icon: 'vendor',
                        activeIcon: 'vendor-active',
                        permission: true
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
                        permission: true
                    },
                    {
                        link: 'bulk-order',
                        label: 'Bulk Order',
                        tooltip: 'Bulk Order',
                        icon: 'bulk-order',
                        activeIcon: 'bulk-order-active',
                        permission: true
                    },
                    {
                        link: 'dispatch',
                        label: 'Dispatch',
                        tooltip: 'Dispatch',
                        icon: 'dispatch',
                        activeIcon: 'dispatch-active',
                        permission: true
                    },
                    {
                        link: 'sales-entry',
                        label: 'Sales Entry',
                        tooltip: 'Sales Entry',
                        icon: 'sales-entry',
                        activeIcon: 'sales-entry-active',
                        permission: true
                    },
                    {
                        link: 'sales-return',
                        label: 'Sales Return',
                        tooltip: 'Sales Return',
                        icon: 'sales-return',
                        activeIcon: 'sales-return-active',
                        permission: true
                    },
                    {
                        link: 'bde',
                        label: 'BDE',
                        tooltip: 'BDE',
                        icon: 'bde',
                        activeIcon: 'bde-active',
                        permission: true
                    },
                    {
                        link: 'customer',
                        label: 'Customer',
                        tooltip: 'Customer',
                        icon: 'customer',
                        activeIcon: 'customer-active',
                        permission: true
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
                        permission: true
                    },
                    {
                        link: 'stock-edit',
                        label: 'Stock Edit',
                        tooltip: 'Stock Edit',
                        icon: 'stock-edit',
                        activeIcon: 'stock-edit-active',
                        permission: true
                    },
                    {
                        link: 'opening-stock',
                        label: 'Opening Stock',
                        tooltip: 'Opening Stock',
                        icon: 'opening-stock',
                        activeIcon: 'opening-stock-active',
                        permission: true
                    },
                ]
            },
            {
                link: '',
                label: 'Manufacturing',
                tooltip: 'Manufacturing',
                icon: 'manufacturing',
                activeIcon: 'manufacturing-active',
                children: [
                    {
                        link: 'finish-goods-receipt',
                        label: 'Finish Goods Receipt',
                        tooltip: 'Finish Goods Receipt',
                        icon: 'finish-goods-receipt',
                        activeIcon: 'finish-goods-receipt-active',
                        permission: true
                    },
                    {
                        link: 'material-issue',
                        label: 'Material Issue',
                        tooltip: 'Material Issue',
                        icon: 'material-issue',
                        activeIcon: 'material-issue-active',
                        permission: true
                    },
                    {
                        link: 'material-issue-return',
                        label: 'Material Issue Return',
                        tooltip: 'Material Issue Return',
                        icon: 'material-issue-return',
                        activeIcon: 'material-issue-return-active',
                        permission: true
                    },
                    {
                        link: 'physical-stock-master',
                        label: 'Physical Stock Master',
                        tooltip: 'Physical Stock Master',
                        icon: 'physical-stock-master',
                        activeIcon: 'physical-stock-master-active',
                        permission: true
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
                        permission: true
                    },
                    {
                        link: 'payment',
                        label: 'Payment',
                        tooltip: 'Payment',
                        icon: 'payment',
                        activeIcon: 'payment-active',
                        permission: true
                    },
                    {
                        link: 'payment-adjustment',
                        label: 'Payment Adjustment',
                        tooltip: 'Payment Adjustment',
                        icon: 'payment-adjustment',
                        activeIcon: 'payment-adjustment-active',
                        permission: true
                    },
                    {
                        link: 'cash-bank-voucher',
                        label: 'Cash/Bank Voucher',
                        tooltip: 'Cash/Bank Voucher',
                        icon: 'cash-bank-voucher',
                        activeIcon: 'cash-bank-voucher-active',
                        permission: true
                    },
                    {
                        link: 'credit-note',
                        label: 'Credit Note',
                        tooltip: 'Credit Note',
                        icon: 'credit-note',
                        activeIcon: 'credit-note-active',
                        permission: true
                    },
                    {
                        link: 'debit-note',
                        label: 'Debit Note',
                        tooltip: 'Debit Note',
                        icon: 'debit-note',
                        activeIcon: 'debit-note-active',
                        permission: true
                    },
                    {
                        link: 'opening-balance',
                        label: 'Opening Balance',
                        tooltip: 'Opening Balance',
                        icon: 'opening-balance',
                        activeIcon: 'opening-balance-active',
                        permission: true
                    },
                    {
                        link: 'account',
                        label: 'Account',
                        tooltip: 'Account',
                        icon: 'account',
                        activeIcon: 'account-active',
                        permission: true
                    },
                ]
            },
        ]
    },
    {
        title: 'SETUP',
        items: [
            {
                link: 'product',
                tooltip: 'Products',
                label: 'Products',
                icon: 'products',
                activeIcon: 'products-active',
                permission: true,
            },
            {
                link: '',
                label: 'Masters',
                tooltip: 'Masters',
                icon: 'products',
                activeIcon: 'products-active',
                children: [
                    { link: 'unit', label: 'Unit', tooltip: 'Unit', icon: 'unit', activeIcon: 'unit-active', permission: true },
                    { link: 'packing', label: 'Packing', tooltip: 'Packing', icon: 'packing', activeIcon: 'packing-active', permission: true },
                    { link: 'tax-type', label: 'Tax Type', tooltip: 'Tax Type', icon: 'tax-type', activeIcon: 'tax-type-active', permission: true },
                    { link: 'product-category', label: 'Product Category', tooltip: 'Product Category', icon: 'product-category', activeIcon: 'product-category-active', permission: true },
                    { link: 'product-group', label: 'Product Group', tooltip: 'Product Group', icon: 'product-group', activeIcon: 'product-group-active', permission: true },
                    { link: 'company', label: 'Company', tooltip: 'Company', icon: 'company', activeIcon: 'company-active', permission: true },
                    { link: 'division', label: 'Division', tooltip: 'Division', icon: 'division', activeIcon: 'division-active', permission: true },
                    { link: 'generic', label: 'Generic', tooltip: 'Generic', icon: 'generic', activeIcon: 'generic-active', permission: true },
                    { link: 'narration', label: 'Narration', tooltip: 'Narration', icon: 'narration', activeIcon: 'narration-active', permission: true },
                    { link: 'sub-account', label: 'Sub Account', tooltip: 'Sub Account', icon: 'sub-account', activeIcon: 'sub-account-active', permission: true },
                    { link: 'cost-center', label: 'Cost Center', tooltip: 'Cost Center', icon: 'cost-center', activeIcon: 'cost-center-active', permission: true },
                    { link: 'discount-category', label: 'Discount Category', tooltip: 'Discount Category', icon: 'discount-category', activeIcon: 'discount-category-active', permission: true },
                    { link: 'transport', label: 'Transport', tooltip: 'Transport', icon: 'transport', activeIcon: 'transport-active', permission: true },
                    { link: 'headquarter', label: 'Headquarter', tooltip: 'Headquarter', icon: 'headquarter', activeIcon: 'headquarter-active', permission: true },
                ]
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
                        permission: true
                    },
                    {
                        link: 'designation',
                        label: 'Designation',
                        tooltip: 'Designation',
                        icon: 'designation',
                        activeIcon: 'designation-active',
                        permission: true
                    },
                    {
                        link: 'roles-permission',
                        label: 'Roles and Permission',
                        tooltip: 'Roles and Permission',
                        icon: 'roles-permission',
                        activeIcon: 'roles-permission-active',
                        permission: true
                    },
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
                label: 'Settings',
                tooltip: 'Settings',
                icon: 'settings',
                activeIcon: 'settings-active',
                children: [
                    {
                        link: 'user',
                        label: 'User',
                        tooltip: 'User',
                        icon: 'user',
                        activeIcon: 'user-active',
                        permission: true
                    },
                    {
                        link: 'designation',
                        label: 'Designation',
                        tooltip: 'Designation',
                        icon: 'designation',
                        activeIcon: 'designation-active',
                        permission: true
                    },
                    {
                        link: 'roles-permission',
                        label: 'Roles and Permission',
                        tooltip: 'Roles and Permission',
                        icon: 'roles-permission',
                        activeIcon: 'roles-permission-active',
                        permission: true
                    },
                ]
            },

        ]
    }

]


export default sidebarData;