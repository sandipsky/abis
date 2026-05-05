import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@/auth/auth.service';
import { ConfigurationService } from '@/features/settings/configuration/configuration.service';

import { Button } from '@/shared/components/button/button';
import { AddConfigSetup } from './add-config-setup/add-config-setup';
import {
  ConfigInputType,
  IConfigItem,
  getConfigDisplayValue,
  getConfigInputType,
} from './configuration.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss',
  standalone: true,
  imports: [CommonModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configuration {
  private _configurationService = inject(ConfigurationService);
  private _authService = inject(AuthService);
  private _dialog = inject(MatDialog);

  configList = toSignal(this._configurationService.configurations$, { initialValue: [] as IConfigItem[] });
  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);

  readonly ConfigInputType = ConfigInputType;

  hasPermission(permission: string): boolean {
    return this.operationList().includes(permission) || true;
  }

  showForm() {
    const dialogRef = this._dialog.open(AddConfigSetup, {
      panelClass: ['drawer-right', 'slide-left'],
      disableClose: true,
      data: { formData: this.configList() },
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef?.removePanelClass('slide-left');
      dialogRef?.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef?.close();
      }, 400);
    });
  }

  getDisplayValue(item: IConfigItem): string {
    return getConfigDisplayValue(item);
  }

  getInputType(name: string): ConfigInputType {
    return getConfigInputType(name);
  }
}
