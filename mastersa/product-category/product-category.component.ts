import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="categories" masterName="Product Category" createMasterPermissionName="CreateProductCategories" editMasterPermissionName="EditProductCategories" deleteMasterPermissionName="DeleteProductCategories" exportMasterPermissionName="ExportProductCategories"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class ProductCategoryComponent { }

