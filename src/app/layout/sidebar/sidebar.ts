import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import sidebarData from './sidebar-data';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatTooltipModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  sidebarData = sidebarData;
  activeSubMenu = signal<any>(null);

  private _router = inject(Router);
  private _breadcrumbService = inject(BreadcrumbService);

  ngOnInit() {
    this.setActiveMenuFromUrl();
  }

  toggleSubMenu(item: any) {
    this.activeSubMenu.set(item);
  }

  clearSubMenu() {
    this.activeSubMenu.set(null);
  }

  setActiveMenuFromUrl() {
    const currentUrl = this._router.url;

    for (const group of this.sidebarData) {
      for (const item of group.items) {
        if (item.children) {
          const activeChild = item.children.find((child: any) =>
            currentUrl.includes(child.link)
          );

          if (activeChild) {
            this.activeSubMenu.set(item);
            this._breadcrumbService.updateBreadcrumbs({
              label: activeChild.label,
              link: activeChild.link,
              prefix: item.label
            });
            return;
          }
        }

        else if (currentUrl.includes(item.link)) {
          this.activeSubMenu.set(null);
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
