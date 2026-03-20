import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="tax_types" masterName="Tax Type" createMasterPermissionName="CreateTaxType" editMasterPermissionName="EditTaxType" deleteMasterPermissionName="DeleteTaxType" exportMasterPermissionName="ExportTaxType"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class TaxTypesComponent { }

