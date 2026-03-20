import { Component } from '@angular/core';
import { GeneralMasterComponent } from '../general-master/general-master.component';

@Component({
  selector: 'app-unit-master',
  standalone: true, // Marking it as standalone
  imports: [GeneralMasterComponent],
  template: `<app-general-master endPoint="units" masterName="Unit" createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits" deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits"></app-general-master>`,
})

export class UnitMasterComponent { }
