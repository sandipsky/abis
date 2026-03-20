import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="customerCategories" masterName="Discount Category" createMasterPermissionName="CreateDiscountCategory" editMasterPermissionName="EditDiscountCategory" deleteMasterPermissionName="DeleteDiscountCategory" exportMasterPermissionName="ExportDiscountCategory"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class DiscountCategoryComponent { }

