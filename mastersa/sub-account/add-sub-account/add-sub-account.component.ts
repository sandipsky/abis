import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { DropdownsService } from 'src/app/services/dropdowns.service';
import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
import { FormValidationDirective } from 'src/app/components/input-validator-directive/required-field.directive';
import { UnitMasterService } from '../../master.service';

@Component({
  selector: 'app-add-sub-account',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, SharedModule, FormValidationDirective],
  templateUrl: './add-sub-account.html',
  standalone: true
})
export class AddSubAccountComponent {
  modalForm: FormGroup;
  endPoint = 'subAccounts';
  isLoading = false;
  companyDetails: any;
  selectedSubAccount: any;

  divisionList: any[] = [];

  constructor(
    private masterService: UnitMasterService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<any>,
    private dropDownService: DropdownsService,
    private configService: ConfigServiceService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      name: [, Validators.required],
      status: [true, Validators.required],
      reg_type: [],
      reg_no: [],
      contact_no: [],
      mobile_no: [],
      contact_person: [],
      email_address: [, Validators.email],
      remarks: [],
      address: [],
      taxType: [],
      discount_details: new FormArray([]),
    });

    if (data?.formData) {
      this.modalForm.patchValue(data?.formData);
    }

    if (data?.formData?.id) {
      this.discount_details.clear();
      this.masterService.getMasterDetail(data?.formData?.id, this.endPoint).subscribe(
        {
          next: (res: any) => {
            this.selectedSubAccount = res;

            if (this.selectedSubAccount?.registration_no) {
              const parts = this.selectedSubAccount.registration_no.split('-');
              this.selectedSubAccount.reg_type = parts[0] || null;
              this.selectedSubAccount.reg_no = parts[1] || null;
              this.modalForm.get('reg_no')?.setValidators([Validators.required]);
              this.modalForm.get('reg_no')?.updateValueAndValidity();
            }

            if (this.selectedSubAccount?.discount_details?.length > 0) {
              for (let i = 0; i < this.selectedSubAccount?.discount_details?.length; i++) {
                this.addDiscountCondition();
              }
            }
            else {
              this.discount_details.push(
                this.fb.group({
                  id: [],
                  division_id: [],
                  discount: []
                }),
              );
            }
            this.modalForm.patchValue(this.selectedSubAccount);
          },
          error: (err) => {
            err?.error?.messages?.forEach((message: any) => {
              this.toastr.error(message.message, 'Error', {
                closeButton: true,
              });
            });
          },

        }
      )
    }
  }

  ngOnInit() { }

  get f() { return this.modalForm.controls; }

  get discount_details(): any {
    return this.modalForm.get('discount_details') as FormArray;
  }

  addDiscountCondition() {
    this.discount_details.push(
      this.fb.group({
        id: [],
        division_id: [, Validators.required],
        discount: [, Validators.required],
      }),
    );
  }

  removeDiscountCondition(index: number) {
    this.discount_details.removeAt(index);
  }


  setRegType(type: string) {
    this.modalForm.get('reg_type')?.setValue(type);
    this.modalForm.get('reg_no')?.setValidators([Validators.required]);
    this.modalForm.get('reg_no')?.updateValueAndValidity();
  }

  getCompanyInfo() {
    this.configService.companyDetails$.subscribe((c) => {
      this.companyDetails = c;
    });
  }

  getDivisionList() {
    this.dropDownService.getDivisionDropdown().subscribe({
      next: (res: any) => {
        this.divisionList = [...res];
      },
      error: (err) => {
        err?.error?.messages?.forEach((message: any) => {
          this.toastr.error(message.message, 'Error', {
            closeButton: true,
          });
        });
      },
    })
  }

  isRequiredEmailInvalid(fieldName: string): boolean {
    const field = this.modalForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['email']
    );
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.modalForm.value;
    Object.keys(formData).forEach(key => {
      if (formData[key] === '') {
        formData[key] = null;
      }
    });

    if ((this.f['reg_type'].value != null && this.f['reg_type'].value != '') && (this.f['reg_no'].value != null && this.f['reg_no'].value != '')) {
      formData.registration_no = `${this.f['reg_type'].value + '-' + this.f['reg_no'].value}`;
    }

    const request$ = formData.id
      ? this.masterService.updateMaster(formData, formData.id, this.endPoint)
      : this.masterService.createMaster(formData, this.endPoint);

    if (formData.discount_details.length > 1 && this.checkForDuplicates(formData.discount_details)) {
      this.toastr.error("Dulpicate Division Found in Discount Category", "Error")
      return;
    }

    if (formData.discount_details.length > 0) {
      if ((formData.discount_details[0].division_id == null && formData.discount_details[0].discount != null) ||
        (formData.discount_details[0].division_id != null && formData.discount_details[0].discount == null)) {
        this.toastr.error("Please enter both values for division and discount category", "Error")
        return;
      }

      if ((formData.discount_details[0].division_id == null && formData.discount_details[0].discount == null)) {
        formData.discount_details = [];
      }
    }

    request$.subscribe({
      next: (res: any) => {
        if (res?.success == true) {
          this.isLoading = false;
          this.closeDialog(res);
          res?.messages?.forEach((message: any) => {
            this.toastr.success(message.message, 'Success', {
              closeButton: true,
            });
          });

        }
        else {
          res?.messages?.forEach((message: any) => {
            this.toastr.error(message.message, 'Error', {
              closeButton: true,
            });
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        err?.error?.messages?.forEach((message: any) => {
          this.toastr.error(message.message, 'Error', {
            closeButton: true,
          });
        });
        this.isLoading = false;
      },
    })
  }

  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-down');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      }
      else {
        this.dialogRef.close();
      }

    }, 400);
  }

  checkForDuplicates(array: any[]) {
    const idCount: any = {};
    let hasDuplicates = false;

    // Count occurrences of each id
    array.forEach(obj => {
      const id = obj.division_id;
      const key = id;
      idCount[key] = (idCount[key] || 0) + 1;
    });

    // Check for duplicates
    for (let id in idCount) {
      if (idCount[id] > 1) {
        this.toastr.error('Duplicate division entry', 'Error', {
          closeButton: true,
        });
        hasDuplicates = true;
      }
    }

    return hasDuplicates;
  }
}
