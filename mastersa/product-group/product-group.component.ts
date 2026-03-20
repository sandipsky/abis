import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="productGroups" masterName="Product Group" createMasterPermissionName="CreateProductGroups" editMasterPermissionName="EditProductGroups" deleteMasterPermissionName="DeleteProductGroups" exportMasterPermissionName="ExportProductGroups"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class ProductGroupComponent { }

