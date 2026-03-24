import { Component, Input, Optional } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { IdGeneratorService } from './auto-code-generator.service';
import { AddCodeGeneratorComponent } from './add-auto-code-generator/add-auto-code-generator';

@Component({
  selector: 'app-auto-code',
  templateUrl: './auto-code-generator.html',
  styleUrls: ['./auto-code-generator.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AutoCodeGenerator {
  isLoading: boolean = false;
  autoCodeList: any[] = [];
  operationList: any[] = [];
  
  @Input() filterData: any[] = []
  @Input() editPermission: string = '';

  constructor(
    private toastr: ToastrService,
    public authService: AuthService,
    private service: IdGeneratorService,
    @Optional() private autoCodeDialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getIdConfig();
    this.operationList = this.authService.userPermissionList();
  }

  getIdConfig() {
    this.isLoading = true;
    this.service.getConfig().subscribe({
      next: (data) => {
        this.autoCodeList = this.filterData?.length
          ? data.filter((item: any) =>
            this.filterData.includes(item.item_name)
          )
          : data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error, 'Error', {
          closeButton: true,
        });
        this.isLoading = false;

      }
    });
  }

  openAutoCodeDialog(family?: any, i?: number) {
    let familyData = null;
    if (family) {
      familyData = { ...family, index: i }
    }
    this.autoCodeDialogRef = this.dialog.open(AddCodeGeneratorComponent, {
      panelClass: ['slide-left', 'drawer-right'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        formData: familyData
      }
    });

    this.autoCodeDialogRef.backdropClick().subscribe(() => {
      this.autoCodeDialogRef.removePanelClass('slide-left');
      this.autoCodeDialogRef.addPanelClass('slide-left-close');

      setTimeout(() => {
        this.autoCodeDialogRef.close();
      }, 400);
    });

    this.autoCodeDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getIdConfig();
      }
    });
  }

}
