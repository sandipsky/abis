import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralMaster } from '@/features/master/general-master/general-master';
import { IFilterColumn } from '@/shared/models/filter.model';
import { ITableHeader } from '@/shared/models/table-header.model';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master [tableHeaders]="tableHeaders" [filterColumns]="filterColumns" endPoint="categorys" masterName="Category" createMasterPermissionName="CreateProductCategories" editMasterPermissionName="EditProductCategories" deleteMasterPermissionName="DeleteProductCategories" exportMasterPermissionName="ExportProductCategories"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Category {
  tableHeaders: ITableHeader[] = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Category', property: 'name', sortBy: 'name', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ];

  filterColumns: IFilterColumn[] = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "is_active",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];
}

