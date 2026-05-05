import { Component, Input, TemplateRef, ViewChild, signal, computed, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '@/shared/shared-module';
import { MastersInlineModalComponent } from './add-master-modal/add-master-modal';
import { MasterService } from '@/features/master/master.service';
import { AuthService } from '@/auth/auth.service';
import { DeleteModalComponent } from '@/shared/components/delete-modal/delete-modal.component';
import { ExcelService } from '@/shared/services/excel.service';
import { MasterItem } from '@/features/master/master.model';
import { input } from '@angular/core';
import { SpinnerService } from '@/shared/services/spinner.service';
import { ISortEvent } from '@/shared/models/sort.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { ITableHeader } from '@/shared/models/table-header.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IApiResponse } from '@/shared/models/api-response.model';

@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralMaster implements OnInit {
  private _masterService = inject(MasterService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _spinnerService = inject(SpinnerService);
  private _excelService = inject(ExcelService);

  endPoint = input.required<string>();
  masterName = input.required<string>();

  createMasterPermissionName = input<string>('');
  editMasterPermissionName = input<string>('');
  deleteMasterPermissionName = input<string>('');
  exportMasterPermissionName = input<string>('');
  printMasterPermissionName = input<string>('');

  tableHeaders = input<ITableHeader[]>([]);
  filterColumns = input<IFilterColumn[]>([]);

  masterList = signal<MasterItem[]>([]);
  totalElements = signal<number>(0);
  filterList = signal<IFilterItem[]>([]);
  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  ngOnInit(): void {
    this.getMasterList();
  }

  applyFilter(filters: IFilterItem[]) {
    this.filterList.set(filters);
    this.filterForm.update(f => ({ ...f, pageIndex: 0 }));
    this.getMasterList();
  }

  onChangedPage(pageData: PageEvent) {
    this.filterForm.update(f => ({
      ...f,
      pageIndex: pageData.pageIndex,
      pageSize: pageData.pageSize
    }));
    this.getMasterList();
  }

  onSort(e: ISortEvent) {
    this.filterForm.update(f => ({
      ...f,
      sortBy: e.column,
      sortDirection: e.direction
    }));
    this.getMasterList();
  }

  getMasterList(isExport?: boolean): void {
    let filter: IPaginatedRequest = {
      filter: this.filterList() || [],
      pagination: {
        pageIndex: isExport ? 0 : this.filterForm().pageIndex,
        pageSize: isExport ? (this.totalElements() || 999999) : this.filterForm().pageSize,
      },
      sortDTO: [{
        field: this.filterForm().sortBy || 'name',
        orderType: this.filterForm().sortDirection || 'asc',
      }],
    };

    this._spinnerService.setSpinner(true);
    this._masterService.getMasterList(filter, this.endPoint()).subscribe({
      next: (res: IPaginatedResponse<MasterItem>) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.totalElements.set(res?.totalElements || 0);
          this._spinnerService.setSpinner(false);
        }
      }
    });
  }

  openAddModal(master?: MasterItem) {
    const item = {
      title: this.masterName(),
      endPoint: this.endPoint(),
      formData: master || {},
    };

    const dialogRef = this._dialog.open(MastersInlineModalComponent, {
      data: { item },
      panelClass: ['slide-left', 'drawer-right'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-left');
      dialogRef.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getMasterList();
    });
  }

  openDelete(master: MasterItem): void {
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      panelClass: 'slide-up',
      disableClose: true,
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: { item: master }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-up');
      dialogRef.addPanelClass('slide-up-close');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._spinnerService.setSpinner(true);
        this._masterService.deleteMaster(master.id, this.endPoint()).subscribe({
          next: (res: IApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          }
        })
      };
    });
  }

  exportExcel(masterList: MasterItem[]) {
    this._excelService.exportExcel(this.masterName(), this.tableHeaders(), masterList);
  }

  printPage() {
    window.print();
  }
}