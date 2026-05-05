import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '@/auth/auth.service';
import { CustomerService } from './customer.service';
import { ExcelService } from '@/shared/services/excel.service';
import { SpinnerService } from '@/shared/services/spinner.service';

// Modules & Components
import { SharedModule } from '@/shared/shared-module';
import { DeleteModalComponent } from '@/shared/components/delete-modal/delete-modal.component';
import { AddCustomer } from './add-customer/add-customer';
import { ICustomer } from './customer.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ISortEvent } from '@/shared/models/sort.model';
import { IApiResponse } from '@/shared/models/api-response.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Customers implements OnInit {
  private _customerService = inject(CustomerService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);

  // State Signals
  masterList = signal<ICustomer[]>([]);
  length = signal(0);
  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);
  filterList = signal<IFilterItem[]>([]);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  });

  readonly filterColumns = signal<IFilterColumn[]>([
    { name: 'Name', formcontrolName: 'name', type: 'text' },
    { name: 'Registration Number', formcontrolName: 'registration_number', type: 'text' },
    { name: 'Contact', formcontrolName: 'contact', type: 'text' },
    { name: 'Email', formcontrolName: 'email', type: 'text' },
    {
      name: 'Status',
      type: 'select',
      formcontrolName: 'isActive',
      data: [{ name: 'Active', id: '1' }, { name: 'Inactive', id: '0' }]
    }
  ]);

  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Name', property: 'name', sortBy: 'name', sort: true },
    { name: 'Registration Number', property: 'registration_number', sortBy: 'registrationNumber', sort: true },
    { name: 'Contact', property: 'contact', sortBy: 'contact', sort: true },
    { name: 'Email', property: 'email', sortBy: 'email', sort: true },
    { name: 'Status', property: 'is_active', sortBy: 'isActive', sort: true, status: true, editStatus: false }
  ]);

  ngOnInit(): void {
    this.getMasterList();
  }

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
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
    this._customerService.getCustomerList(formData).subscribe({
      next: (res: IPaginatedResponse<ICustomer>) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.length.set(res?.totalElements || 0);
        }
        this._spinnerService.setSpinner(false);
      }
    });
  }

  applyFilter(filters: IFilterItem[]) {
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

  onSort({ column, direction }: ISortEvent) {
    this.filterForm.update(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: direction
    }));
    this.getMasterList();
  }

  showForm(data?: ICustomer, isView = false) {
    const dialogRef = this._dialog.open(AddCustomer, {
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

  deleteItem(data: ICustomer) {
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
        this._customerService.deleteCustomer(data.id).subscribe({
          next: (res: IApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          }
        });
      }
    });
  }

  exportExcel(data: ICustomer[]) {
    this._excelService.exportExcel('Customers', this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}
