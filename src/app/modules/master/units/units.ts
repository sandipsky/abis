import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';
import { FilterColumn } from '../../../shared/models/filter.model';
import { TableHeader } from '../../../shared/models/table-header.model';

@Component({
  selector: 'app-unit-master',
  standalone: true,
  imports: [GeneralMaster],
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="units" masterName="Unit" createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits" deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits"></app-general-master>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Units {
  tableHeaders: TableHeader[] = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Unit', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ];

  filterColumns: FilterColumn[] = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "isActive",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}
