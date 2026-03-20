import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="companies" masterName="Company" createMasterPermissionName="CreateCompanyName" editMasterPermissionName="EditCompanyName" deleteMasterPermissionName="DeleteCompanyName" exportMasterPermissionName="ExportCompanyName"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class CompaniesComponent { }

