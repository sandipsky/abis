import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="divisions" masterName="Division" createMasterPermissionName="CreateDivision" editMasterPermissionName="EditDivision" deleteMasterPermissionName="DeleteDivision" exportMasterPermissionName="ExportDivision"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class DivisionsComponent { }

