import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import { AuthService } from '@/auth/auth.service';
import { Button } from '@/shared/components/button/button';
import { Icon } from '@/shared/components/icon/icon';
import { ImageUpload } from '@/shared/components/image-upload/image-upload';
import { FormValidation } from '@/shared/directives/form-validation';
import { UserService } from '@/modules/user/user.service';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IDropdownItem } from '@/shared/models/dropdown.model';
import { IUser } from '@/modules/user/user.model';
import { IDialogData, IFile } from '@/shared/models/common.model';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, Button, Icon, ImageUpload, FormValidation],
  templateUrl: './add-user.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUser {
  private userService = inject(UserService);
  private dropdownService = inject(DropdownsService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  private dialogRef = inject<MatDialogRef<AddUser>>(MatDialogRef);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  data = inject<IDialogData<IUser>>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  selectedUser = signal<IUser | null>(null);
  roleList = signal<IDropdownItem[]>([]);
  selectedProfileImage = signal<IFile | null>(null);

  hide = signal(true);
  confirmHide = signal(true);

  private unlockRef!: MatDialogRef<unknown>;
  @ViewChild('confirm', { static: true }) confirm!: TemplateRef<unknown>;

  modalForm: FormGroup = this.fb.nonNullable.group(
    {
      id: [],
      name: [, Validators.required],
      contact_number: [],
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

  ngOnInit() {
    this.loadRoles();

    const userId = this.data?.formData?.id;
    if (userId) {
      if (!this.data?.isView) {
        this.modalForm.get('password')?.clearValidators();
        this.modalForm.get('confirmpassword')?.clearValidators();
        this.modalForm.get('password')?.updateValueAndValidity();
        this.modalForm.get('confirmpassword')?.updateValueAndValidity();
        this.modalForm.addControl('delete_image', this.fb.control(false));
      }
      this.loadUserDetail(userId);
    } else {
      this.loadUserCode();
    }
  }

  private loadRoles() {
    this.dropdownService.getMasterDropdown('roles').subscribe(roles => {
      this.roleList.set(roles || []);
    });
  }

  private loadUserCode() {
    this.userService.getUserCode().subscribe(code => {
      this.modalForm.get('code')?.setValue(code);
    });
  }

  private loadUserDetail(id: number) {
    this.userService.getUserDetail(id).subscribe((res: IUser) => {
      this.selectedUser.set(res);
      this.modalForm.patchValue(res);
      this.modalForm.patchValue({ password: '', confirmpassword: '' });
    });
  }

  get f() { return this.modalForm.controls; }

  unlockUser() {
    const id = this.modalForm.value.id || this.selectedUser()?.id;
    if (!id) return;

    this.isLoading.set(true);
    this.userService.unlockUser(id).subscribe({
      next: (res: IApiResponse) => {
        this.toastr.success(res.message, 'Success', { closeButton: true });
        this.modalForm.get('account_non_locked')?.setValue(true);
        this.selectedUser.update(u => u ? { ...u, account_non_locked: true } : u);
        this.closeAlert();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  showAlert() {
    this.unlockRef = this.dialog.open(this.confirm, {
      panelClass: 'slide-up',
      disableClose: true,
    });

    this.unlockRef.backdropClick().subscribe(() => this.closeAlert());
  }

  closeAlert() {
    this.unlockRef.removePanelClass('slide-up');
    this.unlockRef.addPanelClass('slide-up-close');

    setTimeout(() => this.unlockRef.close(), 400);
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) return;

    this.isLoading.set(true);
    const formData = this.modalForm.value;

    const finalData = new FormData();
    const profile = this.selectedProfileImage();
    if (profile?.file) {
      finalData.append('file', profile.file);
    }
    finalData.append('user', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

    const request$ = formData.id
      ? this.userService.updateUser(finalData, formData.id)
      : this.userService.createUser(finalData);

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
      error: () => this.isLoading.set(false),
    });
  }

  closeDialog(data?: IApiResponse) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

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
