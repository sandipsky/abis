import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private _breadcrumbService = inject(BreadcrumbService);

  breadcrumbs = toSignal(this._breadcrumbService.breadcrumbs$);
}
