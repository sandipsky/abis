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
import { firstValueFrom } from 'rxjs';
import { UnitMasterService } from '../../master.service';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, SharedModule, FormValidationDirective],
  templateUrl: './add-customers.html',
  standalone: true
})
export class AddCustomersComponent {
  modalForm: FormGroup;
  endPoint = 'customers';
  isLoading = false;
  companyDetails: any;
  selectedCustomer: any;

  divisionList: any[] = [];
  headquarterList: any[] = [];
  categoryList: any[] = [];

  selectedFile: any;
  currentFileUrl: any;
  attachments: any[] = [];

  constructor(
    private masterService: UnitMasterService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddCustomersComponent>,
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
      credit_limit: [],
      discount_details: new FormArray([]),
      hq_divisions: new FormArray([]),
    });

    if (data?.formData) {
      this.modalForm.patchValue(data?.formData);
    }

    if (data?.formData?.id) {
      this.discount_details.clear();
      this.masterService.getMasterDetail(data?.formData?.id, this.endPoint).subscribe(
        {
          next: (res: any) => {
            this.selectedCustomer = res;
            this.getAttachments(res?.attachment_list || []);
            if (this.selectedCustomer?.registration_no) {
              const parts = this.selectedCustomer.registration_no.split('-');
              this.selectedCustomer.reg_type = parts[0] || null;
              this.selectedCustomer.reg_no = parts[1] || null;
              this.modalForm.get('reg_no')?.setValidators([Validators.required]);
              this.modalForm.get('reg_no')?.updateValueAndValidity();
            }

            if (this.selectedCustomer?.discount_details?.length > 0) {
              for (let i = 0; i < this.selectedCustomer?.discount_details?.length; i++) {
                this.addDiscountCondition();
              }
            }
            else {
              this.discount_details.push(
                this.fb.group({
                  id: [],
                  division_id: [],
                  discount_category_id: [],
                  credit_days: [],
                  grace_days: [],
                  credit_limit: [],
                }),
              );
            }

            if (this.selectedCustomer?.hq_divisions?.length > 0) {
              for (let i = 0; i < this.selectedCustomer?.hq_divisions?.length; i++) {
                this.addHqDivision();
              }
            }
            else {
              this.hq_divisions.push(
                this.fb.group({
                  id: [],
                  hq_id: [],
                  division_ids: []
                }),
              );
            }

            this.modalForm.patchValue(this.selectedCustomer);
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

  ngOnInit() {
    this.getCompanyInfo();
    this.getDivisionList();
    this.getHQList();
    this.getCategoryList();
  }

  get f() { return this.modalForm.controls; }

  get discount_details(): any {
    return this.modalForm.get('discount_details') as FormArray;
  }

  get hq_divisions(): any {
    return this.modalForm.get('hq_divisions') as FormArray;
  }

  addDiscountCondition() {
    this.discount_details.push(
      this.fb.group({
        id: [],
        division_id: [, Validators.required],
        discount_category_id: [, Validators.required],
        grace_days: [],
        credit_days: [],
        credit_limit: []
      }),
    );
  }

  removeDiscountCondition(index: number) {
    this.discount_details.removeAt(index);
  }

  addHqDivision() {
    this.hq_divisions.push(
      this.fb.group({
        id: [],
        hq_id: [, Validators.required],
        division_ids: [, Validators.required],
      }),
    );
  }

  removeHqDivision(index: number) {
    this.hq_divisions.removeAt(index);
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

  getHQList() {
    this.dropDownService.getHQDropdownUser().subscribe({
      next: (res: any) => {
        this.headquarterList = [...res];
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

  getCategoryList() {
    this.dropDownService.getCustomerCategoryDropdown().subscribe({
      next: (res: any) => {
        this.categoryList = [...res];
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

  async getAttachments(files: any[]) {
    for (let i = 0; i < files.length; i++) {
      const result: any = await firstValueFrom(this.masterService.getFile(files[i].attachement));
      result.name = files[i]?.file_name;
      result.filename = files[i]?.file_name;
      console.log(result);
      this.attachments.push(result);
    }
  }

  onSelectFile(event: any): void {
    if (event.target.files) {
      let file = event.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
        this.toastr.error(
          'Please upload only jpg, jpeg, png or pdf Files',
          'Error',
          { closeButton: true }
        );
        return;
      }

      if (file.size <= 6 * 1024 * 1024) {
        this.attachments.push(file);
        this.selectedFile = null;
      } else {
        this.toastr.error("File size exceeds 6MB limit");
      }
    }
    else {
      this.selectedFile = null;
      return;
    }
  }

  formatFileSize(size: number): string {
    const kb = size / 1024;
    if (kb < 1024) {
      return kb.toFixed(1) + " KB";
    }
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }

  viewFile(i: number) {
    const file = this.attachments[i];
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  downloadFile(i: number) {
    const file = this.attachments[i];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  removeFile(i: number) {
    this.attachments = this.attachments.filter((items: any, index: number) => index != i);
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }


    const formData = this.modalForm.value;
    Object.keys(formData).forEach(key => {
      if (formData[key] === '') {
        formData[key] = null;
      }
    });

    if ((this.f['reg_type'].value != null && this.f['reg_type'].value != '') && (this.f['reg_no'].value != null && this.f['reg_no'].value != '')) {
      formData.registration_no = `${this.f['reg_type'].value + '-' + this.f['reg_no'].value}`;
    }

    if (formData.discount_details.length > 1 && this.checkForDuplicates(formData.discount_details)) {
      this.toastr.error("Dulpicate Division Found in Discount Category", "Error")
      return;
    }

    if (formData.hq_divisions.length > 1 && this.checkForDuplicateDivision(formData.hq_divisions)) {
      this.toastr.error("Dulpicate Division Found in Headquarter Division", "Error")
      return;
    }

    if (formData.discount_details.length > 0) {
      if ((formData.discount_details[0].division_id == null && formData.discount_details[0].discount_category_id != null) ||
        (formData.discount_details[0].division_id != null && formData.discount_details[0].discount_category_id == null)) {
        this.toastr.error("Please enter both values for division and discount category", "Error")
        return;
      }

      if ((formData.discount_details[0].division_id == null && formData.discount_details[0].discount_category_id == null)) {
        formData.discount_details = [];
      }
    }

    if (formData.hq_divisions.length > 0) {
      if (((formData.hq_divisions[0]?.division_ids?.length == 0 || formData.hq_divisions[0]?.division_ids == null) && formData.hq_divisions[0].hq_id != null) ||
        ((formData.hq_divisions[0]?.division_ids?.length > 0 && formData.hq_divisions[0]?.division_ids != null) && formData.hq_divisions[0].hq_id == null)) {
        this.toastr.error("Please enter both values for headquarter and division", "Error")
        return;
      }

      if (((formData.hq_divisions[0]?.division_ids?.length == 0 || formData.hq_divisions[0]?.division_ids == null) && formData.hq_divisions[0].hq_id == null)) {
        formData.hq_divisions = [];
      }
    }

    let fd = new FormData();
    let jsonPayload = JSON.stringify(formData);
    fd.append('customer', new Blob([jsonPayload], { type: "application/json" }));
    if (this.attachments != null && this.attachments.length > 0) {

      this.attachments.forEach(item => {
        console.log(item);
        fd.append('file', item, item?.name || item?.filename || 'file');
      })
    }

    this.isLoading = true;

    const request$ = formData.id
      ? this.masterService.updateMaster(fd, formData.id, this.endPoint)
      : this.masterService.createMaster(fd, this.endPoint);

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
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

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

  checkForDuplicateDivision(hqdiv: any[]) {
    let divs: any[] = [];
    hqdiv.forEach(item => {
      divs.push(...item?.division_ids)
    })

    if (divs.length == [...new Set(divs)].length) {
      return false;
    }
    else {
      return true;
    }
  }
}
