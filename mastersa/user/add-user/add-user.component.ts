import { Component, Inject, inject, Optional, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { DropdownsService } from 'src/app/services/dropdowns.service';
import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';

import { AuthService } from 'src/app/auth/auth.service';

import { MastersInlineModalComponent } from 'src/app/components/masters-inline-modal/masters-inline-modal.component';
import { masterModel } from 'src/app/master/master.model';
import { UnitMasterService } from '../../master.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, SharedModule],
  templateUrl: './add-user.html',
  standalone: true
})
export class AddUserComponent {
  modalForm: FormGroup;
  endPoint = 'users';
  isLoading = false;
  companyDetails: any;
  selectedUser: any;

  selectedProfileImage: any = null;
  deleteImage: boolean = false;

  public operationList: any = [];

  organizationalRoleList: any;
  functionalRoleList: any;
  designationList: any;

  public hide: boolean = true;
  public confirmHide: boolean = true;
  public currentHide: boolean = true;

  @ViewChild('confirm', { static: true }) confirm!: TemplateRef<any>;

  constructor(
    private masterService: UnitMasterService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    @Optional() private unlockRef: MatDialogRef<any>,
    private dropdown: DropdownsService,
    private configService: ConfigServiceService,
    private fb: FormBuilder,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: null,
      name: ['', Validators.required],
      contact_number: '',
      gender: '',
      remarks: '',
      user_name: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
      ]],
      confirmpassword: [''],
      role_set: [],
      org_id: [],
      account_non_locked: [true],
      functional_id: [],
      designation_id: [, Validators.required],
      enabled: [true],
      login_status: [true],
      code: []
    },

      { validators: this.passwordMatchValidator },
    );

    if (data?.formData?.id) {
      if (data.isView == true) {
        this.getUserDetail(data?.formData?.id);
      }
      else {
        this.modalForm.get('password')?.clearValidators();
        this.modalForm.get('confirmpassword')?.clearValidators();
        this.modalForm.get('password')?.updateValueAndValidity();
        this.modalForm.get('confirmpassword')?.updateValueAndValidity();
        this.modalForm.addControl('delete_image', this.fb.control(false));
        this.getUserDetail(data?.formData?.id);
      }
    }
  }


  ngOnInit() {
    this.operationList = this.authService.userPermissionList();
    if (!this.data?.formData) {
      this.masterService.getMasterCode('users').subscribe({
        next: (res: any) => {
          this.modalForm.get('code')?.setValue(res);
        },
      });
    }
    this.getDesignationList();
    this.getRoles();
  }

  get f() { return this.modalForm.controls; }

  getDesignationList() {
    this.dropdown.getDesignationDropdown().subscribe({
      next: (res: any) => {
        this.designationList = res;
      },
      error: (err) => {
        err?.error?.messages?.forEach((message: any) => {
          this.toastr.error(message.message, 'Error', {
            closeButton: true,
          });
        });
      },
    })
  }

  getRoles(): void {
    this.dropdown.getRoles()
      .subscribe(roles => {
        this.organizationalRoleList = roles.filter((role: any) => role.is_organizational == true).map((role: any) => { return { id: role.id, name: role.name } });
        this.functionalRoleList = roles.filter((role: any) => role.is_organizational == false).map((role: any) => { return { id: role.id, name: role.name } });
      })
  }


  async onSelectProfileImage(event: any): Promise<void> {
    if (!event.target.files) {
      this.selectedProfileImage = null;
      return;
    }

    let file = event.target.files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
      this.toastr.error(
        'Please upload only jpg, jpeg, png or pdf files',
        'Error',
        { closeButton: true }
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error("File size exceeds 5MB limit", 'Error', { closeButton: true });
      this.selectedProfileImage = null;
      return;
    }

    try {
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        this.selectedProfileImage = {
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: this.formatFileSize(file.size)
        };
        this.deleteImage = true;
      }
      else {
        this.selectedProfileImage = null;
      }
    } catch (error) {
      this.toastr.error("Failed to compress image", 'Error');
    }
  }

  formatFileSize(size: number): string {
    const kb = size / 1024;
    if (kb < 1024) {
      return kb.toFixed(1) + " KB";
    }
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }


  onAddItem(event: any, formcontrolName: string, data: any) {
    if (event != undefined && event.id == undefined) {
      this.openInlineDialog(formcontrolName, data, event?.name);
      return;
    }
  }

  openInlineDialog(formcontrolName: string, dialogData: any, name: string) {
    const dialogRef = this.dialog.open(MastersInlineModalComponent, {
      panelClass: ['slide-up'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: { item: dialogData, name: name }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-up');
      dialogRef.addPanelClass('slide-down');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.designationList = [result, ...this.designationList];
      }
      else {
        this.designationList = [...this.designationList];
      }
    });
  }

  unlockUser() {
    this.isLoading = true;
    this.masterService.unlockUser(this.modalForm.value.id || this.selectedUser.id).subscribe(
      {
        next: (res: any) => {
          res?.messages?.forEach((message: any) => {
            this.toastr.success(message.message, 'Success', {
              closeButton: true,
            });
          })
          this.modalForm.get('account_non_locked')?.setValue(true);
          this.selectedUser.account_non_locked = true;
          this.closeAlert();
          this.isLoading = false;
        },
        error: (err) => {
          err?.error?.messages?.forEach((message: any) => {
            this.toastr.error(message.message, 'Error', {
              closeButton: true,
            });
          });
          this.isLoading = false;
        },
      }
    )
  }

  showAlert() {
    this.unlockRef = this.dialog.open(this.confirm, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    this.unlockRef.backdropClick().subscribe(() => {
      this.closeAlert();
    });
  }

  closeAlert() {
    this.unlockRef.removePanelClass('slide-up');
    this.unlockRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this.unlockRef.close();
    }, 400);
  }

  getUserDetail(id: number) {
    this.masterService.getUserDetail(id)
      .subscribe((res: any) => {
        this.selectedUser = res[0]
        this.modalForm.patchValue(this.selectedUser)
        this.modalForm.patchValue({ password: '' })
        this.modalForm.patchValue({ confirmpassword: '' })

        let functionalRoles = this.selectedUser?.role_set.filter((role: any) => this.functionalRoleList?.map((r: any) => r?.id).includes(role?.id))
        let orgRoles = this.selectedUser?.role_set.filter((role: any) => this.organizationalRoleList?.map((r: any) => r?.id).includes(role?.id))

        this.selectedUser.org_roles = orgRoles?.map((r: any) => r.name);
        this.selectedUser.functional_roles = functionalRoles?.map((r: any) => r.name);

        this.modalForm.patchValue({ org_id: orgRoles?.map((r: any) => r.id) })
        this.modalForm.patchValue({ functional_id: functionalRoles?.map((r: any) => r.id) })

        if (this.selectedUser.profile_Picture_file_name) {
          fetch(`${environment.apiUrl}/master/profilePics/${this.selectedUser.id}`, {
            headers: { Authorization: `Bearer ${this.authService.getToken()}` }
          })
            .then(resp => resp.blob())
            .then(blob => {
              this.selectedProfileImage = {
                file: null,
                url: URL.createObjectURL(blob),
                name: res.profile_Picture_file_name
                ,
                size: this.formatFileSize(blob.size)
              };
            });
        }
      })
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this.isLoading = true;

    let role_set: any[] = [];

    if (this.modalForm.value.org_id != null && this.modalForm.value.org_id.length > 0) {
      this.modalForm.value.org_id.forEach((orgId: any) => {
        role_set.push({ id: orgId })
      })
    }

    if (this.modalForm.value.functional_id != null && this.modalForm.value.functional_id.length > 0) {
      this.modalForm.value.functional_id.forEach((funcId: any) => {
        role_set.push({ id: funcId })
      })
    }

    const formData = { ...this.modalForm.value, role_set: role_set };
    // Object.keys(formData).forEach(key => {
    //   if (formData[key] === '') {
    //     formData[key] = null;
    //   }
    // });

    let finalData = new FormData();
    let jsonPayload = JSON.stringify(formData);

    if (this.selectedProfileImage != null) {
      finalData.append('file', this.selectedProfileImage.file);
    }

    finalData.append('user', new Blob([jsonPayload], { type: "application/json" }));

    const request$ = formData.id
      ? this.masterService.updateMaster(finalData, formData.id, this.endPoint)
      : this.masterService.createMaster(finalData, this.endPoint);

    request$.subscribe({
      next: (res: any) => {
        if (res?.success == true) {
          this.isLoading = false;
          this.closeDialog(res);
          res?.messages?.forEach((message: any) => {
            this.toastr.success(message.message, 'Success', {
              closeButton: true,
            });
          });

        }
        else {
          res?.messages?.forEach((message: any) => {
            this.toastr.error(message.message, 'Error', {
              closeButton: true,
            });
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        err?.error?.messages?.forEach((message: any) => {
          this.toastr.error(message.message, 'Error', {
            closeButton: true,
          });
        });
        this.isLoading = false;
      },
    })
  }

  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      }
      else {
        this.dialogRef.close();
      }

    }, 400);
  }

  isRequiredInvalid(fieldName: string): boolean {
    const field = this.modalForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['required']
    );
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

  hasMinLength() {
    return this.passwordValue.length >= 8;
  }

  hasUpperLower() {
    return /(?=.*[a-z])(?=.*[A-Z])/.test(this.passwordValue);
  }

  hasNumber() {
    return /(?=.*\d)/.test(this.passwordValue);
  }

  hasSpecialChar() {
    return /(?=.*[!@#$%^&*])/.test(this.passwordValue);
  }
}
