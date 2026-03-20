import { Component, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { masterModel } from '../master.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '../../../shared/shared-module';
import { DeleteModalComponent } from '../../../shared/components/delete-modal/delete-modal.component';
import { MastersInlineModalComponent } from './add-master-modal/add-master-modal';
import { MasterService } from '../master.service';
import { DropdownsService } from '../../../shared/services/dropdown.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule]
})

export class GeneralMasterComponent {
  @Input() endPoint: string = '';
  @Input() masterName: string = '';
  @Input() createMasterPermissionName: string = '';
  @Input() editMasterPermissionName: string = '';
  @Input() deleteMasterPermissionName: string = '';
  @Input() exportMasterPermissionName: string = '';
  @Input() printMasterPermissionName: string = '';

  masterList: Array<masterModel> = [];
  masterSelected: boolean = false;
  isSelected: boolean = false;
  checklist: any;
  checkedList: any[] = [];
  checkedItems: any[] = [];
  companyList: any[] = [];
  listLength: number = 0;
  length: number = 0;

  sortedData: Array<masterModel> = [];
  searchText: string = '';
  operationList: Array<string> = [];
  isLoading: boolean = false;

  filterColumns: any[] = [
    {
      name: "Status",
      type: "select",
      formcontrolName: "status",
      data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
    }
  ];

  filterForm = {
    pageIndex: 0,
    pageSize: 25,
    sortBy: 'name',
    sortDirection: 'asc',
  }
  filterList: any[] = [];

  @ViewChild('view', { static: true }) view!: TemplateRef<any>;

  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<any>,
    // private excelService: ExcelService,
    private dropDownService: DropdownsService
  ) { }

  ngOnInit(): void {
    // this.operationList = this.authService.userPermissionList();
    this.getMasterList();
    this.filterColumns.unshift({
      name: this.masterName,
      formcontrolName: "name",
      type: "text"
    })
    if (this.masterName == 'Transport') {
      this.filterColumns.splice(1, 0, {
        name: "Contact No.",
        formcontrolName: "contactNo",
        type: "text"
      })
    }
    if (this.masterName == 'Division') {
      this.getCompaniesDropDown();
    }
  }

  getCompaniesDropDown() {
    this.dropDownService.getCompaniesDropDown().subscribe({
      next: (res: any) => {
        this.companyList = [...res];
        this.filterColumns.splice(1, 0, {
          name: "Company",
          formcontrolName: "company_id",
          type: "select",
          data: this.companyList
        })
      },
      error: (err) => {
        this.toastr.error(err)
      },
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

  checkUncheckAll(event: any) {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList(event);
  }

  isAllSelected(event: any) {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList(event);
  }

  getCheckedItemList(event: any) {
    this.checkedList = [];
    this.checkedItems = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected) {
        this.checkedList.push(this.checklist[i].id);
        this.checkedItems.push(this.checklist[i]);
      }

    }
    this.listLength = this.checkedList.length
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
          field: this.filterForm.sortBy || 'name',
          orderType: this.filterForm.sortDirection || 'asc',
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
            this.masterList = res?.content || [];
            this.checklist = res?.content || [];
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

  openAddModal(master?: any) {
    const item = { title: this.masterName, endPoint: this.endPoint, formData: master || {}, companies: this.companyList }
    const dialogRef = this.dialog.open(MastersInlineModalComponent, {
      data: { item: item },
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
      if (result) {
        this.getMasterList();
      }
    });
  }

  selectedCategory: any;

  openView(master: any) {
    this.selectedCategory = master;
    this.dialogRef = this.dialog.open(this.view, {
      panelClass: ['slide-left', 'drawer-right'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.closeView();
    });
  }

  closeView() {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }

  openDelete(master?: any): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: { id: (master?.id || this.checkedList), name: master?.name, items: this.checkedItems, endPoint: this.endPoint, mutiple: (master == undefined ? true : false) }
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
        this.getMasterList();
        this.checkedItems = [];
        this.checkedList = [];
        this.checklist = [];
        this.listLength = 0;
      }
    });
  }

  exportExcel(masterList: masterModel[]) {
    let headers: string[] = ['SN', this.masterName];
    if (this.masterName === 'Tax Type') {
      headers.push('Tax Rate(%)');
      headers.push('Remarks');
    }
    if (this.masterName === 'Division') {
      headers.push('Company');
    }
    if (this.masterName === 'Discount Category') {
      headers.push('Discount Type');
      headers.push('Applied On');
    }
    if (this.masterName === 'Transport') {
      headers.push('Contact No.');
    }
    headers.push('Status');
    let exportData: any[] = [];
    masterList.forEach((item, index) => {
      const rowData: any[] = [
        index + 1,
        item.name
      ];
      if (this.masterName === 'Tax Type') {
        rowData.push(item.tax_rate || '-');
        rowData.push(item.remarks || '-');
      }
      if (this.masterName === 'Division') {
        rowData.push(item.company_name || '-');
      }
      if (this.masterName === 'Discount Category') {
        rowData.push(item.discount_type || '-');
        rowData.push(item.apply_on || '-');
      }
      if (this.masterName === 'Transport') {
        rowData.push(item.contact_no || '-');
      }
      rowData.push(item.status === true ? 'Active' : 'Inactive')
      exportData.push(rowData);
    });
    // this.excelService.exportExcel(this.masterName, headers, exportData);
  }

}
