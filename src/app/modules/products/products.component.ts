// import { Component, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from 'src/app/auth/auth.service';
// import { ExcelService } from 'src/app/services/excel.service';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared/shared.module';
// import { PageEvent } from '@angular/material/paginator';
// import { DropdownsService } from 'src/app/services/dropdowns.service';
// import { AddProductsComponent } from './add-products/add-products.component';
// import { Table } from 'src/app/components/table/table';
// import { DeleteModalComponent } from 'src/app/components/delete-modal/delete-modal.component';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
// import { masterModel } from 'src/app/master/master.model';
// import { UnitMasterService } from '../master.service';


// @Component({
//   selector: 'app-products',
//   templateUrl: './products.component.html',
//   standalone: true,
//   imports: [CommonModule, SharedModule, Table]
// })

// export class ProductsComponent {
//   endPoint: string = 'products';
//   masterList: any[] = [];
//   length: number = 0;
//   searchText: string = '';
//   companyDetails: any;

//   operationList: Array<string> = [];
//   isLoading: boolean = false;

//   filterColumns: any[] = [];

//   filterForm = {
//     pageIndex: 0,
//     pageSize: 25,
//     sortBy: '',
//     sortDirection: '',
//   }

//   tableHeaders: any[] = [];

//   public allCatrgories: Array<masterModel> = [];
//   public allGroups: Array<masterModel> = [];
//   public allCompanies: Array<masterModel> = [];
//   public allDivisions: any;
//   public allGenericNames: Array<masterModel> = [];
//   public allPackings: Array<masterModel> = [];
//   public allTaxTypes: Array<masterModel> = [];
//   public allUnits: Array<masterModel> = [];

//   filterList: any[] = [];
//   @ViewChild('view', { static: true }) view!: TemplateRef<any>;

//   constructor(
//     private masterService: UnitMasterService,
//     private toastr: ToastrService,
//     private authService: AuthService,
//     private dialog: MatDialog,
//     @Optional() private dialogRef: MatDialogRef<any>,
//     private excelService: ExcelService,
//     private configService: ConfigServiceService,
//     private dropdown: DropdownsService

//   ) { }

//   ngOnInit(): void {
//     this.operationList = this.authService.userPermissionList();
//     this.getMasterList();
//     this.getAllProducts();

//     this.configService.companyDetails$.subscribe((c) => {
//       this.companyDetails = c;
//       this.tableHeaders = [
//         { name: 'SN', property: 'sn', sort: false },

//         { name: 'Product Name', property: 'name', sortBy: 'name', sort: true },
//         { name: 'Code', property: 'product_code', sortBy: 'productCode', sort: true },
//         { name: 'Category', property: 'category_name', sortBy: 'productCategoriesString', sort: true },
//         { name: 'Product Type', property: 'product_type', sortBy: 'productType', sort: true },
//         { name: 'Primary Unit', property: 'primary_unit_name', sortBy: 'primaryUnit_name', sort: true },
//         { name: 'Packing', property: 'packing', sortBy: 'packing.name', sort: true },

//         ...(this.companyDetails?.company_reg_type !== 'PAN'
//           ? [{ name: 'Tax Type', property: 'tax_type_name', sortBy: 'taxType.name', sort: true }]
//           : []),

//         { name: 'Status', property: 'status', sort: false, status: true, editStatus: false }
//       ];
//     });
//   }

//   getAllProducts(): void {
//     this.dropdown.getAllProductDropdownInfo()
//       .subscribe((productInfo: any) => {
//         this.allCatrgories = productInfo.categories;
//         this.allCompanies = productInfo.companies;
//         this.allDivisions = productInfo.divisions;
//         this.allGenericNames = productInfo.generic_names;
//         this.allPackings = productInfo.packings;
//         this.allTaxTypes = productInfo.tax_types;
//         this.allUnits = productInfo.units;
//         this.allGroups = productInfo.product_groups;

//         this.filterColumns = [
//           {
//             name: "Product",
//             formcontrolName: "name",
//             type: "text",
//           },
//           {
//             name: "Product Code",
//             formcontrolName: "productCode",
//             type: "text",
//           },
//           {
//             name: "Product Category",
//             formcontrolName: "productCategory.id",
//             type: "select",
//             data: this.allCatrgories
//           },
//           {
//             name: "Product Group",
//             formcontrolName: "productGroup_id",
//             type: "select",
//             data: this.allGroups
//           },
//           {
//             name: "Unit",
//             type: "select",
//             formcontrolName: "primaryUnit_id",
//             data: this.allUnits
//           },
//           {
//             name: "Packing",
//             type: "select",
//             formcontrolName: "packing_id",
//             data: this.allPackings
//           },
//           {
//             name: "Tax Type",
//             type: "select",
//             formcontrolName: "taxType_id",
//             data: this.allTaxTypes
//           },
//           {
//             name: "Division",
//             type: "select",
//             formcontrolName: "division.id",
//             data: this.allDivisions
//           },
//           {
//             name: "Type",
//             type: "select",
//             formcontrolName: "type",
//             data: [{ name: "Purchasable", id: "purchasable" }, { name: "Sellable", id: "sellable" }]
//           },
//           {
//             name: "Status",
//             type: "select",
//             formcontrolName: "status",
//             data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
//           }
//         ];
//       })
//   }

