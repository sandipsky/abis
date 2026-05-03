import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '@/shared/services/breadcrumb.service';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Menu } from '@/shared/components/menu/menu';
import { Button } from '@/shared/components/button/button';
import { Icon } from '@/shared/components/icon/icon';
import sidebarData from './sidebar.data';
import { AuthService } from '@/auth/auth.service';

interface SidebarItem {
  link: string;
  label: string;
  tooltip: string;
  icon: string;
  permission?: string | string[] | boolean;
  children?: SidebarItem[];
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

interface QuickAddSubItem {
  name: string;
  type?: ComponentType<unknown>;
}

interface QuickAddItem {
  name: string;
  color: string;
  icon: string;
  items: QuickAddSubItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatTooltipModule, RouterModule, Menu, Button, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  sidebarData = sidebarData as SidebarGroup[];
  activeSubMenu = signal<SidebarItem | null>(null);
  isCollapsed = model<boolean>(false);
  showSubMenuAnimation = signal(false);

  private _router = inject(Router);
  private _breadcrumbService = inject(BreadcrumbService);
  private _dialog = inject(MatDialog);
  private _authService = inject(AuthService);

  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);

  quickAddItems: QuickAddItem[] = [
    {
      name: 'Purchase',
      color: '#AB20A9',
      icon: 'purchase',
      items: [
        { name: 'Purchase Orders' },
        { name: 'Purchase' },
        { name: 'Purchase Return' },
        { name: 'Vendor' }
      ]
    },
    {
      name: 'Sales',
      color: '#00B8D9',
      icon: 'sales',
      items: [
        { name: 'Sales' },
        { name: 'Sales Return' },
        { name: 'Sales Order' },
        { name: 'B/D/E' },
        { name: 'Customer' }
      ]
    },
    {
      name: 'Inventory',
      color: '#006AE4',
      icon: 'inventory',
      items: [
        { name: 'Stock Adjustment' },
        { name: 'Stock Edit' },
        { name: 'Opening Stock' }
      ]
    },
    {
      name: 'Accounting',
      color: '#E89C00',
      icon: 'accounting',
      items: [
        { name: 'Journal Entry' },
        { name: 'Payment' },
        { name: 'Payment Adjustment' },
        { name: 'Opening Balance' },
        { name: 'Account' }
      ]
    }
  ];

  constructor() {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncMenuWithUrl();
    });
  }

  toggleSidebar() {
    this.isCollapsed.update(val => !val);
  }

  toggleSubMenu(item: SidebarItem) {
    this.activeSubMenu.set(item);
    setTimeout(() => {
      this.showSubMenuAnimation.set(true);
    }, 10);

    if (item.children && item.children.length) {
      const firstAllowedChild = item.children.find(child =>
        this.hasPermission(child.permission)
      );

      if (firstAllowedChild) {
        this._router.navigate([firstAllowedChild.link]);

        this.updateBreadCrumb(
          firstAllowedChild.label,
          firstAllowedChild.link,
          item.label
        );
      }
    }
  }

  clearSubMenu() {
    this.showSubMenuAnimation.set(false);
    setTimeout(() => {
      this.activeSubMenu.set(null);
      this._router.navigate(['dashboard']);
    }, 200);
  }

  openQuickAdd(item: QuickAddSubItem) {
    if (item.type) {
      this._dialog.open(item.type);
    }
  }

  hasPermission(permission: string | string[] | boolean | undefined): boolean {
    if (permission === true) {
      return true;
    }

    if (Array.isArray(permission)) {
      return permission.some(p => this.operationList().includes(p));
    }

    if (typeof permission === 'string') {
      return this.operationList().includes(permission);
    }

    return false;
  }

  hasChildPermission(children: SidebarItem[]): boolean {
    return children?.some(child => this.hasPermission(child.permission));
  }

  syncMenuWithUrl() {
    const currentUrl = this._router.url;

    for (const group of this.sidebarData) {
      for (const item of group.items) {
        if (item.children) {
          const activeChild = item.children.find(child =>
            currentUrl == '/' + child.link
          );

          if (activeChild) {
            this.activeSubMenu.set(item);
            setTimeout(() => {
              this.showSubMenuAnimation.set(true);
            }, 10);
            this._breadcrumbService.updateBreadcrumbs({
              label: activeChild.label,
              link: activeChild.link,
              prefix: item.label
            });
            return;
          }
        } else if (currentUrl.includes(item.link)) {
          this.showSubMenuAnimation.set(false);
          setTimeout(() => {
            this.activeSubMenu.set(null);
          }, 200);
          this._breadcrumbService.updateBreadcrumbs({
            label: item.label,
            link: item.link
          });
          return;
        }
      }
    }
  }

  updateBreadCrumb(label: string, link: string, prefix?: string) {
    this._breadcrumbService.updateBreadcrumbs(
      {
        label: label,
        link: link,
        prefix: prefix
      }
    );
  }
}
