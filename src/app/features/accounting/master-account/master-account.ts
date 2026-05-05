import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '@/auth/auth.service';
import { MasterAccountService } from './master-account.service';
import { ExcelService } from '@/shared/services/excel.service';
import { SpinnerService } from '@/shared/services/spinner.service';

// Modules & Components
import { SharedModule } from '@/shared/shared-module';
import { DeleteModalComponent } from '@/shared/components/delete-modal/delete-modal.component';
import { AddMasterAccount } from './add-master-account/add-master-account';
import { IAccountTypeGroup, IAccountTypeOption, IMasterAccount } from './master-account.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ISortEvent } from '@/shared/models/sort.model';
import { IApiResponse } from '@/shared/models/api-response.model';

@Component({
  selector: 'app-master-account',
  templateUrl: './master-account.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterAccount implements OnInit {
  private _masterAccountService = inject(MasterAccountService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);

  // State Signals
  masterList = signal<IMasterAccount[]>([]);
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

  filterColumns = signal<IFilterColumn[]>([]);

  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Code', property: 'account_code', sortBy: 'accountCode', sort: true },
    { name: 'Name', property: 'account_name', sortBy: 'accountName', sort: true },
    { name: 'Account Type', property: 'account_type', sort: false },
    { name: 'Parent Account', property: 'parent_account_name', sort: false },
    { name: 'Status', property: 'is_active', sort: false, status: true, editStatus: false }
  ]);

  ngOnInit(): void {
    this.getMasterList();
    this.loadFilters();
  }

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
  }

  loadFilters(): void {
    this._masterAccountService.getAccountTypes().subscribe((groups: IAccountTypeGroup[]) => {
      const accountTypes: IAccountTypeOption[] = (groups || []).flatMap(g =>
        (g.types || []).map(t => ({ id: t, name: t, group: g.heading }))
      );

      this.filterColumns.set([
        { name: 'Name', formcontrolName: 'accountName', type: 'text' },
        { name: 'Code', formcontrolName: 'accountCode', type: 'text' },
        { name: 'Account Type', formcontrolName: 'accountType', type: 'select', data: accountTypes, groupBy: 'group' },
        {
          name: 'Status',
          type: 'select',
          formcontrolName: 'isActive',
          data: [{ name: 'Active', id: '1' }, { name: 'Inactive', id: '0' }]
        }
      ]);
    });
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
    this._masterAccountService.getMasterAccountList(formData).subscribe({
      next: (res: IPaginatedResponse<IMasterAccount>) => {
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

  showForm(data?: IMasterAccount, isView = false) {
    const dialogRef = this._dialog.open(AddMasterAccount, {
      panelClass: ['drawer-right', 'slide-left'],
      disableClose: true,
      data: { formData: data, isView }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef?.removePanelClass('slide-left');
      dialogRef?.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef?.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getMasterList();
    });
  }

  deleteItem(data: IMasterAccount) {
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      data: { name: data.account_name },
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
        this._masterAccountService.deleteMasterAccount(data.id).subscribe({
          next: (res: IApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          }
        });
      }
    });
  }

  exportExcel(data: IMasterAccount[]) {
    this._excelService.exportExcel('Master Account', this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}
