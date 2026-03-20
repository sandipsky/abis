const masterData = [
    {
        name: 'Purchase',
        icon: '',
        children: [
            { link: 'master/divisions', label: 'Division', tooltip: 'Division', icon: 'division', activeIcon: 'division-active', permission: 'ViewDivision' },
            { link: 'master/billing-term', label: 'Billing Term', tooltip: 'Division', icon: 'division', activeIcon: 'division-active', permission: 'ViewDivision' },
        ]
    },
    {
        name: 'Sales',
        icon: '',
        children: [
            { link: 'master/discount-category', label: 'Discount Category', tooltip: 'Discount Category', icon: 'discount-category', activeIcon: 'discount-category-active', permission: 'ViewDiscountCategory' },
            { link: 'master/transport', label: 'Transport', tooltip: 'Transport', icon: 'transport', activeIcon: 'transport-active', permission: 'ViewTransport' },
            { link: 'master/headquarters', label: 'Headquarter', tooltip: 'Headquarter', icon: 'headquarter', activeIcon: 'headquarter-active', permission: 'ViewHeadquarter' },
            { link: 'master/divisions', label: 'Division', tooltip: 'Division', icon: 'division', activeIcon: 'division-active', permission: 'ViewDivision' },
        ]
    },
    {
        name: 'Manufacturing',
        icon: '',
        children: [
            { link: 'master/cost-center', label: 'Cost Center', tooltip: 'Cost Center', icon: 'cost-center', activeIcon: 'cost-center-active', permission: 'ViewCostCenters' },
        ]
    },
    {
        name: 'Accounting',
        icon: '',
        children: [
            { link: 'master/narration', label: 'Narration', tooltip: 'Narration', icon: 'narration', activeIcon: 'narration-active', permission: 'ViewNarrations' },
            { link: 'master/sub-account', label: 'Sub Account', tooltip: 'Sub Account', icon: 'sub-account', activeIcon: 'sub-account-active', permission: 'ViewSubAccount' },
        ]
    },
    {
        name: 'Product',
        icon: '',
        children: [
            { link: 'master/units', label: 'Unit', tooltip: 'Unit', icon: 'unit', activeIcon: 'unit-active', permission: 'ViewUnitss' },
            { link: 'master/packings', label: 'Packing', tooltip: 'Packing', icon: 'packing', activeIcon: 'packing-active', permission: 'ViewPackings' },
            { link: 'master/tax-types', label: 'Tax Type', tooltip: 'Tax Type', icon: 'tax-type', activeIcon: 'tax-type-active', permission: 'ViewTaxType' },
            { link: 'master/product-category', label: 'Product Category', tooltip: 'Product Category', icon: 'product-category', activeIcon: 'product-category-active', permission: 'ViewProductCategories' },
            { link: 'master/product-group', label: 'Product Group', tooltip: 'Product Group', icon: 'product-group', activeIcon: 'product-group-active', permission: 'ViewProductGroups' },
            { link: 'master/companies', label: 'Company', tooltip: 'Company', icon: 'company', activeIcon: 'company-active', permission: 'ViewCompanyName' },
            { link: 'master/divisions', label: 'Division', tooltip: 'Division', icon: 'division', activeIcon: 'division-active', permission: 'ViewDivision' },
            { link: 'master/generic-name', label: 'Generic', tooltip: 'Generic', icon: 'generic', activeIcon: 'generic-active', permission: 'ViewGenericName' },
        ]
    },
];

export default masterData;
