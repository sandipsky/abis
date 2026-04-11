import { Component, OnInit, signal, computed, inject, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { MasterService } from '../master/master.service';
import { AuthService } from '../../auth/auth.service';
import { DropdownsService } from '../../shared/services/dropdown.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { ExcelService } from '../../shared/services/excel.service';

// Modules & Components
import { SharedModule } from '../../shared/shared-module';
import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';
import { AddProducts } from './add-products/add-products';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products implements OnInit {
  // Services (Modern Inject Pattern)
  private masterService = inject(MasterService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private configService = inject(ConfigurationService);
  private dropdown = inject(DropdownsService);
  private excelService = inject(ExcelService);

  // State Signals
  readonly endPoint = 'products';
  readonly masterList = signal<any[]>([]);
  readonly length = signal(0);
  readonly isLoading = signal(false);
  readonly operationList = signal<string[]>([]);
  readonly companyDetails = signal<any>(null);
  readonly filterList = signal<any[]>([]);

  readonly filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  });

  // Dropdown Signals
  readonly filterColumns = signal<any[]>([]);
  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Product Name', property: 'name', sortBy: 'name', sort: true },
    { name: 'Code', property: 'product_code', sortBy: 'productCode', sort: true },
    { name: 'Category', property: 'category_name', sortBy: 'productCategoriesString', sort: true },
    { name: 'Product Type', property: 'product_type', sortBy: 'productType', sort: true },
    { name: 'Primary Unit', property: 'primary_unit_name', sortBy: 'primaryUnit_name', sort: true },
    { name: 'Packing', property: 'packing', sortBy: 'packing.name', sort: true },
    { name: 'Tax Type', property: 'tax_type_name', sortBy: 'taxType.name', sort: true },
    { name: 'Status', property: 'status', sort: false, status: true, editStatus: false }
  ]);

  @ViewChild('view', { static: true }) view!: TemplateRef<any>;
  private dialogRef?: MatDialogRef<any>;

  ngOnInit(): void {
    this.operationList.set(this.authService.userPermissionList());
    this.getMasterList();
    this.loadDropdowns();
  }

  // Helper for Template Permissions
  hasPermission(perm: string): boolean {
    return this.operationList().includes(perm) || true; // Keeping your '|| true' logic
  }

  loadDropdowns(): void {
    this.dropdown.getAllProductDropdownInfo().subscribe((info: any) => {
      this.filterColumns.set([
        { name: "Product", formcontrolName: "name", type: "text" },
        { name: "Product Code", formcontrolName: "productCode", type: "text" },
        { name: "Product Category", formcontrolName: "productCategory.id", type: "select", data: info.categories },
        { name: "Product Group", formcontrolName: "productGroup_id", type: "select", data: info.product_groups },
        { name: "Unit", type: "select", formcontrolName: "primaryUnit_id", data: info.units },
        { name: "Packing", type: "select", formcontrolName: "packing_id", data: info.packings },
        { name: "Tax Type", type: "select", formcontrolName: "taxType_id", data: info.tax_types },
        { name: "Division", type: "select", formcontrolName: "division.id", data: info.divisions },
        { name: "Type", type: "select", formcontrolName: "type", data: [{ name: "Purchasable", id: "purchasable" }, { name: "Sellable", id: "sellable" }] },
        { name: "Status", type: "select", formcontrolName: "status", data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }] }
      ]);
    });
  }

  getMasterList(isExport = false): void {
    const currentFilterForm = this.filterForm();

    const payload = {
      filter: this.filterList(),
      pagination: {
        pageIndex: isExport ? 0 : currentFilterForm.pageIndex,
        pageSize: isExport ? 999999 : currentFilterForm.pageSize,
      },
      sortDTO: [{
        field: currentFilterForm.sortBy || 'id',
        orderType: currentFilterForm.sortDirection || 'desc',
      }],
    };

    this.isLoading.set(true);
    this.masterService.getMasterList(payload, this.endPoint).subscribe({
      next: (res: any) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.length.set(res?.totalElements || 0);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err);
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(filters: any[]) {
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

  onSort({ column, direction }: any) {
    this.filterForm.update(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: direction
    }));
    this.getMasterList();
  }

  showForm(data?: any, isView = false) {
    this.dialogRef = this.dialog.open(AddProducts, {
      panelClass: ['drawer-top', 'slide-up'],
      disableClose: true,
      data: { formData: data, isView }
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef?.removePanelClass('slide-up');
      this.dialogRef?.addPanelClass('slide-up-close');

      setTimeout(() => {
        this.dialogRef?.close();
      }, 400);
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) this.getMasterList();
    });
  }

  deleteItem(data: any) {
    const ref = this.dialog.open(DeleteModalComponent, {
      data: { name: data.name },
      disableClose: true
    });

    this.dialogRef?.backdropClick().subscribe(() => {
      this.dialogRef?.removePanelClass('slide-up');
      this.dialogRef?.addPanelClass('slide-up-close');

      setTimeout(() => {
        this.dialogRef?.close();
      }, 400);
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading.set(true);
        this.masterService.deleteMaster(data.id, this.endPoint).subscribe({
          next: (res: any) => {
            res.messages?.forEach((m: any) => this.toastr.success(m.message));
            this.getMasterList();
          },
          error: (err) => {
            this.isLoading.set(false);
            err.error?.messages?.forEach((m: any) => this.toastr.error(m.message));
          }
        });
      }
    });
  }

  exportExcel(data: any[]) {
    // excel logic here
  }
}