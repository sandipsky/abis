import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '@/auth/auth.service';
import { RolesPermissionService } from './roles-permission.service';
import { ExcelService } from '@/shared/services/excel.service';
import { SpinnerService } from '@/shared/services/spinner.service';

// Modules & Components
import { SharedModule } from '@/shared/shared-module';
import { DeleteModalComponent } from '@/shared/components/delete-modal/delete-modal.component';
import { AddRolesPermission } from './add-roles-permission/add-roles-permission';
import { IRolesPermission } from './roles-permission.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ISortEvent } from '@/shared/models/sort.model';
import { IApiResponse } from '@/shared/models/api-response.model';

@Component({
  selector: 'app-roles-permission',
  templateUrl: './roles-permission.html',
  styleUrl: './roles-permission.scss',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesPermission implements OnInit {
  private _rolesPermissionService = inject(RolesPermissionService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);

  // State Signals
  masterList = signal<IRolesPermission[]>([]);
  length = signal(0);
  operationList = signal<string[]>([]);
  filterList = signal<IFilterItem[]>([]);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  });

  readonly filterColumns = signal<IFilterColumn[]>([
    { name: 'Name', formcontrolName: 'name', type: 'text' },
    { name: 'Description', formcontrolName: 'description', type: 'text' },
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
    { name: 'Description', property: 'description', sortBy: 'description', sort: true },
    { name: 'Status', property: 'is_active', sortBy: 'isActive', sort: true, status: true, editStatus: false }
  ]);

  ngOnInit(): void {
    this.operationList.set(this._authService.userPermissionList());
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
    this._rolesPermissionService.getRolesPermissionList(formData).subscribe({
      next: (res: IPaginatedResponse<IRolesPermission>) => {
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

  showForm(data?: IRolesPermission, isView = false) {
    const dialogRef = this._dialog.open(AddRolesPermission, {
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

  deleteItem(data: IRolesPermission) {
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
        this._rolesPermissionService.deleteRolesPermission(data.id).subscribe({
          next: (res: IApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          }
        });
      }
    });
  }

  exportExcel(data: IRolesPermission[]) {
    this._excelService.exportExcel('RolesPermissions', this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}
