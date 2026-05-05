import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import { Button } from '@/shared/components/button/button';
import { Icon } from '@/shared/components/icon/icon';
import { ImageUpload } from '@/shared/components/image-upload/image-upload';
import { FormValidation } from '@/shared/directives/form-validation';
import { UserService } from '@/features/user/user.service';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IDropdownItem } from '@/shared/models/dropdown.model';
import { IUser } from '@/features/user/user.model';
import { IDialogData, IFile } from '@/shared/models/common.model';
import { AuthService } from '@/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, Button, Icon, ImageUpload, FormValidation],
  templateUrl: './add-user.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUser {
  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _dropdownService = inject(DropdownsService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _dialogRef = inject<MatDialogRef<AddUser>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<IUser>>(MAT_DIALOG_DATA);

  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);

  selectedUser = signal<IUser | null>(null);
  roleList = signal<IDropdownItem[]>([]);
  selectedProfileImage = signal<IFile | null>(null);

  hide = signal(true);
  confirmHide = signal(true);

  private _unlockRef!: MatDialogRef<unknown>;
  @ViewChild('confirm', { static: true }) confirm!: TemplateRef<unknown>;

  modalForm: FormGroup = this._fb.nonNullable.group(
    {
      id: [],
      full_name: [, Validators.required],
      contact: [],
      gender: [],
      remarks: [],
      email: [, [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: [, Validators.required],
      password: [, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
      ]],
      confirmpassword: [],
      role_id: [],
      account_non_locked: [true],
      is_active: [true],
      login_status: [true],
    },
    { validators: this.passwordMatchValidator }
  );

  get f() { return this.modalForm.controls; }

  ngOnInit() {
    this.loadRoles();

    const userId = this.data?.formData?.id;
    if (userId) {
      if (!this.data?.isView) {
        this.modalForm.get('password')?.clearValidators();
        this.modalForm.get('confirmpassword')?.clearValidators();
        this.modalForm.get('password')?.updateValueAndValidity();
        this.modalForm.get('confirmpassword')?.updateValueAndValidity();
        this.modalForm.addControl('delete_image', this._fb.control(false));
      }
      this.loadUserDetail(userId);
    }
  }

  private loadRoles() {
    this._dropdownService.getMasterDropdown('roles').subscribe(roles => {
      this.roleList.set(roles || []);
    });
  }

  private loadUserDetail(id: number) {
    this._userService.getUserDetail(id).subscribe((res: IUser) => {
      this.selectedUser.set(res);
      this.modalForm.patchValue(res);
      this.modalForm.patchValue({ password: '', confirmpassword: '' });
      if (res.image_url) {
        this.loadProductImage(res.image_url);
      }
    });
  }

  private loadProductImage(url: string) {
    this._userService.getUserImageByUrl(url).subscribe(blob => {
      this.selectedProfileImage.set({
        file: null,
        url: URL.createObjectURL(blob),
        name: (blob as any).name,
        size: blob.size.toString(),
      });
    });
  }


  unlockUser() {
    const id = this.modalForm.value.id || this.selectedUser()?.id;
    if (!id) return;

    this._spinnerService.setSpinner(true);
    this._userService.unlockUser(id).subscribe({
      next: (res: IApiResponse) => {
        this._toastr.success(res.message, 'Success', { closeButton: true });
        this.modalForm.get('account_non_locked')?.setValue(true);
        this.selectedUser.update(u => u ? { ...u, account_non_locked: true } : u);
        this.closeAlert();
        this._spinnerService.setSpinner(false);
      },
      error: () => this._spinnerService.setSpinner(false),
    });
  }

  showAlert() {
    this._unlockRef = this._dialog.open(this.confirm, {
      panelClass: 'slide-up',
      disableClose: true,
    });

    this._unlockRef.backdropClick().subscribe(() => this.closeAlert());
  }

  closeAlert() {
    this._unlockRef.removePanelClass('slide-up');
    this._unlockRef.addPanelClass('slide-up-close');

    setTimeout(() => this._unlockRef.close(), 400);
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) return;

    this._spinnerService.setSpinner(true);
    const formData = this.modalForm.value;

    const finalData = new FormData();
    const profile = this.selectedProfileImage();
    if (profile?.file) {
      finalData.append('image', profile.file);
    }
    finalData.append('user', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

    const request$ = formData.id
      ? this._userService.updateUser(finalData, formData.id)
      : this._userService.createUser(finalData);

    request$.subscribe({
      next: (res: IApiResponse) => {
        if (res?.success == true) {
          this._spinnerService.setSpinner(false);
          this.closeDialog(res);
          this._toastr.success(res.message, 'Success', { closeButton: true });
          if (this._currentUser()?.id == formData.id) {
            this._authService.getUserRoleOperations().subscribe();
          }
        } else {
          this._toastr.error(res.message, 'Error', { closeButton: true });
          this._spinnerService.setSpinner(false);
        }
      },
      error: () => this._spinnerService.setSpinner(false),
    });
  }

  closeDialog(data?: IApiResponse) {
    this._dialogRef.removePanelClass('slide-left');
    this._dialogRef.addPanelClass('slide-left-close');

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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!(control instanceof FormGroup)) return null;
    const password = control.get('password')?.value;
    const confirm = control.get('confirmpassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  get passwordValue(): string {
    return this.modalForm.get('password')?.value || '';
  }

  hasMinLength() { return this.passwordValue.length >= 8; }
  hasUpperLower() { return /(?=.*[a-z])(?=.*[A-Z])/.test(this.passwordValue); }
  hasNumber() { return /(?=.*\d)/.test(this.passwordValue); }
  hasSpecialChar() { return /(?=.*[!@#$%^&*])/.test(this.passwordValue); }
}
