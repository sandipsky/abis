import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="categories" masterName="Category" createMasterPermissionName="CreateProductCategories" editMasterPermissionName="EditProductCategories" deleteMasterPermissionName="DeleteProductCategories" exportMasterPermissionName="ExportProductCategories"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true
})
export class Category {
  tableHeaders = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Category', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'status', sort: false, status: true }
  ];

  filterColumns = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "status",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

