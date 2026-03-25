// import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { PageEvent } from '@angular/material/paginator';
// import { AddEmployeeComponent } from './add-roles-permission/add-roles-permission.component';
// import { RolesService } from './roles-permission.service';
// import { SharedModule } from '../../shared/shared-module';
// import { AuthService } from '../../auth/auth.service';
// import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';

// @Component({
//   selector: 'app-roles-permission',
//   templateUrl: './roles-permission.html',
//   standalone: true,
//   imports: [CommonModule, SharedModule]
// })

// export class RolesPermissionComponent {
//   masterList: any[] = [];
//   length: number = 0;
//   searchText: string = '';

//   operationList: Array<string> = [];
//   isLoading: boolean = false;

//   filterColumns: any[] = [
//     {
//       name: "Role Code",
//       type: "text",
//       formcontrolName: "code"
//     },
//     {
//       name: "Status",
//       type: "select",
//       formcontrolName: "activeStatus",
//       data: [{ name: "Active", id: "1" }, { name: "Inactive", id: "0" }]
//     }
//   ];

//   filterForm = {
//     pageIndex: 0,
//     pageSize: 10,
//     sortBy: '',
//     sortDirection: '',
//   }

//   tableHeaders = [
//     { name: 'SN', property: 'sn', sort: false },
//     { name: 'Role Code', property: 'code', sortBy: 'code', sort: true },
//     { name: 'Role Name', property: 'name', sortBy: 'name', sort: true },
//     { name: 'Status', property: 'status', sortBy: 'active_status', sort: true, status: true },

//   ];

//   filterList: any[] = [];
//   @ViewChild('view', { static: true }) view!: TemplateRef<any>;

//   constructor(
//     private rolespermissionService: RolesService,
//     private toastr: ToastrService,
//     private authService: AuthService,
//     private dialog: MatDialog,
//     private dialogRef: MatDialogRef<any>,
//   ) { }

//   ngOnInit(): void {
//     this.operationList = this.authService.userPermissionList();
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


//   getMasterList(isExport?: boolean, isPDF?: boolean): void {
//     let filter = {
//       filter: this.filterList || [],
//       pagination: {
//         pageIndex: isExport == true ? 0 : (this.filterForm.pageIndex || 0),
//         pageSize: isExport == true ? (this.length || 9999999) : (this.filterForm.pageSize || 10),
//       },
//       sortDTO: [
//         {
//           field: this.filterForm.sortBy || 'id',
//           orderType: this.filterForm.sortDirection || 'desc',
//         },
//       ],
//     };

//     this.isLoading = true;
//     this.rolespermissionService.getRolesList(filter).subscribe(
//       {
//         next: (res: any) => {
//           if (isExport == true) {
//             this.exportExcel(res?.content);
//             this.isLoading = false;
//           }
//           else if (isPDF == true) {
//             this.pdfprint(res?.content);
//             this.isLoading = false;
//           }
//           else {
//             this.masterList = res?.content || [];
//             this.masterList = this.masterList.map(item => {
//               item.permissions = [{ id: 1, name: 'HR' }, { id: 1, name: 'Purchase' }, { id: 1, name: 'Sales' }, { id: 1, name: 'Sales Re' }]
//               return item;
//             })
//             this.length = res?.totalElements || 0;
//             this.isLoading = false;
//           }
//         },
//         error: (err) => {
//           this.toastr.error(err, 'Error');
//           this.isLoading = false;
//         },
//       }
//     )
//   }

//   changeStatus(data: any) {
//     this.isLoading = true;
//     this.rolespermissionService.changeRoleStatus(data, data.id).subscribe(
//       {
//         next: (res: any) => {
//           if (res?.success == true) {
//             res?.messages?.forEach((message: any) => {
//               this.toastr.success(message.message, 'Success', {
//                 closeButton: true,
//               });
//             });
//             this.isLoading = false;
//           }
//           else {
//             res?.messages?.forEach((message: any) => {
//               this.toastr.error(message.message, 'Error', {
//                 closeButton: true,
//               });
//             });
//             this.isLoading = false;
//           }
//         },
//         error: (err) => {
//           err?.error?.messages?.forEach((message: any) => {
//             this.toastr.error(message.message, 'Error', {
//               closeButton: true,
//             });
//           });
//           this.isLoading = false;
//         },
//       }
//     )
//   }

//   showForm(data?: any, isView?: boolean, type?: string) {
//     this.dialogRef = this.dialog.open(AddEmployeeComponent, {
//       panelClass: ['fullscreen', 'slide-up'],
//       enterAnimationDuration: '0ms',
//       exitAnimationDuration: '0ms',
//       disableClose: true,
//       data: {
//         formData: data,
//         isView: isView,
//         mode: type
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
//       this.closeDialog();
//     });

//     this.dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.isLoading = true;
//         this.rolespermissionService.deleteRolesAndOperations(data.id).subscribe({
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
//     this.dialogRef.removePanelClass('slide-up');
//     this.dialogRef.addPanelClass('slide-down');

//     setTimeout(() => {
//       this.dialogRef.close();
//     }, 400);
//   }

//   pdfprint(itemList: any[]) {
    
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

//     // this.excelService.exportExcel('Roles', headers, exportData);
//   }

// }
