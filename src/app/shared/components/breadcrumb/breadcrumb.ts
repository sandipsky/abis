import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbService } from '@/shared/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb {
  private _breadcrumbService = inject(BreadcrumbService);
  private _router = inject(Router);

  welcomeName = input<string>('');
  homeLabel = input<string>('Home');
  homeRoute = input<string>('dashboard');

  breadcrumbs = toSignal(this._breadcrumbService.breadcrumbs$);

  title = computed(() => {
    const crumb = this.breadcrumbs();
    if (crumb?.label === 'Dashboard' && this.welcomeName()) {
      return `Welcome, ${this.welcomeName()}`;
    }
    return crumb?.label ?? '';
  });

  returnHome() {
    this._router.navigate([this.homeRoute()]);
  }
}
