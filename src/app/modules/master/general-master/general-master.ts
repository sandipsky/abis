import { Component, Input, TemplateRef, ViewChild, signal, computed, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '../../../shared/shared-module';
import { MastersInlineModalComponent } from './add-master-modal/add-master-modal';
import { MasterService } from '../master.service';
import { AuthService } from '../../../auth/auth.service';
import { DeleteModalComponent } from '../../../shared/components/delete-modal/delete-modal.component';
import { ExcelService } from '../../../shared/services/excel.service';
import { MasterItem } from '../master.model';
import { input } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner.service';

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

  tableHeaders = input<any[]>([]);
  filterColumns = input<any[]>([]);

  masterList = signal<any[]>([]);
  totalElements = signal<number>(0);
  filterList = signal<any[]>([]);
  operationList = signal<string[]>([]);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  @ViewChild('view', { static: true }) view!: TemplateRef<any>;

  ngOnInit(): void {
    this.operationList.set(this._authService.userPermissionList());
    this.getMasterList();
  }

  applyFilter(filters: any[]) {
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

  onSort({ column, direction }: any) {
    this.filterForm.update(f => ({
      ...f,
      sortBy: column,
      sortDirection: direction
    }));
    this.getMasterList();
  }

  getMasterList(isExport?: boolean): void {
    let filter = {
      filter: this.filterList() || [],
      pagination: {
        pageIndex: isExport ? 0 : this.filterForm().pageIndex,
        pageSize: isExport ? (this.totalElements() || 999999) : this.filterForm().pageSize,
      },
      sortDTO: [{
        field: this.filterForm().sortBy,
        orderType: this.filterForm().sortDirection,
      }],
    };

    this._spinnerService.setSpinner(true);
    this._masterService.getMasterList(filter, this.endPoint()).subscribe({
      next: (res: any) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.totalElements.set(res?.totalElements || 0);
          this._spinnerService.setSpinner(false);
        }
      },
      error: (err) => {
        this._toastr.error(err);
        this._spinnerService.setSpinner(false);
      },
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

  openDelete(master?: MasterItem): void {
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
      if (result) this.getMasterList();
    });
  }

  exportExcel(masterList: MasterItem[]) {
    this._excelService.exportExcel(this.masterName(), this.tableHeaders(), masterList);
  }

  printPage() {
    window.print();
  }
}