// import { Component, Inject, inject } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared/shared.module';
// import { DropdownsService } from 'src/app/services/dropdowns.service';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
// import { FormValidationDirective } from 'src/app/components/input-validator-directive/required-field.directive';
// import { accountTypeDropDown, parentAccountDropDown } from 'src/app/models/dropdown.model';
// import { UnitMasterService } from '../../master.service';

// @Component({
//   selector: 'app-add-master-account',
//   imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, SharedModule, FormValidationDirective],
//   templateUrl: './add-master-account.html',
//   standalone: true
// })
// export class AddMasterAccountComponent {
//   modalForm: FormGroup;
//   endPoint = 'accountMaster';
//   isLoading = false;
//   companyDetails: any;
//   selectedSubAccount: any;

//   public parentData: parentAccountDropDown[] = [];
//   public accountTypeDropDown: accountTypeDropDown[] = [];

//   constructor(
//     private masterService: UnitMasterService,
//     private toastr: ToastrService,
//     private dialogRef: MatDialogRef<any>,
//     private dropdown: DropdownsService,
//     private configService: ConfigServiceService,
//     private fb: FormBuilder,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.modalForm = this.fb.nonNullable.group({
//       id: null,
//       account_name: ['', Validators.required],
//       account_code: [null],
//       account_type: [, Validators.required],
//       parent_id: [null],
//       parent_account: [],
//       active_status: [true],
//       remarks: [null]
//     });

//     if (data?.formData) {
//       this.modalForm.patchValue(data?.formData);
//       this.selectedSubAccount = data?.formData;
//     }
//   }

//   ngOnInit() {
//     this.getAccTypeDropdown();
//     if (!this.data?.formData?.id) {
//       this.masterService.getAccountCode().subscribe((res: string) => {
//         this.modalForm.patchValue({ account_code: res })
//       });
//     }
//   }

//   get f() { return this.modalForm.controls; }

//   getCompanyInfo() {
//     this.configService.companyDetails$.subscribe((c) => {
//       this.companyDetails = c;
//     });
//   }

//   public getAccTypeDropdown(): void {
//     this.dropdown.getAccountTypes().subscribe({
//       next: (res: any) => {
//         this.accountTypeDropDown = res;
//         let accTypes: any[] = [];
//         this.accountTypeDropDown.forEach(item => {
//           item.types.forEach(account => {
//             accTypes.push({ id: account, name: account })
//           });
//         })
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

//   public getSelectedMaster($event: any) {
//     this.getParentType($event.target.value);
//   }

//   public getParentType(parentType: String): void {
//     if (this.modalForm.value?.account_type?.length > 0) {
//       this.dropdown.getParentAccountDropDown(parentType).subscribe({
//         next: (res: any) => {
//           this.parentData = res.filter((items: any) => items.name !== this.modalForm.value.account_name)
//         },
//         error: (err) => {
//           this.toastr.error(err)
//         },
//       })
//     }
//     else {
//       this.parentData = [];
//     }
//   }

//   saveForm() {
//     this.modalForm.markAllAsTouched();
//     if (this.modalForm.invalid) {
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.modalForm.value;
//     Object.keys(formData).forEach(key => {
//       if (formData[key] === '') {
//         formData[key] = null;
//       }
//     });

//     const request$ = formData.id
//       ? this.masterService.updateMaster(formData, formData.id, this.endPoint)
//       : this.masterService.createMaster(formData, this.endPoint);

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
//     this.dialogRef.removePanelClass('slide-left');
//     this.dialogRef.addPanelClass('slide-left-close');

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
