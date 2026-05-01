import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '@/modules/master/general-master/general-master';
import { IFilterColumn } from '@/shared/models/filter.model';
import { ITableHeader } from '@/shared/models/table-header.model';

@Component({
  selector: 'app-unit-master',
  standalone: true,
  imports: [GeneralMaster],
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="units" masterName="Unit" createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits" deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits"></app-general-master>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Units {
  tableHeaders: ITableHeader[] = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Unit', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ];

  filterColumns: IFilterColumn[] = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "isActive",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}
