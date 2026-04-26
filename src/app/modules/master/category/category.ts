import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="categorys" masterName="Category" createMasterPermissionName="CreateProductCategories" editMasterPermissionName="EditProductCategories" deleteMasterPermissionName="DeleteProductCategories" exportMasterPermissionName="ExportProductCategories"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Category {
  tableHeaders = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Category', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ];

  filterColumns = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "is_active",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

