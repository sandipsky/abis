import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { VendorService } from '@/features/purchase/vendors/vendor.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IVendor } from '@/features/purchase/vendors/vendor.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-vendor',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-vendor.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVendor {
  private _vendorService = inject(VendorService);
  private _toastr = inject(ToastrService);
  private _dialogRef = inject<MatDialogRef<AddVendor>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<IVendor>>(MAT_DIALOG_DATA);

  selectedVendor = signal<IVendor | null>(null);

  modalForm: FormGroup = this._fb.nonNullable.group({
    id: [],
    name: [, Validators.required],
    registration_number: [],
    is_active: [true],
    contact: [],
    address: [],
    email: [, Validators.email],
    remarks: [],
  });

  ngOnInit() {
    const vendorId = this.data?.formData?.id;
    if (vendorId) {
      this.loadVendorDetail(vendorId);
    }
  }

  private loadVendorDetail(id: number) {
    this._vendorService.getVendorDetail(id).subscribe((res: IVendor) => {
      this.selectedVendor.set(res);
      this.modalForm.patchValue(res);
    });
  }

  get f() { return this.modalForm.controls; }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this._spinnerService.setSpinner(true);
    const formData = this.modalForm.value;

    const request$ = formData.id
      ? this._vendorService.updateVendor(formData, formData.id)
      : this._vendorService.createVendor(formData);

    request$.subscribe({
      next: (res: IApiResponse) => {
        if (res?.success == true) {
          this._spinnerService.setSpinner(false);
          this.closeDialog(res);
          this._toastr.success(res.message, 'Success', { closeButton: true });
        } else {
          this._toastr.error(res.message, 'Error', { closeButton: true });
          this._spinnerService.setSpinner(false);
        }
      },
      error: () => {
        this._spinnerService.setSpinner(false);
      },
    });
  }

  closeDialog(data?: IApiResponse) {
    this._dialogRef.removePanelClass('slide-up');
    this._dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      if (data) {
        this._dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      } else {
        this._dialogRef.close();
      }
    }, 400);
  }
}
