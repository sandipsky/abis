import { ChangeDetectionStrategy, Component, Optional, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { AuthService } from '../../../auth/auth.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Configuration {

  public configSubscription!: Subscription;

  setupItems = signal<any[]>([
    {
      name: 'General Settings',
      items: [
        { name: 'Calendar Type', valueList: [{ id: "1", name: "AD" }, { id: "0", name: "BS" }], type: 'radio' },
        { name: 'Language', valueList: [{ id: "1", name: "English" }, { id: "0", name: "Nepali" }], type: 'radio' },
        { name: 'Theme', valueList: [{ id: "1", name: "Light" }, { id: "0", name: "Dark" }], type: 'radio' },
        { name: 'Accent Color', valueList: [{ id: "1", name: "Green" }, { id: "0", name: "Blue" }], type: 'radio' },
      ]
    }
  ]);

  public operationList: any = [];

  editMode = signal<boolean>(false);

  selectedTabIndex = signal<number>(0);
  selectedImg = signal<{ file: File | null, url: string, name: string } | null>(null);

  selectedGroup = computed(() => {
    return this.setupItems()[this.selectedTabIndex()] || null;
  });

  constructor(
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
    public authService: AuthService,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<any>,
    public spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.operationList = this.authService.userPermissionList();
  }

  selectTab(index: number) {
    this.selectedTabIndex.set(index);
  }

  applyTheme(themeValue: string) {
    this.configurationService.applyTheme(themeValue);
  }

  applyAccent(colorValue: string) {
    this.configurationService.applyAccent(colorValue);
  }

}