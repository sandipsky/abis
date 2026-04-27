import { Component, OnInit, signal, computed, inject, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '../../auth/auth.service';
import { ProductService } from './product.service';
import { DropdownsService } from '../../shared/services/dropdown.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { ExcelService } from '../../shared/services/excel.service';

// Modules & Components
import { SharedModule } from '../../shared/shared-module';
import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';
import { AddProducts } from './add-products/add-products';
import { Product } from './product.model';
import { FilterColumn, FilterItem } from '../../shared/models/filter.model';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';
import { SortEvent } from '../../shared/models/sort.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products implements OnInit {
  private _productService = inject(ProductService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _configService = inject(ConfigurationService);
  private _dropdown = inject(DropdownsService);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);

  // State Signals
  masterList = signal<Product[]>([]);
  length = signal(0);
  operationList = signal<string[]>([]);
  filterList = signal<FilterItem[]>([]);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  });

  filterColumns = signal<FilterColumn[]>([]);

  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Product Name', property: 'name', sortBy: 'name', sort: true },
    { name: 'Code', property: 'code', sortBy: 'code', sort: true },
    { name: 'Category', property: 'category_name', sortBy: 'category.name', sort: true },
    { name: 'Product Type', property: 'product_types', chip: true },
    { name: 'Primary Unit', property: 'unit_name', sortBy: 'unit.name', sort: true },
    { name: 'Packing', property: 'packing_name', sortBy: 'packing.name', sort: true },
    { name: 'Tax Type', property: 'tax_type_name', sortBy: 'taxType.name', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true, editStatus: false }
  ]);

  ngOnInit(): void {
    this.operationList.set(this._authService.userPermissionList());
    this.getMasterList();
    this.loadDropdowns();
  }

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
  }

  loadDropdowns(): void {
    this.filterColumns.set([
      { name: "Product", formcontrolName: "name", type: "text" },
      { name: "Product Code", formcontrolName: "productCode", type: "text" },
      // { name: "Product Category", formcontrolName: "productCategory.id", type: "select", data: info.categories },
      // { name: "Unit", type: "select", formcontrolName: "primaryUnit_id", data: info.units },
      // { name: "Packing", type: "select", formcontrolName: "packing_id", data: info.packings },
      // { name: "Tax Type", type: "select", formcontrolName: "taxType_id", data: info.tax_types },
      { name: "Type", type: "select", formcontrolName: "type", data: [{ name: "Purchasable", id: "purchasable" }, { name: "Sellable", id: "sellable" }] },
      { name: "Status", type: "select", formcontrolName: "isActive", data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }] }
    ]);
  }

  getMasterList(isExport = false): void {
    const formData = {
      filter: this.filterList(),
      pagination: {
        pageIndex: isExport ? 0 : this.filterForm().pageIndex,
        pageSize: isExport ? 999999 : this.filterForm().pageSize,
      },
      sortDTO: [{
        field: this.filterForm().sortBy || 'id',
        orderType: this.filterForm().sortDirection || 'desc',
      }],
    };

    this._spinnerService.setSpinner(true);
    this._productService.getProductList(formData).subscribe({
      next: (res: PaginatedResponse<Product>) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.length.set(res?.totalElements || 0);
        }
        this._spinnerService.setSpinner(false);
      },
      error: (err) => {
        console.log(err)
        this._toastr.error(err.error.message, 'Error');
        this._spinnerService.setSpinner(false);
      }
    });
  }

  applyFilter(filters: FilterItem[]) {
    this.filterList.set(filters);
    this.filterForm.update(prev => ({ ...prev, pageIndex: 0 }));
    this.getMasterList();
  }

  onChangedPage(pageData: PageEvent) {
    this.filterForm.update(prev => ({
      ...prev,
      pageIndex: pageData.pageIndex,
      pageSize: pageData.pageSize
    }));
    this.getMasterList();
  }

  onSort({ column, direction }: SortEvent) {
    this.filterForm.update(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: direction
    }));
    this.getMasterList();
  }

  showForm(data?: Product, isView = false) {
    const dialogRef = this._dialog.open(AddProducts, {
      panelClass: ['drawer-top', 'slide-up'],
      disableClose: true,
      data: { formData: data, isView }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef?.removePanelClass('slide-up');
      dialogRef?.addPanelClass('slide-up-close');

      setTimeout(() => {
        dialogRef?.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getMasterList();
    });
  }

  deleteItem(data: Product) {
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      data: { name: data.name },
      disableClose: true
    });

    dialogRef?.backdropClick().subscribe(() => {
      dialogRef?.removePanelClass('slide-up');
      dialogRef?.addPanelClass('slide-up-close');

      setTimeout(() => {
        dialogRef?.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this._spinnerService.setSpinner(true);
        this._productService.deleteProduct(data.id).subscribe({
          next: (res: ApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          },
          error: (err) => {
            this._spinnerService.setSpinner(false);
            this._toastr.success(err.error.message, 'Error');
          }
        });
      }
    });
  }

  exportExcel(data: Product[]) {
    this._excelService.exportExcel("Products", this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}