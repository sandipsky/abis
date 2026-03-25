// import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { RolesService } from '../roles-permission.service';
// import { Menu } from '../../../shared/components/menu/menu';
// import { AuthService } from '../../../auth/auth.service';
// import { ConfigurationService } from '../../../shared/services/configuration.service';

// @Component({
//   selector: 'app-roles-permission',
//   imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, MatButtonModule, Menu],
//   templateUrl: './add-roles-permission.html',
//   standalone: true
// })
// export class AddEmployeeComponent {
//   modalForm: FormGroup;
//   isLoading = false;
//   dateType = 'BS';
//   activeTab: string = '';
//   activeModule: any;
//   permissionList: any[] = [];
//   scopeList: string[] = ['SELF', 'TEAM', 'ORG'];
//   selectedOperations: any[] = [];
//   openAccordionIndex: number | null = null;
//   activeTabIndex = 0;

//   operationList: any[] = [];

//   constructor(
//     private rolespermissionService: RolesService,
//     private authService: AuthService,
//     private toastr: ToastrService,
//     private dialogRef: MatDialogRef<any>,
//     private fb: FormBuilder,
//     private configService: ConfigurationService,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.modalForm = this.fb.nonNullable.group({
//       id: [],
//       code: [],
//       name: [, Validators.required],
//       active_status: [true],
//       description: [],
//     });

//     this.isLoading = true;

//     const roleId = data?.formData?.id ?? 0;

//     if (data?.formData?.id) {
//       this.modalForm.get('id')?.setValue(roleId);
//     }

//     this.rolespermissionService.getRolesAndOperations(roleId).subscribe({
//       next: (res: any) => {
//         if (data?.formData?.id) {
//           this.modalForm.patchValue(res);
//           if (data?.mode == 'copy') {
//             this.modalForm.patchValue({
//               id: null,
//               code: null,
//               name: null
//             });
//           }
//         }

//         this.permissionList = this.groupPermissions(res?.role_permissions) || [];

//         if (this.permissionList.length > 1) {
//           this.activeTab = this.permissionList[0].parent_module;
//           this.activeModule = this.permissionList[0];
//         }

//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.toastr.error(err || 'Failed to get roles-permission details.', 'Error');
//         this.isLoading = false;
//       }
//     });

//   }

//   selectTab(parent: any) {
//     // this.activeTab = parent.parent_module;
//     // this.activeModule = parent;
//     this.activeTabIndex = parent;
//     this.activeModule = this.permissionList[parent];
//     this.openAccordionIndex = null;
//   }

//   trackByParent(index: number, item: any) {
//     return item.parent_module;
//   }

//   trackByModule(index: number, item: any) {
//     return item.module_name;
//   }

//   /* ===================== OPERATION LEVEL ===================== */
//   checkPermission(event: Event, operation: any): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     operation.selected = checked;
//   }

//   /* ===================== MODULE LEVEL ===================== */
//   isAllSelected(module: any): boolean {
//     if (!module?.operations || module.operations.length === 0) return false;
//     return module.operations.every((op: any) => op.selected === true);
//   }

//   checkAll(event: Event, module: any): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     module?.operations?.forEach((op: any) => {
//       op.selected = checked;
//     });
//   }

//   /* ===================== MASTER MODULE LEVEL ===================== */
//   isMasterAllSelected(master: any): boolean {
//     if (!master?.modules || master.modules.length === 0) return false;

//     return master.modules.every((module: any) =>
//       module.operations.every((op: any) => op.selected === true)
//     );
//   }

//   checkAllMaster(event: Event, master: any): void {
//     const checked = (event.target as HTMLInputElement).checked;

//     master?.modules?.forEach((module: any) => {
//       module?.operations?.forEach((op: any) => {
//         op.selected = checked;
//       });
//     });
//   }

//   toggleAccordion(index: number) {
//     if (this.openAccordionIndex == index) {
//       this.openAccordionIndex = null
//     }
//     else {
//       this.openAccordionIndex = index;
//     }
//   }


//   groupPermissions(data: any[]) {
//     const parentMap: any = {};

//     data?.forEach(item => {
//       const parentModule = item.parent_module;

//       /* ---------------- Parent Module ---------------- */
//       if (!parentMap[parentModule]) {
//         parentMap[parentModule] = {
//           parent_module: parentModule,
//           master_modules: {}
//         };
//       }

//       const masterMap = parentMap[parentModule].master_modules;

