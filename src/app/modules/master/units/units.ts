import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';

@Component({
  selector: 'app-unit-master',
  standalone: true, 
  imports: [GeneralMaster],
  template: `<app-general-master endPoint="units" masterName="Unit" createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits" deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits"></app-general-master>`,
})

export class Units { }
