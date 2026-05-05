import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

import { Button } from '@/shared/components/button/button';
import { ConfigurationService } from '@/shared/services/configuration.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IDialogData } from '@/shared/models/common.model';
import {
  ConfigInputType,
  IConfigItem,
  IConfigOption,
  getConfigInputType,
  getConfigOptions,
} from '@/modules/settings/configuration/configuration.model';

interface IConfigFormItem extends IConfigItem {
  type: ConfigInputType;
  options?: IConfigOption[];
}

@Component({
  selector: 'app-add-config-setup',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, Button],
  templateUrl: './add-config-setup.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConfigSetup implements OnInit {
  private _configurationService = inject(ConfigurationService);
  private _toastr = inject(ToastrService);
  private _dialogRef = inject<MatDialogRef<AddConfigSetup>>(MatDialogRef);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  data = inject<IDialogData<IConfigItem[]>>(MAT_DIALOG_DATA);

  readonly ConfigInputType = ConfigInputType;
  configItems = signal<IConfigFormItem[]>([]);
  modalForm: FormGroup = this._fb.group({});

  ngOnInit() {
    const items: IConfigFormItem[] = (this.data?.formData ?? []).map(item => ({
      ...item,
      type: getConfigInputType(item.name),
      options: getConfigOptions(item.name),
    }));

    this.configItems.set(items);

    items.forEach(item => {
      const initialValue = item.type === ConfigInputType.Toggle
        ? item.value === '1'
        : item.value ?? '';

      this.modalForm.addControl(
        item.name,
        this._fb.control({ value: initialValue, disabled: !item.is_editable }),
      );
    });
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    const raw = this.modalForm.getRawValue();
    const payload: IConfigItem[] = this.configItems().map(item => ({
      name: item.name,
      label: item.label,
      is_editable: item.is_editable,
      value: item.type === ConfigInputType.Toggle
        ? (raw[item.name] ? '1' : '0')
        : String(raw[item.name] ?? ''),
    }));

    this._spinnerService.setSpinner(true);
    this._configurationService.editConfigurations(payload).subscribe({
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
        this._dialogRef.close(data);
      } else {
        this._dialogRef.close();
      }
    }, 400);
  }
}
