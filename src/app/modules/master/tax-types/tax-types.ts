import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="tax_types" masterName="Tax Type" createMasterPermissionName="CreateTaxType" editMasterPermissionName="EditTaxType" deleteMasterPermissionName="DeleteTaxType" exportMasterPermissionName="ExportTaxType"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true
})
export class TaxTypes { }

