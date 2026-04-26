import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';

@Component({
  selector: 'app-unit-master',
  standalone: true,
  imports: [GeneralMaster],
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="units" masterName="Unit" createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits" deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits"></app-general-master>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Units {
  tableHeaders = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Unit', property: 'name', sortBy: 'name', sort: true },
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
