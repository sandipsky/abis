import { CommonModule } from '@angular/common';
import { Component, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../shared/shared-module';
import { MasterService } from '../master/master.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';
import { DropdownsService } from '../../shared/services/dropdown.service';
import { ExcelService } from '../../shared/services/excel.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { AddProducts } from './add-products/add-products';



@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  standalone: true,
  imports: [CommonModule, SharedModule]
})

export class Products {
  endPoint: string = 'products';
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

  tableHeaders: any[] = [];

  public allCatrgories: Array<any> = [];
  public allGroups: Array<any> = [];
  public allCompanies: Array<any> = [];
  public allDivisions: any;
  public allGenericNames: Array<any> = [];
  public allPackings: Array<any> = [];
  public allTaxTypes: Array<any> = [];
  public allUnits: Array<any> = [];

  filterList: any[] = [];
  @ViewChild('view', { static: true }) view!: TemplateRef<any>;

  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<any>,
    private excelService: ExcelService,
    private configService: ConfigurationService,
    private dropdown: DropdownsService

  ) { }

  ngOnInit(): void {
    this.operationList = this.authService.userPermissionList();
    this.getMasterList();
    this.getAllProducts();

    this.configService.companyDetails$.subscribe((c) => {
      this.companyDetails = c;
      this.tableHeaders = [
        { name: 'SN', property: 'sn', sort: false },

        { name: 'Product Name', property: 'name', sortBy: 'name', sort: true },
        { name: 'Code', property: 'product_code', sortBy: 'productCode', sort: true },
        { name: 'Category', property: 'category_name', sortBy: 'productCategoriesString', sort: true },
        { name: 'Product Type', property: 'product_type', sortBy: 'productType', sort: true },
        { name: 'Primary Unit', property: 'primary_unit_name', sortBy: 'primaryUnit_name', sort: true },
        { name: 'Packing', property: 'packing', sortBy: 'packing.name', sort: true },

        ...(this.companyDetails?.company_reg_type !== 'PAN'
          ? [{ name: 'Tax Type', property: 'tax_type_name', sortBy: 'taxType.name', sort: true }]
          : []),

        { name: 'Status', property: 'status', sort: false, status: true, editStatus: false }
      ];
    });
  }

  getAllProducts(): void {
    this.dropdown.getAllProductDropdownInfo()
      .subscribe((productInfo: any) => {
        this.allCatrgories = productInfo.categories;
        this.allCompanies = productInfo.companies;
        this.allDivisions = productInfo.divisions;
        this.allGenericNames = productInfo.generic_names;
        this.allPackings = productInfo.packings;
        this.allTaxTypes = productInfo.tax_types;
        this.allUnits = productInfo.units;
        this.allGroups = productInfo.product_groups;

        this.filterColumns = [
          {
            name: "Product",
            formcontrolName: "name",
            type: "text",
          },
          {
            name: "Product Code",
            formcontrolName: "productCode",
            type: "text",
          },
          {
            name: "Product Category",
            formcontrolName: "productCategory.id",
            type: "select",
            data: this.allCatrgories
          },
          {
            name: "Product Group",
            formcontrolName: "productGroup_id",
            type: "select",
            data: this.allGroups
          },
          {
            name: "Unit",
            type: "select",
            formcontrolName: "primaryUnit_id",
            data: this.allUnits
          },
          {
            name: "Packing",
            type: "select",
            formcontrolName: "packing_id",
            data: this.allPackings
          },
          {
            name: "Tax Type",
            type: "select",
            formcontrolName: "taxType_id",
            data: this.allTaxTypes
          },
          {
            name: "Division",
            type: "select",
            formcontrolName: "division.id",
            data: this.allDivisions
          },
          {
            name: "Type",
            type: "select",
            formcontrolName: "type",
            data: [{ name: "Purchasable", id: "purchasable" }, { name: "Sellable", id: "sellable" }]
          },
          {
            name: "Status",
            type: "select",
            formcontrolName: "status",
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
            this.masterList = res?.content || [];
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
    this.dialogRef = this.dialog.open(AddProducts, {
      panelClass: ['drawer-top', 'slide-up'],
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
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }


  exportExcel(masterList: any[]) {
    
  }

}
