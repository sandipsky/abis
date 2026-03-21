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

@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralMaster implements OnInit {
  // Services using inject()
  private masterService = inject(MasterService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private excelService = inject(ExcelService);

  // Signal Inputs
  endPoint = input.required<string>();
  masterName = input.required<string>();
  createMasterPermissionName = input<string>('');
  editMasterPermissionName = input<string>('');
  deleteMasterPermissionName = input<string>('');
  exportMasterPermissionName = input<string>('');
  printMasterPermissionName = input<string>('');

  // State Signals
  masterList = signal<any[]>([]);
  isLoading = signal<boolean>(false);
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

  // Computed Properties (Reactive derivation)
  tableHeaders = computed(() => [
    { name: 'SN', property: 'sn', sort: false },
    { name: this.masterName(), property: 'name', sortBy: 'name', sort: true },
    ...(this.masterName() === 'Tax Type'
      ? [{ name: 'Tax Rate', property: 'tax_rate', sortBy: 'tax_rate', sort: true }]
      : []),
    { name: 'Status', property: 'status', sort: false, status: true }
  ]);

  filterColumns = computed(() => [
    ...(this.masterName() === 'Tax Type'
      ? [{ name: "Tax Rate", type: "text", formcontrolName: "tax_rate" }]
      : []),
    {
      name: "Status",
      type: "select",
      formcontrolName: "status",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ]);

  ngOnInit(): void {
    this.operationList.set(this.authService.userPermissionList());
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
    const currentForm = this.filterForm();

    let filter = {
      filter: this.filterList() || [],
      pagination: {
        pageIndex: isExport ? 0 : currentForm.pageIndex,
        pageSize: isExport ? (this.totalElements() || 999999) : currentForm.pageSize,
      },
      sortDTO: [{
        field: currentForm.sortBy,
        orderType: currentForm.sortDirection,
      }],
    };

    this.isLoading.set(true);
    this.masterService.getMasterList(filter, this.endPoint()).subscribe({
      next: (res: any) => {
        if (isExport) {
          this.exportExcel(res?.content);
        } else {
          this.masterList.set(res?.content || []);
          this.totalElements.set(res?.totalElements || 0);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err);
        this.isLoading.set(false);
      },
    });
  }

  openAddModal(master?: MasterItem) {
    const item = {
      title: this.masterName(),
      endPoint: this.endPoint(),
      formData: master || {},
    };

    const dialogRef = this.dialog.open(MastersInlineModalComponent, {
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
    const dialogRef = this.dialog.open(DeleteModalComponent, {
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
    // Note: Use signal accessors masterName() and internal logic
    const headers = ['SN', this.masterName()];
    if (this.masterName() === 'Tax Type') headers.push('Tax Rate(%)');
    headers.push('Status');

    const exportData = masterList.map((item, index) => {
      const row = [index + 1, item.name];
      if (this.masterName() === 'Tax Type') row.push(item.tax_rate || '-');
      row.push(item.status ? 'Active' : 'Inactive');
      return row;
    });

    // this.excelService.exportExcel(this.masterName(), headers, exportData);
  }
}