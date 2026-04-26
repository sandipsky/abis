import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="packings" masterName="Packing" createMasterPermissionName="CreatePackings" editMasterPermissionName="EditPackings" deleteMasterPermissionName="DeletePackings" exportMasterPermissionName="ExportPackings"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Packings {
  tableHeaders = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Packing', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'status', sort: false, status: true }
  ];

  filterColumns = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "status",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

