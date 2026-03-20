import { Component, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { PageEvent } from '@angular/material/paginator';
import { DropdownsService } from 'src/app/services/dropdowns.service';
import { Table } from 'src/app/components/table/table';
import { DeleteModalComponent } from 'src/app/components/delete-modal/delete-modal.component';
import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
import { masterModel } from 'src/app/master/master.model';
import { UnitMasterService } from '../master.service';
import { AddUserComponent } from './add-user/add-user.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule, Table]
})

export class UserComponent {
  endPoint: string = 'users';
  masterList: any[] = [];
  length: number = 0;
  searchText: string = '';
  companyDetails: any;

  operationList: Array<string> = [];
  isLoading: boolean = false;

  filterColumns: any[] = [];

  filterForm = {
    pageIndex: 0,
    pageSize: 25,
    sortBy: '',
    sortDirection: '',
  }

  tableHeaders: any[] = [
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Users', property: 'name', sortBy: 'name', sort: true },
    { name: 'Code', property: 'code', sortBy: 'code', sort: true },
    { name: 'Designation', property: 'designation_name', sortBy: 'designationName', sort: true },
    { name: 'Org. Role', property: 'org_names', sortBy: 'orgNames', sort: true },
    { name: 'Functional Role', property: 'functional_names', sortBy: 'functionalNames', sort: true },
    { name: 'Contact No.', property: 'contact_number', sortBy: 'contactNumber', sort: true },
    { name: 'Email', property: 'user_name', sortBy: 'username', sort: true },
    { name: 'Status', property: 'enabled', sort: false, status: true, editStatus: false },
  ];

  public allCatrgories: Array<masterModel> = [];
  public allGroups: Array<masterModel> = [];
  public allCompanies: Array<masterModel> = [];
  public allDivisions: any;
  public allGenericNames: Array<masterModel> = [];
  public allPackings: Array<masterModel> = [];
  public allTaxTypes: Array<masterModel> = [];
  public allUnits: Array<masterModel> = [];

  filterList: any[] = [];
  @ViewChild('view', { static: true }) view!: TemplateRef<any>;

  constructor(
    private masterService: UnitMasterService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<any>,
    private excelService: ExcelService,
    private configService: ConfigServiceService,
    private dropdown: DropdownsService

  ) { }

  ngOnInit(): void {
    this.operationList = this.authService.userPermissionList();
    this.getMasterList();
    this.getRoles();

    this.configService.companyDetails$.subscribe((c) => {
      this.companyDetails = c;
    });
  }
  public getRoles(): void {
    this.dropdown.getRoles()
      .subscribe(roles => {
        this.filterColumns = [
          {
            name: "User",
            formcontrolName: "name",
            type: "text",
          },
          {
            name: "User Code",
            formcontrolName: "code",
            type: "text",
          },
          {
            name: "Role",
            formcontrolName: "role.id",
            type: "select",
            data: roles
          },
          {
            name: "Contact No.",
            formcontrolName: "contactNumber",
            type: "text",
          },
          {
            name: "Email",
            formcontrolName: "username",
            type: "text",
          },
          {
            name: "Status",
            type: "select",
            formcontrolName: "enabled",
            data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
          }
        ];
      })
  }

  applyFilter(filters: any[]) {
    this.filterList = filters;
    this.filterForm.pageIndex = 0;
    this.getMasterList();
  }

  onChangedPage(pageData: PageEvent) {
    this.filterForm.pageIndex = pageData.pageIndex;
    this.filterForm.pageSize = pageData.pageSize;
    this.getMasterList();
  }

  onSort({ column, direction }: any) {
    this.filterForm.sortBy = column;
    this.filterForm.sortDirection = direction;
    this.getMasterList();
  }


  getMasterList(isExport?: boolean): void {
    let filter = {
      filter: this.filterList || [],
      pagination: {
        pageIndex: isExport == true ? 0 : (this.filterForm.pageIndex || 0),
        pageSize: isExport == true ? (this.length || 9999999) : (this.filterForm.pageSize || 25),
      },
      sortDTO: [
        {
          field: this.filterForm.sortBy || 'id',
          orderType: this.filterForm.sortDirection || 'desc',
        },
      ],
    };

    this.isLoading = true;
    this.masterService.getMasterList(filter, this.endPoint).subscribe(
      {
        next: (res: any) => {
          if (isExport == true) {
            this.exportExcel(res?.content);
            this.isLoading = false;
          }
          else {
            this.masterList = [];
            this.masterList = res?.content?.map((user: any) => {
              user.org_names = user?.role_set
                ?.filter((role: any) => role.is_organizational === true)
                .map((role: any) => role.name).join(', ');

              user.functional_names = user?.role_set
                ?.filter((role: any) => role.is_organizational === false)
                .map((role: any) => role.name).join(', ');
              return user;
            }) || [];

            console.log(this.masterList)

            this.length = res?.totalElements || 0;
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.toastr.error(err);
          this.isLoading = false;
        },
      }
    )
  }

  showForm(data?: any, isView?: boolean) {
    this.dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: ['drawer-right', 'slide-left'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        formData: data,
        isView: isView
      }
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.closeDialog();
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getMasterList();
      }
    });
  }

  deleteItem(data: any) {
    this.dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        name: data.name
      }
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.removePanelClass('slide-up');
      this.dialogRef.addPanelClass('slide-up-close');

      setTimeout(() => {
        this.dialogRef.close();
      }, 400);
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.masterService.deleteMaster(data.id, this.endPoint).subscribe({
          next: (res: any) => {
            res.messages.forEach((message: any) => {
              if (res.success == true) {
                res?.messages?.forEach((message: any) => {
                  this.toastr.success(message.message, 'Success', {
                    closeButton: true,
                  });
                });
                this.isLoading = false;
                this.getMasterList();
              } else {
                res?.messages?.forEach((message: any) => {
                  this.toastr.error(message.message, 'Error', {
                    closeButton: true,
                  });
                });
                this.isLoading = false;
              }
            });
          },

          error: (err: any) => {
            err?.error?.messages?.forEach((message: any) => {
              this.toastr.error(message.message, 'Error', {
                closeButton: true,
              });
            });
            this.isLoading = false;
          },
        })


      }
    });
  }

  private closeDialog() {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }


  exportExcel(masterList: any[]) {
    const headers = this.tableHeaders.map(h => h.name);
    const exportData = masterList.map((item, index) => {
      return this.tableHeaders.map(h => {
        if (h.property === 'sn') {
          return index + 1;
        }
        if (h.status === true) {
          return item[h.property] === true ? 'Active' : 'Inactive';
        }
        return item[h.property] ?? '-';
      });
    });

    this.excelService.exportExcel('Users', headers, exportData);
  }

}
