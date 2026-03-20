import { Component } from '@angular/core';
import { GeneralMasterComponent } from '../general-master/general-master.component';

@Component({
  selector: 'app-unit-master',
  standalone: true, // Marking it as standalone
  imports: [GeneralMasterComponent],
  template: `<app-general-master endPoint="costCenters" masterName="Cost Center" createMasterPermissionName="CreateCostCenters" editMasterPermissionName="EditCostCenters" deleteMasterPermissionName="DeleteCostCenters" exportMasterPermissionName="ExportCostCenters"></app-general-master>`,
})

export class CostCenterComponent { }
