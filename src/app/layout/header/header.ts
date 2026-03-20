import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Menu } from '../../shared/components/menu/menu';
import { NotificationService } from '../../shared/services/websocket.service';
import { Calculator } from '../../shared/components/calculator/calculator';
import { MatDialog } from '@angular/material/dialog';
import { RangePrintComponent } from '../../shared/components/range-print/range-print';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Menu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private _breadcrumbService = inject(BreadcrumbService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);
  private _dialog = inject(MatDialog);

  breadcrumbs = toSignal(this._breadcrumbService.breadcrumbs$);

  userName = signal<string>(localStorage.getItem('userName') ?? 'Guest');
  role = signal<string>(localStorage.getItem('role') ?? 'User');
  fiscalYear = signal<string>(localStorage.getItem('fiscalYear') ?? '2082-83');
  notifications = signal<any[]>([]);

  // private _newNotification = toSignal(this._notificationService.getNotifications());

  constructor() {
    // effect(() => {
    //   const latest = this._newNotification();
    //   if (latest) {
    //     this.notifications.update(current => [latest, ...current]);
    //   }
    // });
  }

  returnHome() {
    this._router.navigate(['dashboard']);
  }

  clearAllNotifications() {
    this.notifications.set([]);
  }

  clearNotification(id: number) {
    this.notifications.update(n => n.filter(notif => notif.id !== id));
  }

  openCalculator() {
    this._dialog.open(Calculator, {
      disableClose: true,
      width: '328px',
    })
  }

  openRangePrint() {
    const dialogRef = this._dialog.open(RangePrintComponent, {
      disableClose: true,
      panelClass: ['slide-left', 'drawer-right'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    })

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-left');
      dialogRef.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });
  }
}
