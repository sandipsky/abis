import { Component, inject } from '@angular/core';
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
})
export class Sidebar {
  sidebarData = sidebarData;
  activeSubMenu: any = null;

  router = inject(Router);
  breadcrumbService = inject(BreadcrumbService);

  ngOnInit() {
    this.setActiveMenuFromUrl();
  }

  toggleSubMenu(item: any) {
    this.activeSubMenu = item;
  }

  clearSubMenu() {
    this.activeSubMenu = null;
  }

  setActiveMenuFromUrl() {
    const currentUrl = this.router.url;

    for (const group of this.sidebarData) {
      for (const item of group.items) {
        if (item.children) {
          const activeChild = item.children.find((child: any) =>
            currentUrl.includes(child.link)
          );

          if (activeChild) {
            this.activeSubMenu = item; 
            this.breadcrumbService.updateBreadcrumbs({
              label: activeChild.label,
              link: activeChild.link,
              prefix: item.label
            });
            return; 
          }
        }

        else if (currentUrl.includes(item.link)) {
          this.activeSubMenu = null; 
          this.breadcrumbService.updateBreadcrumbs({
            label: item.label,
            link: item.link
          });
          return; 
        }
      }
    }
  }

  updateBreadCrumb(label: string, link: string, prefix?: string) {
    this.breadcrumbService.updateBreadcrumbs(
      {
        label: label,
        link: link,
        prefix: prefix
      }
    );
  }
}
