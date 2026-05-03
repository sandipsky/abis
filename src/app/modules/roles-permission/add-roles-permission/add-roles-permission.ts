import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { RolesPermissionService } from '@/modules/roles-permission/roles-permission.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IRolesPermission } from '@/modules/roles-permission/roles-permission.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-roles-permission',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-roles-permission.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRolesPermission {
  private rolesPermissionService = inject(RolesPermissionService);
  private toastr = inject(ToastrService);
  private dialogRef = inject<MatDialogRef<AddRolesPermission>>(MatDialogRef);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  data = inject<IDialogData<IRolesPermission>>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  selectedRolesPermission = signal<IRolesPermission | null>(null);

  modalForm: FormGroup = this.fb.nonNullable.group({
    id: [],
    name: [, Validators.required],
    description: [],
    is_active: [],
  });

  ngOnInit() {
    const id = this.data?.formData?.id;
    if (id) {
      this.loadRolesPermissionDetail(id);
    }
  }

  private loadRolesPermissionDetail(id: number) {
    this.rolesPermissionService.getRolesPermissionDetail(id).subscribe((res: IRolesPermission) => {
      this.selectedRolesPermission.set(res);
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
      ? this.rolesPermissionService.updateRolesPermission(formData, formData.id)
      : this.rolesPermissionService.createRolesPermission(formData);

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
