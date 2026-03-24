import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { IdGeneratorService } from '../auto-code-generator.service';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-auto-code-generator.html',
  styleUrl: './add-auto-code-generator.scss',
  standalone: true
})
export class AddCodeGeneratorComponent {
  modalForm: FormGroup;
  endPoint = 'bank';
  isLoading = false;
  dateType = 'BS';

  relationshipList: any[] = [];

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private autoCodeService: IdGeneratorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      item_name: [, Validators.required],
      auto_increment_enabled: [],
      alphabet_section: [],
      numeric_section: []
    });


    if (data?.formData) {
      this.modalForm.patchValue(data?.formData);
    }

    this.modalForm.get('auto_increment_enabled')?.valueChanges.subscribe(value => {
      const numericControl = this.modalForm.get('numeric_section');

      if (value === true) {
        numericControl?.setValidators([Validators.required]);
      } else {
        numericControl?.clearValidators();
      }

      numericControl?.updateValueAndValidity();
    });
  }

  ngOnInit() { }

  get f() { return this.modalForm.controls; }

  setDate(e: any, formControl: any) {
    this.modalForm.get(formControl)?.setValue(e);
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

    const request$ = formData.id
      ? this.autoCodeService.editConfig(formData, formData.id)
      : this.autoCodeService.saveConfig(formData);

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

  allowOnlyAlphabets(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[A-Za-z-]$/.test(charCode)) {
      event.preventDefault();
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
        this.dialogRef.close(true);
      }
      else {
        this.dialogRef.close();
      }

    }, 400);
  }
}
