import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '@/modules/master/general-master/general-master';
import { IFilterColumn } from '@/shared/models/filter.model';
import { ITableHeader } from '@/shared/models/table-header.model';

@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="taxtypes" masterName="Tax Type" createMasterPermissionName="CreateTaxType" editMasterPermissionName="EditTaxType" deleteMasterPermissionName="DeleteTaxType" exportMasterPermissionName="ExportTaxType"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxTypes {
  tableHeaders: ITableHeader[] = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Tax Type', property: 'name', sortBy: 'name', sort: true },
    { name: 'Tax Rate', property: 'tax_rate', sortBy: 'tax_rate', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ];

  filterColumns: IFilterColumn[] = [
    { name: "Tax Rate", type: "text", formcontrolName: "tax_rate" },
    {
      name: "Status",
      type: "select",
      formcontrolName: "is_active",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

