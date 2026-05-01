import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { VendorService } from '@/modules/purchase/vendors/vendor.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IVendor } from '@/modules/purchase/vendors/vendor.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-vendor',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-vendor.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVendor {
  private vendorService = inject(VendorService);
  private toastr = inject(ToastrService);
  private dialogRef = inject<MatDialogRef<AddVendor>>(MatDialogRef);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  data = inject<IDialogData<IVendor>>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  selectedVendor = signal<IVendor | null>(null);

  modalForm: FormGroup = this.fb.nonNullable.group({
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
    this.vendorService.getVendorDetail(id).subscribe((res: IVendor) => {
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

    this.isLoading.set(true);
    const formData = this.modalForm.value;

    const request$ = formData.id
      ? this.vendorService.updateVendor(formData, formData.id)
      : this.vendorService.createVendor(formData);

    request$.subscribe({
      next: (res: IApiResponse) => {
        if (res?.success == true) {
          this.isLoading.set(false);
          this.closeDialog(res);
          this.toastr.success(res.message, 'Success', { closeButton: true });
        } else {
          this.toastr.error(res.message, 'Error', { closeButton: true });
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  closeDialog(data?: IApiResponse) {
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      } else {
        this.dialogRef.close();
      }
    }, 400);
  }
}
