import { Component, Inject, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../master.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Button } from '../../../../shared/components/button/button';
import { IApiResponse } from '../../../../shared/models/api-response.model';

@Component({
  selector: 'app-add-master-modal',
  templateUrl: './add-master-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MastersInlineModalComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogRef = inject(MatDialogRef<MastersInlineModalComponent>);
  private readonly _masterService = inject(MasterService);
  private readonly _toastr = inject(ToastrService);
  private readonly _spinnerService = inject(SpinnerService);

  public readonly data = inject(MAT_DIALOG_DATA);

  readonly title = signal<string>(this.data?.item?.title ?? '');
  readonly mode = signal<'Add' | 'Edit'>(this.data?.item?.formData?.id ? 'Edit' : 'Add');
  readonly endPoint = signal<string>(this.data?.item?.endPoint ?? '');
  readonly placeholder = computed(() => `Enter ${this.title()}`);

  modalForm: FormGroup;

  constructor() {
    this.modalForm = this._fb.nonNullable.group({
      id: [],
      name: [, Validators.required],
      is_active: [true, Validators.required],
    });
    this.initializeDynamicFields();
  }

  private initializeDynamicFields() {
    if (this.title() === "Tax Type") {
      this.modalForm.addControl('tax_rate', this._fb.control(this.data?.item?.formData?.tax_rate ?? null, [Validators.required]));
    }

    if (this.data?.item?.formData) {
      this.modalForm.patchValue(this.data.item.formData);
    }
  }

  save() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) return;

    const formData = this.modalForm.value;

    this._spinnerService.setSpinner(true);

    const request$ = formData.id
      ? this._masterService.updateMaster(formData, this.endPoint())
      : this._masterService.createMaster(formData, this.endPoint());

    request$.subscribe({
      next: (res: IApiResponse) => {
        this._toastr.success(res.message, 'Success', { closeButton: true });
        this.closeDialog(res);
        this._spinnerService.setSpinner(false);
      }
    });
  }

  public closeDialog(res?: IApiResponse) {
    this._dialogRef.removePanelClass('slide-left');
    this._dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (res) {
        this._dialogRef.close({
          id: res.post_data_id,
          name: this.modalForm.value.name,
        });
      } else {
        this._dialogRef.close();
      }
    }, 400);
  }
}