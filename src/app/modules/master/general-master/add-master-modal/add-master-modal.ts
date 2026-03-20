import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../master.service';
import { SharedModule } from '../../../../shared/shared-module';

@Component({
  selector: 'app-add-master-modal',
  templateUrl: './add-master-modal.html',
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, NgSelectModule]
})
export class MastersInlineModalComponent {
  modalForm: FormGroup;
  placeholder: string = '';
  endPoint: string = '';
  title: string = '';
  mode: string = 'Add';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MastersInlineModalComponent>,
    private masterService: MasterService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      name: ['', Validators.required],
      status: [true, Validators.required],
    })

    if (data.item) {
      this.placeholder = `Enter ${data.item.title}`
      this.title = data.item.title
      this.endPoint = data.item.endPoint

      if (data.item.title == "Tax Type") {
        this.modalForm.addControl('tax_rate', this.fb.control(null));
        this.modalForm.get('tax_rate')?.addValidators(Validators.required);
        this.modalForm.get('tax_rate')?.updateValueAndValidity();
      }

      if (data.item.formData) {
        if (data.item.formData.id != null) {
          this.mode = 'Edit';
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

  save() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    let formData = this.modalForm.value;

    this.masterService.addUnitMaster(this.endPoint, formData).subscribe(
      {
        next: (res: any) => {
          this.toastr.success(res.message, 'Success', {
            closeButton: true,
          });
          this.closeDialog(res);
        },
        error: (err) => {
          this.toastr.error(err.message, 'Error', {
            closeButton: true,
          });
        },
      }
    );
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
        this.dialogRef.close({
          id: data.post_data_id,
          name: this.modalForm.value.name,
        });
      }
      else {
        this.dialogRef.close();
      }
    }, 400);
  }
}


