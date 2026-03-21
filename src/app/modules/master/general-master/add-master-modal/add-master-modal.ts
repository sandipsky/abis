import { Component, Inject, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-master-modal',
  templateUrl: './add-master-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class MastersInlineModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MastersInlineModalComponent>);
  private readonly masterService = inject(MasterService);
  private readonly toastr = inject(ToastrService);
  public readonly data = inject(MAT_DIALOG_DATA);

  readonly title = signal<string>(this.data?.item?.title ?? '');
  readonly mode = signal<'Add' | 'Edit'>(this.data?.item?.formData?.id ? 'Edit' : 'Add');
  readonly endPoint = signal<string>(this.data?.item?.endPoint ?? '');
  readonly placeholder = computed(() => `Enter ${this.title()}`);

  modalForm: FormGroup;

  constructor() {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      name: [, Validators.required],
      status: [true, Validators.required],
    });
    this.initializeDynamicFields();
  }

  private initializeDynamicFields() {
    if (this.title() === "Tax Type") {
      this.modalForm.addControl('tax_rate', this.fb.control(this.data?.item?.formData?.tax_rate ?? null, [Validators.required]));
    }

    if (this.data?.item?.formData) {
      this.modalForm.patchValue(this.data.item.formData);
    }
  }

  save() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) return;

    const payload = this.modalForm.value;

    this.masterService.addUnitMaster(this.endPoint(), payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success', { closeButton: true });
        this.closeDialog(res);
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error', { closeButton: true });
      },
    });
  }

  public closeDialog(res?: any) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (res) {
        this.dialogRef.close({
          id: res.post_data_id,
          name: this.modalForm.value.name,
        });
      } else {
        this.dialogRef.close();
      }
    }, 400);
  }
}