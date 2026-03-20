import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../master.service';
import { DropdownsService } from '../../../../shared/services/dropdown.service';

@Component({
  selector: 'app-add-master-modal',
  templateUrl: './add-master-modal.html',
  styleUrls: ['./add-master-modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MastersInlineModalComponent {
  modalForm: FormGroup;
  placeholder: string = '';
  endPoint: string = '';
  title: string = '';
  showMode: string = '';
  isLoading: boolean = false;
  mode: string = 'Add';

  companiesDrpDown: any[] = [];
  headquarterList: any[] = [];
  divisionList: any[] = [];
  marketingTeamList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MastersInlineModalComponent>,
    private masterService: MasterService,
    private dropDownService: DropdownsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      name: ['', Validators.required],
      status: [true, Validators.required],
    })

    console.log(data);

    if (data.item) {
      this.placeholder = `Enter ${data.item.title}`
      this.title = data.item.title
      this.endPoint = data.item.endPoint


      if (data.item.title == "Tax Type") {
        this.modalForm.addControl('tax_rate', this.fb.control(null));
        this.modalForm.addControl('remarks', this.fb.control(''));

        this.modalForm.get('tax_rate')?.addValidators(Validators.required);
        this.modalForm.get('tax_rate')?.updateValueAndValidity();
      }

      if (data.item.title == "Transport") {
        this.modalForm.addControl('contact_no', this.fb.control(null));
      }

      if (data.item.title == "Division") {
        this.modalForm.addControl('company_id', this.fb.control(null));

        this.modalForm.get('company_id')?.addValidators(Validators.required);
        this.modalForm.get('company_id')?.updateValueAndValidity();

        this.companiesDrpDown = data.item.companies;
      }

      if (data.item.title == "Designation") {
        this.modalForm.addControl('is_sales_order', this.fb.control(true));
      }

      if (data.item.title == "Marketing Team") {
        this.modalForm.addControl('parent_id', this.fb.control(null));
        this.modalForm.addControl('is_MR', this.fb.control(false));

        this.modalForm.get('is_MR')?.addValidators(Validators.required);
        this.modalForm.get('is_MR')?.updateValueAndValidity();

        this.modalForm.addControl('hq_div_ids', this.fb.array([]));
        this.addHQDivision()

        this.getDivisionList()
        this.getHQList()
        this.getMRList()
      }

      if (data.item.title == "Discount Category") {
        this.modalForm.addControl('discount_type', this.fb.control(null));
        this.modalForm.addControl('apply_on', this.fb.control(null));
        this.modalForm.addControl('flat_discount', this.fb.control(null));

        this.modalForm.get('discount_type')?.addValidators(Validators.required);
        this.modalForm.get('discount_type')?.updateValueAndValidity();

        this.modalForm.get('apply_on')?.addValidators(Validators.required);
        this.modalForm.get('apply_on')?.updateValueAndValidity();

        this.modalForm.addControl('discount_details', this.fb.array([]));
        this.addDiscountCondition()
        // this.getDivisionList()

      }

      if (data.item.formData) {
        if (data.item.formData.id != null) {
          this.mode = 'Edit';
        }

        if (data.item.title == "Marketing Team") {
          let fd = this.deepClone(data.item.formData);

          fd.parent_id == 0 ? fd.parent_id = null : null;

          for (let i = 0; i < fd.hq_div_ids?.length - 1; i++) {
            this.addHQDivision();
          }

          fd.hq_div_ids = fd.hq_div_ids.map((item: any) => {
            item.division_ids = item.division_ids.map((division: any) => division.division_id);
            return item;
          });

          this.modalForm.patchValue(fd);
          return;
        }

        if (data.item.title == "Discount Category") {
          let fd = data.item.formData;
          for (let i = 0; i < fd.discount_details?.length - 1; i++) {
            this.addDiscountCondition();
          }
          this.modalForm.patchValue(fd);
          this.toggleDiscountType()
        }


        this.modalForm.patchValue(data.item.formData);
      }

      if (data.name) {
        this.modalForm.get('name')?.setValue(data.name);
      }
    }
  }

  get f() {
    return this.modalForm.controls;
  }

  get hq_div_ids(): any {
    return this.modalForm.get('hq_div_ids') as FormArray;
  }

  get discount_details(): any {
    return this.modalForm.get('discount_details') as FormArray;
  }

  addHQDivision() {
    this.hq_div_ids.push(
      this.fb.group({
        id: [],
        hq_id: [, Validators.required],
        division_ids: [, Validators.required]
      }),
    );
  }

  removeQDivision(index: number) {
    this.hq_div_ids.removeAt(index);
  }

  addDiscountCondition() {
    this.discount_details.push(
      this.fb.group({
        id: [],
        payment_days: [, this.showMode == 'table' && Validators.required],
        discount_value: [, Validators.required],
        // division_id: [, Validators.required]
      }),
    );
  }

  removeDiscountCondition(index: number) {
    this.discount_details.removeAt(index);
  }

  toggleDiscountType() {
    if (this.f['discount_type'].value == 'Flat') {
      this.showMode = 'value'


      this.modalForm.get('apply_on')?.clearValidators();
      this.modalForm.get('apply_on')?.updateValueAndValidity();

      this.modalForm.get('flat_discount')?.setValidators([Validators.required]);
      this.modalForm.get('flat_discount')?.updateValueAndValidity();

      for (let i = 0; i < this.discount_details.controls.length; i++) {
        this.discount_details.controls[i]?.get('payment_days').clearValidators();
        this.discount_details.controls[i]?.get('payment_days').updateValueAndValidity();

        this.discount_details.controls[i]?.get('discount_value').clearValidators();
        this.discount_details.controls[i]?.get('discount_value').updateValueAndValidity();
      }
    }
    else if (this.f['discount_type'].value == 'Dynamic') {

      this.showMode = 'table'

      this.modalForm.get('flat_discount')?.clearValidators();
      this.modalForm.get('flat_discount')?.updateValueAndValidity();

      this.modalForm.get('apply_on')?.setValidators([Validators.required]);
      this.modalForm.get('apply_on')?.updateValueAndValidity();



      for (let i = 0; i < this.discount_details.controls.length; i++) {
        this.discount_details.controls[i]?.get('payment_days').setValidators([Validators.required]);
        this.discount_details.controls[i]?.get('payment_days').updateValueAndValidity();

        this.discount_details.controls[i]?.get('discount_value').setValidators([Validators.required]);
        this.discount_details.controls[i]?.get('discount_value').updateValueAndValidity();
      }
    }
    else {

      this.showMode = 'both'

      this.modalForm.get('flat_discount')?.setValidators([Validators.required]);
      this.modalForm.get('flat_discount')?.updateValueAndValidity();

      this.modalForm.get('apply_on')?.setValidators([Validators.required]);
      this.modalForm.get('apply_on')?.updateValueAndValidity();



      for (let i = 0; i < this.discount_details.controls.length; i++) {
        this.discount_details.controls[i]?.get('payment_days').setValidators([Validators.required]);
        this.discount_details.controls[i]?.get('payment_days').updateValueAndValidity();

        this.discount_details.controls[i]?.get('discount_value').setValidators([Validators.required]);
        this.discount_details.controls[i]?.get('discount_value').updateValueAndValidity();
      }
    }
  }

  getHQList() {
    this.dropDownService.getHQDropdown().subscribe({
      next: (res: any) => {
        this.headquarterList = [...res];
      },
      error: (err) => {
        this.toastr.error(err)
      },
    })
  }

  getDivisionList() {
    this.dropDownService.getDivisionDropdown().subscribe({
      next: (res: any) => {
        this.divisionList = [...res];
      },
      error: (err) => {
        this.toastr.error(err)
      },
    })
  }

  getMRList() {
    this.dropDownService.getMRDropdown().subscribe({
      next: (res: any) => {
        this.marketingTeamList = [...res];
      },
      error: (err) => {
        this.toastr.error(err)
      },
    })
  }

  save() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }
    else {

      let formData = this.modalForm.value;

      //For Marketing
      if (this.data.item.title == "Marketing Team") {
        let pairs: any[] = []

        for (let i = 0; i < this.hq_div_ids.controls.length; i++) {
          let division_ids: any[] = [];
          let idList = this.hq_div_ids.controls[i]?.get('division_ids').value;
          let hqId = this.hq_div_ids.controls[i]?.get('hq_id').value;
          idList.forEach((idd: any) => {
            let hq = this.data?.item?.formData?.hq_div_ids?.find((item: any) => item.hq_id == hqId) || [];
            division_ids.push({ id: hq?.division_ids?.find((item: any) => item.division_id === idd)?.id || null, division_id: idd })

          })
          pairs.push({ hq_id: this.hq_div_ids.controls[i]?.get('hq_id').value, division_ids: division_ids })
        }
        formData.hq_div_ids = pairs;
      }
      // Marketing End 

      //Discount Category
      if (this.data.item.title == "Discount Category") {
        if (this.showMode == 'table') {
          formData.flat_discount = 0;
          formData.discount_details = formData?.discount_details?.sort((a: any, b: any) => a?.payment_days - b?.payment_days) || [];
        }
        else if (this.showMode == 'value') {
          formData.apply_on = "Gross Amount";
          // for (let i = 0; i < formData.discount_details.length; i++) {
          //   formData.discount_details[i].payment_days = null;
          // }
          formData.discount_details = [];
        }
        else {
          formData.discount_details = formData?.discount_details?.sort((a: any, b: any) => a?.payment_days - b?.payment_days) || [];
        }

        if (this.checkForDuplicates(formData.discount_details)) {
          return;
        }
      }

      this.masterService.addUnitMaster(this.endPoint, formData).subscribe(
        {
          next: (res: any) => {
            if (res?.success == true) {
              this.isLoading = false;
              res?.messages?.forEach((message: any) => {
                this.toastr.success(message.message, 'Success', {
                  closeButton: true,
                });
              })
              this.closeDialog(res);
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
        }
      );
    }
  }

  isRequiredInvalid(fieldName: string): boolean {
    const field = this.modalForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['required']
    );
  }

  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (data) {
        if (this.data.item.title == "Transport") {
          this.dialogRef.close({
            id: data.post_data_id,
            name: this.modalForm.value.name,
            code: this.modalForm.value.contact_no,
            rate: null
          });
        }
        else if (this.data.item.title == "Division") {
          this.dialogRef.close({
            id: data.post_data_id,
            name: this.modalForm.value.name,
            code: null,
            rate: null,
            company_id: this.modalForm?.value?.company_id,
            company_name: this.companiesDrpDown?.find(item => item.id == this.modalForm.value.company_id)?.name
          });
        }
        else {
          if (this.data?.item?.formData == undefined && this.modalForm.value.status != true) {
            this.dialogRef.close()
          }
          else {
            this.dialogRef.close({
              id: data.post_data_id,
              name: this.modalForm.value.name,
              code: null,
              rate: null
            });
          }
        }
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
      // const id = obj.division_id;
      const paymentDays = obj.payment_days;
      const key = paymentDays;
      idCount[key] = (idCount[key] || 0) + 1;
    });

    // Check for duplicates
    for (let id in idCount) {
      if (idCount[id] > 1) {
        this.toastr.error('Duplicate payment days entry', 'Error', {
          closeButton: true,
        });
        hasDuplicates = true;
      }
    }

    return hasDuplicates;
  }

  deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Array) {
      const arrCopy: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = this.deepClone(obj[i]);
      }
      return arrCopy;
    }

    if (obj instanceof Object) {
      const objCopy: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          objCopy[key] = this.deepClone(obj[key]);
        }
      }
      return objCopy;
    }

    return obj;
  }


}


