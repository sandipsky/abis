import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.html',
  standalone: true,
  imports: [CommonModule, SharedModule]
})

export class GeneralMaster {
  @Input() endPoint: string = '';
  @Input() masterName: string = '';
  @Input() createMasterPermissionName: string = '';
  @Input() editMasterPermissionName: string = '';
  @Input() deleteMasterPermissionName: string = '';
  @Input() exportMasterPermissionName: string = '';
  @Input() printMasterPermissionName: string = '';

  masterList: Array<any> = [];
  masterSelected: boolean = false;
  isSelected: boolean = false;
  checklist: any;
  checkedList: any[] = [];
  checkedItems: any[] = [];
  companyList: any[] = [];
  listLength: number = 0;
  length: number = 0;

  tableHeaders: any[] = []

  sortedData: Array<any> = [];
  searchText: string = '';
  operationList: Array<string> = [];
  isLoading: boolean = false;

  filterColumns: any[] = [];

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
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.operationList = this.authService.userPermissionList();
    this.setTableHeaders();
    this.setFilter();
    this.getMasterList();
  }

  setTableHeaders() {
    this.tableHeaders = [
      { name: 'SN', property: 'sn', sort: false },
      { name: this.masterName, property: 'name', sortBy: 'name', sort: true },
      ...(this.masterName === 'Tax Type'
        ? [{ name: 'Tax Rate', property: 'rate', sortBy: 'rate', sort: true }]
        : []),
      { name: 'Status', property: 'status', sort: false, status: true }
    ];
  }

  setFilter() {
    this.filterColumns = [
      ...(this.masterName === 'Tax Type'
        ? [
          {
            name: "Tax Rate",
            type: "text",
            formcontrolName: "rate"
          }
        ]
        : []),
      {
        name: "Status",
        type: "select",
        formcontrolName: "status",
        data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
      }
    ];
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

  openAddModal(master?: MasterItem) {
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

  openDelete(master?: MasterItem): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
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
        this.getMasterList();
      }
    });
  }

  exportExcel(masterList: MasterItem[]) {
    let headers: string[] = ['SN', this.masterName];
    if (this.masterName === 'Tax Type') {
      headers.push('Tax Rate(%)');
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
      }
      rowData.push(item.status === true ? 'Active' : 'Inactive')
      exportData.push(rowData);
    });
    // this.excelService.exportExcel(this.masterName, headers, exportData);
  }

}
