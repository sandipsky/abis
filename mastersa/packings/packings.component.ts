import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="packings" masterName="Packing" createMasterPermissionName="CreatePackings" editMasterPermissionName="EditPackings" deleteMasterPermissionName="DeletePackings" exportMasterPermissionName="ExportPackings"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class PackingsComponent { }

