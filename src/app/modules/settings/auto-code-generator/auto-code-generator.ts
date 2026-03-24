import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
export class AutoCodeGenerator implements OnInit {
  // 1. Modern Dependency Injection using inject()
  private toastr = inject(ToastrService);
  public authService = inject(AuthService);
  private service = inject(IdGeneratorService);
  private dialog = inject(MatDialog);

  // 2. State converted to Signals
  autoCodeList = signal<any[]>([]);
  operationList = signal<any[]>([]);

  ngOnInit(): void {
    this.getIdConfig();
    this.operationList.set(this.authService.userPermissionList() || []);
  }

  getIdConfig() {
    this.service.getConfig().subscribe({
      next: (data) => {
        this.autoCodeList.set(data); // Updating signal value
      },
      error: (err) => {
        this.toastr.error(err?.error?.error, 'Error', {
          closeButton: true,
        });
      }
    });
  }

  openAutoCodeDialog(family?: any, i?: number) {
    const familyData = family ? { ...family, index: i } : null;

    const dialogRef = this.dialog.open(AddCodeGeneratorComponent, {
      panelClass: ['slide-left', 'drawer-right'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: { formData: familyData }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-left');
      dialogRef.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getIdConfig();
      }
    });
  }
}