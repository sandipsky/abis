import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="designations" masterName="Designation" createMasterPermissionName="CreateDesignation" editMasterPermissionName="EditDesignation" deleteMasterPermissionName="DeleteDesignation" exportMasterPermissionName="ExportDesignation"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class DesignationComponent { }

