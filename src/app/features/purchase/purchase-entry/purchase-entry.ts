import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '@/auth/auth.service';
import { PurchaseEntryService } from './purchase-entry.service';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { ExcelService } from '@/shared/services/excel.service';
import { SpinnerService } from '@/shared/services/spinner.service';

// Modules & Components
import { SharedModule } from '@/shared/shared-module';
import { AddPurchaseEntry } from './add-purchase-entry/add-purchase-entry';
import { IPurchaseEntry } from './purchase-entry.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ISortEvent } from '@/shared/models/sort.model';

@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseEntry implements OnInit {
  private _purchaseEntryService = inject(PurchaseEntryService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _dropdownService = inject(DropdownsService);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);

  // State Signals
  masterList = signal<IPurchaseEntry[]>([]);
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
    { name: 'Purchase No.', property: 'system_entry_no', sortBy: 'systemEntryNo', sort: true },
    { name: 'Posting Date', property: 'date', sortBy: 'postingDate', sort: true },
    { name: 'Vendor Name', property: 'vendor_name', sortBy: 'vendor.name', sort: true },
    { name: 'Transaction Type', property: 'transaction_type', sortBy: 'transactionType', sort: true },
    { name: 'Bill No.', property: 'bill_no', sortBy: 'billNo', sort: true },
    { name: 'Bill Date', property: 'bill_date', sortBy: 'billDate', sort: true },
    { name: 'Gross Amount', property: 'gross_amount', sortBy: 'grossAmount', sort: true },
    { name: 'Discount', property: 'discount', sortBy: 'discount', sort: true },
    { name: 'Tax Amount', property: 'tax', sortBy: 'taxAmount', sort: true },
    { name: 'Net Amount', property: 'net_amount', sortBy: 'netAmount', sort: true },
  ]);

  ngOnInit(): void {
    this.getMasterList();
    this.loadFilters();
  }

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
  }

  loadFilters(): void {
    this._dropdownService.getMasterDropdown('vendor').subscribe(vendors => {
      this.filterColumns.set([
        { name: 'Purchase No', formcontrolName: 'purchaseNo', type: 'text' },
        { name: 'Vendor', formcontrolName: 'vendor.id', type: 'select', data: vendors },
        {
          name: 'Transaction Type',
          formcontrolName: 'transactionType',
          type: 'select',
          data: [{ name: 'Cash', id: 'cash' }, { name: 'Credit', id: 'credit' }]
        },
        { name: 'Bill No', formcontrolName: 'billNo', type: 'text' },
        { name: 'Bill Date', formcontrolName: 'billDate', type: 'date' },
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
    this._purchaseEntryService.getPurchaseEntryList(formData).subscribe({
      next: (res: IPaginatedResponse<IPurchaseEntry>) => {
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

  showForm(data?: IPurchaseEntry, isView = false) {
    const dialogRef = this._dialog.open(AddPurchaseEntry, {
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

  exportExcel(data: IPurchaseEntry[]) {
    this._excelService.exportExcel('Purchase Entries', this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}
