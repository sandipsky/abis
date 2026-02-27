import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  breadcrumbs!: Breadcrumb;

  private destroy$ = new Subject<void>();

  constructor(public breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(crumbs => {
        this.breadcrumbs = crumbs;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
