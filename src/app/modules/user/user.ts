import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

// Services
import { AuthService } from '@/auth/auth.service';
import { UserService } from './user.service';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { ExcelService } from '@/shared/services/excel.service';
import { SpinnerService } from '@/shared/services/spinner.service';

// Modules & Components
import { SharedModule } from '@/shared/shared-module';
import { DeleteModalComponent } from '@/shared/components/delete-modal/delete-modal.component';
import { AddUser } from './add-user/add-user';
import { IUser } from './user.model';
import { IFilterColumn, IFilterItem } from '@/shared/models/filter.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ISortEvent } from '@/shared/models/sort.model';
import { IApiResponse } from '@/shared/models/api-response.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class User implements OnInit {
  private _userService = inject(UserService);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);
  private _excelService = inject(ExcelService);
  private _spinnerService = inject(SpinnerService);
  private _dropdownService = inject(DropdownsService);

  // State Signals
  masterList = signal<IUser[]>([]);
  length = signal(0);
  operationList = signal<string[]>([]);
  filterList = signal<IFilterItem[]>([]);
  filterColumns = signal<IFilterColumn[]>([]);

  filterForm = signal({
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  });

  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Name', property: 'full_name', sortBy: 'fullName', sort: true },
    { name: 'Username', property: 'username', sortBy: 'username', sort: true },
    { name: 'Role', property: 'role_name', sortBy: 'roleName', sort: true },
    { name: 'Contact No.', property: 'contact', sortBy: 'contact', sort: true },
    { name: 'Email', property: 'email', sortBy: 'email', sort: true },
    { name: 'Status', property: 'is_active', sort: false, status: true }
  ]);

  ngOnInit(): void {
    this.operationList.set(this._authService.userPermissionList());
    this.getMasterList();
    this.loadFilterColumns();
  }

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
  }

  loadFilterColumns(): void {
    this._dropdownService.getMasterDropdown('roles').subscribe(roles => {
      this.filterColumns.set([
        { name: 'Name', formcontrolName: 'name', type: 'text' },
        { name: 'Username', formcontrolName: 'username', type: 'text' },
        { name: 'Role', formcontrolName: 'role.id', type: 'select', data: roles },
        { name: 'Contact No.', formcontrolName: 'contact', type: 'text' },
        { name: 'Email', formcontrolName: 'email', type: 'text' },
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
    this._userService.getUserList(formData).subscribe({
      next: (res: IPaginatedResponse<IUser>) => {
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

  showForm(data?: IUser, isView = false) {
    const dialogRef = this._dialog.open(AddUser, {
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

  deleteItem(data: IUser) {
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
        this._userService.deleteUser(data.id).subscribe({
          next: (res: IApiResponse) => {
            this._toastr.success(res.message, 'Success');
            this._spinnerService.setSpinner(false);
            this.getMasterList();
          }
        });
      }
    });
  }

  exportExcel(data: IUser[]) {
    this._excelService.exportExcel('Users', this.tableHeaders(), data);
  }

  printPage() {
    window.print();
  }
}
