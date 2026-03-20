// import { Component, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { PageEvent } from '@angular/material/paginator';
// import { AddVendorsComponent } from './add-vendors/add-vendors.component';
// import { Table } from '../../../shared/components/table/table';
// import { SharedModule } from '../../../shared/shared-module';
// import { MasterService } from '../master.service';
// import { AuthService } from '../../../auth/auth.service';
// import { DeleteModalComponent } from '../../../shared/components/delete-modal/delete-modal.component';

// @Component({
//   selector: 'app-vendors',
//   templateUrl: './vendors.component.html',
//   standalone: true,
//   imports: [CommonModule, SharedModule, Table]
// })

// export class VendorsComponent {
//   endPoint: string = 'vendors';
//   masterList: any[] = [];
//   length: number = 0;
//   searchText: string = '';

//   operationList: Array<string> = [];
//   isLoading: boolean = false;

//   filterColumns: any[] = [
//     {
//       name: "Vendor Name",
//       formcontrolName: "name",
//       type: "text",
//     },
//     {
//       name: "Registration No",
//       formcontrolName: "registrationNo",
//       type: "text",
//     },
//     {
//       name: "Contact No",
//       formcontrolName: "contactNo",
//       type: "text",
//     },
//     {
//       name: "Address",
//       formcontrolName: "address",
//       type: "text",
//     },
//     {
//       name: "Status",
//       type: "select",
//       formcontrolName: "status",
//       data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
//     }
//   ];

//   filterForm = {
//     pageIndex: 0,
//     pageSize: 25,
//     sortBy: '',
//     sortDirection: '',
//   }

//   tableHeaders = [
//     { name: 'SN', property: 'sn', sort: false },
//     { name: 'Vendor Name', property: 'name', sortBy: 'name', sort: true },
//     { name: 'Registration No.', property: 'registration_no', sortBy: 'registrationNo', sort: true },
//     { name: 'Contact No.', property: 'contact_no', sortBy: 'contactNo', sort: true },
//     { name: 'Address', property: 'address', sortBy: 'address', sort: true },
//     { name: 'Status', property: 'status', sortBy: 'status', sort: false, status: true, editStatus: false }
//   ];

//   filterList: any[] = [];
//   @ViewChild('view', { static: true }) view!: TemplateRef<any>;

//   constructor(
//     private masterService: MasterService,
//     private toastr: ToastrService,
//     private authService: AuthService,
//     private dialog: MatDialog,
//     @Optional() private dialogRef: MatDialogRef<any>,
//     // private excelService: ExcelService,
//   ) { }

//   ngOnInit(): void {
//     // this.operationList = this.authService.userPermissionList();
//     this.getMasterList();
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
//     this.dialogRef = this.dialog.open(AddVendorsComponent, {
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

//   pdfprint() {
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

//     // this.excelService.exportExcel('vendors', headers, exportData);
//   }

// }
