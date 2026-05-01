import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { CustomerService } from '@/modules/sales/customers/customer.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { ICustomer } from '@/modules/sales/customers/customer.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-customer',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-customer.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCustomer {
  private customerService = inject(CustomerService);
  private toastr = inject(ToastrService);
  private dialogRef = inject<MatDialogRef<AddCustomer>>(MatDialogRef);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  data = inject<IDialogData<ICustomer>>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  selectedCustomer = signal<ICustomer | null>(null);

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
    const customerId = this.data?.formData?.id;
    if (customerId) {
      this.loadCustomerDetail(customerId);
    }
  }

  private loadCustomerDetail(id: number) {
    this.customerService.getCustomerDetail(id).subscribe((res: ICustomer) => {
      this.selectedCustomer.set(res);
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
      ? this.customerService.updateCustomer(formData, formData.id)
      : this.customerService.createCustomer(formData);

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
