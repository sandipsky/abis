import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';

@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="tax_types" masterName="Tax Type" createMasterPermissionName="CreateTaxType" editMasterPermissionName="EditTaxType" deleteMasterPermissionName="DeleteTaxType" exportMasterPermissionName="ExportTaxType"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true
})
export class TaxTypes {
  tableHeaders = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Tax Type', property: 'name', sortBy: 'name', sort: true },
    { name: 'Tax Rate', property: 'tax_rate', sortBy: 'tax_rate', sort: true },
    { name: 'Status', property: 'status', sort: false, status: true }
  ];

  filterColumns = [
    { name: "Tax Rate", type: "text", formcontrolName: "tax_rate" },
    {
      name: "Status",
      type: "select",
      formcontrolName: "status",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

