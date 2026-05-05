import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { MasterAccountService } from '@/features/accounting/master-account/master-account.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import {
  IAccountTypeGroup,
  IAccountTypeOption,
  IMasterAccount,
  IParentAccount
} from '@/features/accounting/master-account/master-account.model';
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
  private _masterAccountService = inject(MasterAccountService);
  private _toastr = inject(ToastrService);
  private _dialogRef = inject<MatDialogRef<AddMasterAccount>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<IMasterAccount>>(MAT_DIALOG_DATA);

  selectedAccount = signal<IMasterAccount | null>(null);
  accountTypeList = signal<IAccountTypeOption[]>([]);
  parentAccountList = signal<IParentAccount[]>([ROOT_PARENT]);

  modalForm: FormGroup = this._fb.nonNullable.group({
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
    this._masterAccountService.getAccountTypes().subscribe((groups: IAccountTypeGroup[]) => {
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
    this._masterAccountService.getParentAccount(accountType).subscribe((res: IParentAccount[]) => {
      this.parentAccountList.set([ROOT_PARENT, ...(res || [])]);
    });
  }

  private loadMasterAccountDetail(id: number) {
    this._masterAccountService.getMasterAccountDetail(id).subscribe((res: IMasterAccount) => {
      this.selectedAccount.set(res);

      if (!this.data?.isView && res?.account_type) {
        this._masterAccountService.getParentAccount(res.account_type).subscribe((parents: IParentAccount[]) => {
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

    this._spinnerService.setSpinner(true);
    const formData = this.modalForm.value;

    const request$ = formData.id
      ? this._masterAccountService.updateMasterAccount(formData, formData.id)
      : this._masterAccountService.createMasterAccount(formData);

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
}