//   applyFilter(filters: any[]) {
//     this.filterList = filters;
//     this.filterForm.pageIndex = 0;
//     this.getMasterList();
//   }

//   onChangedPage(pageData: PageEvent) {
//     this.filterForm.pageIndex = pageData.pageIndex;
//     this.filterForm.pageSize = pageData.pageSize;
//     this.getMasterList();
//   }

//   onSort({ column, direction }: any) {
//     this.filterForm.sortBy = column;
//     this.filterForm.sortDirection = direction;
//     this.getMasterList();
//   }


//   getMasterList(isExport?: boolean): void {
//     let filter = {
//       filter: this.filterList || [],
//       pagination: {
//         pageIndex: isExport == true ? 0 : (this.filterForm.pageIndex || 0),
//         pageSize: isExport == true ? (this.length || 9999999) : (this.filterForm.pageSize || 25),
//       },
//       sortDTO: [
//         {
//           field: this.filterForm.sortBy || 'id',
//           orderType: this.filterForm.sortDirection || 'desc',
//         },
//       ],
//     };

//     this.isLoading = true;
//     this.masterService.getMasterList(filter, this.endPoint).subscribe(
//       {
//         next: (res: any) => {
//           if (isExport == true) {
//             this.exportExcel(res?.content);
//             this.isLoading = false;
//           }
//           else {
//             this.masterList = [];
//             this.masterList = res?.content || [];
//             this.length = res?.totalElements || 0;
//             this.isLoading = false;
//           }
//         },
//         error: (err) => {
//           this.toastr.error(err);
//           this.isLoading = false;
//         },
//       }
//     )
//   }

//   showForm(data?: any, isView?: boolean) {
//     this.dialogRef = this.dialog.open(AddProductsComponent, {
//       panelClass: ['drawer-right', 'slide-left'],
//       enterAnimationDuration: '0ms',
//       exitAnimationDuration: '0ms',
//       disableClose: true,
//       data: {
//         formData: data,
//         isView: isView
//       }
//     });

//     this.dialogRef.backdropClick().subscribe(() => {
//       this.closeDialog();
//     });

//     this.dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.getMasterList();
//       }
//     });
//   }

//   deleteItem(data: any) {
//     this.dialogRef = this.dialog.open(DeleteModalComponent, {
//       panelClass: 'slide-up',
//       enterAnimationDuration: '0ms',
//       exitAnimationDuration: '0ms',
//       disableClose: true,
//       data: {
//         name: data.name
//       }
//     });

//     this.dialogRef.backdropClick().subscribe(() => {
//       this.dialogRef.removePanelClass('slide-up');
//       this.dialogRef.addPanelClass('slide-up-close');

//       setTimeout(() => {
//         this.dialogRef.close();
//       }, 400);
//     });

//     this.dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.isLoading = true;
//         this.masterService.deleteMaster(data.id, this.endPoint).subscribe({
//           next: (res: any) => {
//             res.messages.forEach((message: any) => {
//               if (res.success == true) {
//                 res?.messages?.forEach((message: any) => {
//                   this.toastr.success(message.message, 'Success', {
//                     closeButton: true,
//                   });
//                 });
//                 this.isLoading = false;
//                 this.getMasterList();
//               } else {
//                 res?.messages?.forEach((message: any) => {
//                   this.toastr.error(message.message, 'Error', {
//                     closeButton: true,
//                   });
//                 });
//                 this.isLoading = false;
//               }
//             });
//           },

//           error: (err: any) => {
//             err?.error?.messages?.forEach((message: any) => {
//               this.toastr.error(message.message, 'Error', {
//                 closeButton: true,
//               });
//             });
//             this.isLoading = false;
//           },
//         })


//       }
//     });
//   }

//   private closeDialog() {
//     this.dialogRef.removePanelClass('slide-left');
//     this.dialogRef.addPanelClass('slide-left-close');

//     setTimeout(() => {
//       this.dialogRef.close();
//     }, 400);
//   }


//   exportExcel(masterList: any[]) {
//     const headers = this.tableHeaders.map(h => h.name);
//     const exportData = masterList.map((item, index) => {
//       return this.tableHeaders.map(h => {
//         if (h.property === 'sn') {
//           return index + 1;
//         }
//         if (h.status === true) {
//           return item[h.property] === true ? 'Active' : 'Inactive';
//         }
//         return item[h.property] ?? '-';
//       });
//     });

//     this.excelService.exportExcel('Products', headers, exportData);
//   }

// }
