import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { RolesPermissionService } from '@/modules/roles-permission/roles-permission.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import {
  IPermissionMasterModule,
  IPermissionModule,
  IRolesPermission,
} from '@/modules/roles-permission/roles-permission.model';
import { IDialogData } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-roles-permission',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, Button, FormValidation],
  templateUrl: './add-roles-permission.html',
  styleUrl: './add-roles-permission.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRolesPermission {
  private _rolesPermissionService = inject(RolesPermissionService);
  private _toastr = inject(ToastrService);
  private _dialogRef = inject<MatDialogRef<AddRolesPermission>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<IRolesPermission>>(MAT_DIALOG_DATA);

  selectedRolesPermission = signal<IRolesPermission | null>(null);

  permissions = signal<IPermissionMasterModule[]>([]);
  selectedMasterIndex = signal(0);

  selectedMaster = computed(() => this.permissions()[this.selectedMasterIndex()] ?? null);

  modalForm: FormGroup = this._fb.nonNullable.group({
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
    this.loadOperations(id ?? 0);
  }

  private loadRolesPermissionDetail(id: number) {
    this._rolesPermissionService.getRolesPermissionDetail(id).subscribe((res: IRolesPermission) => {
      this.selectedRolesPermission.set(res);
      this.modalForm.patchValue(res);
    });
  }

  private loadOperations(roleId: number) {
    this._rolesPermissionService.getRoleOperations(roleId).subscribe((res) => {
      this.permissions.set(res ?? []);
    });
  }

  get f() { return this.modalForm.controls; }

  selectMaster(index: number) {
    this.selectedMasterIndex.set(index);
  }

  isMasterChecked(master: IPermissionMasterModule): boolean {
    const ops = this.allOperationsOf(master);
    return ops.length > 0 && ops.every((op) => op.selected);
  }

  isMasterIndeterminate(master: IPermissionMasterModule): boolean {
    const ops = this.allOperationsOf(master);
    const selectedCount = ops.filter((op) => op.selected).length;
    return selectedCount > 0 && selectedCount < ops.length;
  }

  isModuleChecked(mod: IPermissionModule): boolean {
    return mod.operations.length > 0 && mod.operations.every((op) => op.selected);
  }

  isModuleIndeterminate(mod: IPermissionModule): boolean {
    const selectedCount = mod.operations.filter((op) => op.selected).length;
    return selectedCount > 0 && selectedCount < mod.operations.length;
  }

  toggleMaster(masterIdx: number, checked: boolean) {
    const list = this.permissions();
    list[masterIdx].modules.forEach((mod) => {
      mod.operations.forEach((op) => (op.selected = checked));
    });
    this.permissions.set([...list]);
  }

  toggleModule(masterIdx: number, moduleIdx: number, checked: boolean) {
    const list = this.permissions();
    list[masterIdx].modules[moduleIdx].operations.forEach((op) => (op.selected = checked));
    this.permissions.set([...list]);
  }

  toggleOperation(masterIdx: number, moduleIdx: number, opIdx: number, checked: boolean) {
    const list = this.permissions();
    list[masterIdx].modules[moduleIdx].operations[opIdx].selected = checked;
    this.permissions.set([...list]);
  }

  private allOperationsOf(master: IPermissionMasterModule) {
    return master.modules.flatMap((mod) => mod.operations);
  }

  selectedOperationIds(): number[] {
    return this.permissions().flatMap((master) =>
      master.modules.flatMap((mod) => mod.operations.filter((op) => op.selected).map((op) => op.id)),
    );
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this._spinnerService.setSpinner(true);
    const formData = {
      ...this.modalForm.value,
      operation_ids: this.selectedOperationIds(),
    };

    const request$ = formData.id
      ? this._rolesPermissionService.updateRolesPermission(formData, formData.id)
      : this._rolesPermissionService.createRolesPermission(formData);

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
