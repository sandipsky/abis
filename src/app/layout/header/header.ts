import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuComponent } from '../../shared/components/menu/menu';
import { NotificationService } from '../../shared/services/websocket.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MenuComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private _breadcrumbService = inject(BreadcrumbService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);

  breadcrumbs = toSignal(this._breadcrumbService.breadcrumbs$);

  userName = signal<string>(localStorage.getItem('userName') ?? 'Guest');
  role = signal<string>(localStorage.getItem('role') ?? 'User');
  fiscalYear = signal<string>(localStorage.getItem('fiscalYear') ?? '2082-83');
  notifications = signal<any[]>([]);

  private _newNotification = toSignal(this._notificationService.getNotifications());

  constructor() {
    effect(() => {
      const latest = this._newNotification();
      if (latest) {
        this.notifications.update(current => [latest, ...current]);
      }
    });
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
}
