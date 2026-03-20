import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="genericNames" masterName="Generic Name" createMasterPermissionName="CreateGenericName" editMasterPermissionName="EditGenericName" deleteMasterPermissionName="DeleteGenericName" exportMasterPermissionName="ExportGenericName"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class GenericNameComponent { }

