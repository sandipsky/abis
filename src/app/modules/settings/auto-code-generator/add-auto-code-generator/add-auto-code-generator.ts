import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { IdGeneratorService } from '../auto-code-generator.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-auto-code-generator.html',
  styleUrl: './add-auto-code-generator.scss',
})
export class AddCodeGeneratorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly autoCodeService = inject(IdGeneratorService);
  private readonly dialogRef = inject(MatDialogRef<AddCodeGeneratorComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  readonly modalForm = this.fb.nonNullable.group({
    id: [null as number | null],
    item_name: ['', Validators.required],
    auto_increment_enabled: [false],
    alphabet_section: [''],
    numeric_section: ['']
  });

  autoIncrementSignal = toSignal(
    this.modalForm.controls.auto_increment_enabled.valueChanges, 
    { initialValue: false }
  );

  constructor() {
    effect(() => {
      const isEnabled = this.autoIncrementSignal();
      const numericControl = this.modalForm.controls.numeric_section;

      if (isEnabled) {
        numericControl.setValidators([Validators.required]);
      } else {
        numericControl.clearValidators();
      }
      numericControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit() {
    if (this.data?.formData) {
      this.modalForm.patchValue(this.data.formData);
    }
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) return;

    const request$ = this.modalForm.value.id
      ? this.autoCodeService.editConfig(this.modalForm.value, this.modalForm.value.id)
      : this.autoCodeService.saveConfig(this.modalForm.value);

    request$.subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.closeDialog(true);
          res.messages?.forEach((m: any) => this.toastr.success(m.message, 'Success'));
        } else {
          res.messages?.forEach((m: any) => this.toastr.error(m.message, 'Error'));
        }
      },
      error: (err) => {
        err?.error?.messages?.forEach((m: any) => this.toastr.error(m.message, 'Error'));
      }
    });
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    if (!/^[A-Za-z-]$/.test(event.key)) event.preventDefault();
  }

  isRequiredInvalid(fieldName: keyof typeof this.modalForm.controls): boolean {
    const control = this.modalForm.controls[fieldName];
    return control.invalid && (control.dirty || control.touched) && control.hasError('required');
  }

  closeDialog(wasSuccessful = false) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      this.dialogRef.close(wasSuccessful);
    }, 400);
  }
}