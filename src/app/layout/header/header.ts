import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuComponent } from '../../shared/components/menu/menu';
import { Sidebar } from '../sidebar/sidebar';

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
  // private _sidebar = inject(Sidebar);

  breadcrumbs = toSignal(this._breadcrumbService.breadcrumbs$);

  userName = signal<string>('Sandip Shakya');
  role = signal<string>('Admin');
  fiscalYear = signal<string>('2082-83');
  notifications = signal<any[]>([]);

  returnHome() {
    this._router.navigate(['dashboard']);
    // this._sidebar.setActiveMenuFromUrl();
  }

  clearAllNotifications() {

  }

  clearNotification(id: number) {

  }
}
