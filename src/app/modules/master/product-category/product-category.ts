import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="categories" masterName="Product Category" createMasterPermissionName="CreateProductCategories" editMasterPermissionName="EditProductCategories" deleteMasterPermissionName="DeleteProductCategories" exportMasterPermissionName="ExportProductCategories"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true
})
export class ProductCategory { }

