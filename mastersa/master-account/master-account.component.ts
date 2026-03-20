// import { Component, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { PageEvent } from '@angular/material/paginator';
// import { AddMasterAccountComponent } from './add-master-account/add-master-account.component';
// import { SharedModule } from '../../../shared/shared-module';



// @Component({
//   selector: 'app-master-account',
//   templateUrl: './master-account.component.html',
//   standalone: true,
//   imports: [CommonModule, SharedModule]
// })

// export class MasterAccountComponent {
//   masterList: any[] = [];
//   length: number = 0;
//   searchText: string = '';

//   operationList: Array<string> = [];
//   isLoading: boolean = false;

//   filterColumns: any[] = [];

//   filterForm = {
//     pageIndex: 0,
//     pageSize: 25,
//     sortBy: '',
//     sortDirection: '',
//   }

//   tableHeaders = [
//     { name: 'SN', property: 'sn', sort: false },
//     { name: 'Account Name', property: 'account_name', sortBy: 'accountName', sort: true },
//     { name: 'Account Code', property: 'account_code', sortBy: 'accountCode', sort: true },
//     { name: 'Account Type', property: 'account_type', sortBy: 'accountType', sort: true },
//     { name: 'Parent Account', property: 'parent_name', sortBy: 'address', sort: false },
//     { name: 'Status', property: 'active_status', sortBy: 'status', sort: false, status: true, editStatus: false }
//   ];

//   filterList: any[] = [];
//   @ViewChild('view', { static: true }) view!: TemplateRef<any>;

//   constructor(
//     // private accountService: AccountService,
//     private toastr: ToastrService,
//     // private authService: AuthService,
//     private dialog: MatDialog,
//     @Optional() private dialogRef: MatDialogRef<any>,
//     // private excelService: ExcelService,
//     // private dropdown: DropdownsService,
//   ) { }

//   ngOnInit(): void {
//     // this.operationList = this.authService.userPermissionList();
//     this.getAccTypeDropdown();
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

//   public getAccTypeDropdown(): void {
//     this.dropdown.getAccountTypes().subscribe({
//       next: (res: any) => {
//         let accTypes: any[] = [];
//         res.forEach((item: any) => {
//           item.types.forEach((account: any) => {
//             accTypes.push({ id: account, name: account })
//           });
//         });
//         this.filterColumns = [
//           {
//             name: "Account Name",
//             formcontrolName: "accountName",
//             type: "text",
//           },
//           {
//             name: "Account Code",
//             formcontrolName: "accountCode",
//             type: "text",
//           },
//           {
//             name: "Account type",
//             formcontrolName: "accountType",
//             type: "select",
//             data: accTypes
//           },
//           {
//             name: "Parent Account",
//             formcontrolName: "parentAccountName",
//             type: "text",
//           },
//           {
//             name: "Status",
//             type: "select",
//             formcontrolName: "activeStatus",
//             data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
//           }
//         ];
//       },
//       error: (err) => {
//         err?.error?.messages?.forEach((message: any) => {
//           this.toastr.error(message.message, 'Error', {
//             closeButton: true,
//           });
//         });
//       },
//     })
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
//     this.accountService.getMasterAccountInformation(filter).subscribe(
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
//     this.dialogRef = this.dialog.open(AddMasterAccountComponent, {
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
//       this.dialogRef.removePanelClass('slide-left');
//       this.dialogRef.addPanelClass('slide-left-close');

//       setTimeout(() => {
//         this.dialogRef.close();
//       }, 400);
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
//         this.accountService.deleteMaster([data.id]).subscribe({
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

//     this.excelService.exportExcel('Accounts', headers, exportData);
//   }

// }