//       /* ---------------- Master Module ---------------- */
//       if (!masterMap[item.master_module]) {
//         masterMap[item.master_module] = {
//           master_module: item.master_module,
//           _tempScope: null,
//           modules: {}
//         };
//       }

//       const moduleMap = masterMap[item.master_module].modules;

//       /* ---------------- Module ---------------- */
//       if (!moduleMap[item.module_name]) {
//         moduleMap[item.module_name] = {
//           module_name: item.module_name,
//           masterOrderNo: item.masterOrderNo,
//           orderNo: item.orderNo,
//           is_organizational: item.is_organizational,
//           _tempScope: null,
//           operations: []
//         };
//       }

//       /* ---------------- Operations ---------------- */
//       moduleMap[item.module_name].operations.push(...item.operations);
//     });

//     /* -------- Convert maps to arrays -------- */
//     const result = Object.values(parentMap).map((parent: any) => ({
//       parent_module: parent.parent_module,
//       master_modules: Object.values(parent.master_modules).map((master: any) => ({
//         master_module: master.master_module,
//         modules: Object.values(master.modules)
//       }))
//     }));

//     return result;
//   }


//   getOperationAction(name: string): string {
//     if (!name) return '';
//     // Case 1: Dot notation (IAM.Role.Reactivate)
//     if (name.includes('.')) {
//       return name.split('.').pop()!;
//     }
//     // Case 2: Normal sentence (View Sales Dispatch Report)
//     return name.split(' ')[0];
//   }

//   assignScope(operation: any) {
//     operation.scope = operation._tempScope || null;
//   }

//   assignBulkScope(module: any) {
//     if (!module._tempScope) {
//       this.toastr.warning('Please select scope first', 'Warning');
//       return;
//     }

//     module?.operations?.forEach((op: any) => {
//       op.scope = module._tempScope;
//     });
//   }

//   assignBulkMasterScope(masterModule: any) {
//     if (!masterModule._tempScope) {
//       this.toastr.warning('Please select scope first', 'Warning');
//       return;
//     }

//     masterModule?.modules?.forEach((module: any) => {
//       module?.operations?.forEach((op: any) => {
//         op.scope = masterModule._tempScope;
//       });
//     });
//   }

//   ngOnInit() {
//     this.operationList = this.authService.userPermissionList();
//     this.configService.companyDetails$.subscribe((c) => {
//       this.dateType = c.calendar_format;
//     });
//   }

//   get f() { return this.modalForm.controls; }

//   setDate(e: any, formControl: any) {
//     this.f[formControl].setValue(e);
//   }

//   saveForm() {
//     this.modalForm.markAllAsTouched();
//     if (this.modalForm.invalid) {
//       return;
//     }

//     let operations: any[] = [];
//     this.permissionList.forEach(parent => {
//       parent.master_modules.forEach((master: any) => {
//         master.modules.forEach((module: any) => {
//           module.operations.forEach((operation: any) => {
//             if (operation.selected == true) {
//               operations.push({ id: operation?.id, operation_id: operation?.id, scope: operation?.scope || null });
//             }
//           })
//         })
//       })
//     })

//     const formData: any = { ...this.modalForm.value, role_operation_scope: operations, operations: operations };

//     const request$ = formData.id != null
//       ? this.rolespermissionService.updateRolesAndOperations(formData, formData.id)
//       : this.rolespermissionService.createRolesAndOperations(formData);

//     request$.subscribe({
//       next: (res: any) => {
//         if (res?.success == true) {
//           this.isLoading = false;
//           this.closeDialog(res);
//           res?.messages?.forEach((message: any) => {
//             this.toastr.success(message.message, 'Success', {
//               closeButton: true,
//             });
//           });

//         }
//         else {
//           res?.messages?.forEach((message: any) => {
//             this.toastr.error(message.message, 'Error', {
//               closeButton: true,
//             });
//           });
//           this.isLoading = false;
//         }
//       },
//       error: (err) => {
//         err?.error?.messages?.forEach((message: any) => {
//           this.toastr.error(message.message, 'Error', {
//             closeButton: true,
//           });
//         });
//         this.isLoading = false;
//       },
//     })
//   }

//   public closeDialog(data?: any) {
//     this.dialogRef.removePanelClass('slide-up');
//     this.dialogRef.addPanelClass('slide-down');

//     setTimeout(() => {
//       if (data) {
//         this.dialogRef.close({
//           ...this.modalForm.value,
//           id: data.post_data_id,
//         });
//       }
//       else {
//         this.dialogRef.close();
//       }

//     }, 400);
//   }
// }
