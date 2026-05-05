import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { CustomerService } from '@/features/sales/customers/customer.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { ICustomer } from '@/features/sales/customers/customer.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-customer',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-customer.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCustomer {
  private _customerService = inject(CustomerService);
  private _toastr = inject(ToastrService);
  private _dialogRef = inject<MatDialogRef<AddCustomer>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<ICustomer>>(MAT_DIALOG_DATA);

  selectedCustomer = signal<ICustomer | null>(null);

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
    const customerId = this.data?.formData?.id;
    if (customerId) {
      this.loadCustomerDetail(customerId);
    }
  }

  private loadCustomerDetail(id: number) {
    this._customerService.getCustomerDetail(id).subscribe((res: ICustomer) => {
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

    this._spinnerService.setSpinner(true);
    const formData = this.modalForm.value;

    const request$ = formData.id
      ? this._customerService.updateCustomer(formData, formData.id)
      : this._customerService.createCustomer(formData);

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
