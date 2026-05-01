import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { MasterAccountService } from '@/modules/accounting/master-account/master-account.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import {
  IAccountTypeGroup,
  IAccountTypeOption,
  IMasterAccount,
  IParentAccount
} from '@/modules/accounting/master-account/master-account.model';
import { IDialogData } from '@/shared/models/common.model';

const ROOT_PARENT: IParentAccount = { id: 0, name: 'Root' };

@Component({
  selector: 'app-add-master-account',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, Button, FormValidation],
  templateUrl: './add-master-account.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMasterAccount {
  private masterAccountService = inject(MasterAccountService);
  private toastr = inject(ToastrService);
  private dialogRef = inject<MatDialogRef<AddMasterAccount>>(MatDialogRef);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  data = inject<IDialogData<IMasterAccount>>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  selectedAccount = signal<IMasterAccount | null>(null);
  accountTypeList = signal<IAccountTypeOption[]>([]);
  parentAccountList = signal<IParentAccount[]>([ROOT_PARENT]);

  modalForm: FormGroup = this.fb.nonNullable.group({
    id: [],
    account_code: [],
    account_name: [, Validators.required],
    account_type: [, Validators.required],
    parent_id: [0],
    parent_account_name: [],
    is_active: [true],
    remarks: [],
  });

  ngOnInit() {
    if (!this.data?.isView) {
      this.loadAccountTypes();
      this.modalForm.get('account_type')!.valueChanges.subscribe((accountType: string | null) => {
        this.modalForm.patchValue({ parent_id: 0, parent_account_name: ROOT_PARENT.name }, { emitEvent: false });
        this.loadParentAccounts(accountType);
      });
    }

    const accountId = this.data?.formData?.id;
    if (accountId) {
      this.loadMasterAccountDetail(accountId);
    }
  }

  private loadAccountTypes() {
    this.masterAccountService.getAccountTypes().subscribe((groups: IAccountTypeGroup[]) => {
      const flat: IAccountTypeOption[] = (groups || []).flatMap(g =>
        (g.types || []).map(t => ({ id: t, name: t, group: g.heading }))
      );
      this.accountTypeList.set(flat);
    });
  }

  private loadParentAccounts(accountType: string | null) {
    if (!accountType) {
      this.parentAccountList.set([ROOT_PARENT]);
      return;
    }
    this.masterAccountService.getParentAccount(accountType).subscribe((res: IParentAccount[]) => {
      this.parentAccountList.set([ROOT_PARENT, ...(res || [])]);
    });
  }

  private loadMasterAccountDetail(id: number) {
    this.masterAccountService.getMasterAccountDetail(id).subscribe((res: IMasterAccount) => {
      this.selectedAccount.set(res);

      if (!this.data?.isView && res?.account_type) {
        this.masterAccountService.getParentAccount(res.account_type).subscribe((parents: IParentAccount[]) => {
          this.parentAccountList.set([ROOT_PARENT, ...(parents || [])]);
          this.modalForm.patchValue(res, { emitEvent: false });
        });
      } else {
        this.modalForm.patchValue(res, { emitEvent: false });
      }
    });
  }

  get f() { return this.modalForm.controls; }

  onParentChange(parent: IParentAccount | null) {
    this.modalForm.patchValue({
      parent_account_name: parent?.name ?? ROOT_PARENT.name
    }, { emitEvent: false });
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const formData = this.modalForm.value;

    const request$ = formData.id
      ? this.masterAccountService.updateMasterAccount(formData, formData.id)
      : this.masterAccountService.createMasterAccount(formData);

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
}
