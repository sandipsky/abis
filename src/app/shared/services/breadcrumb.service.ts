import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  link: string;
  prefix?: string; 
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbsSource = new BehaviorSubject<Breadcrumb>({ label: 'Home', link: 'dashboard', prefix: 'a' });
  breadcrumbs$ = this.breadcrumbsSource.asObservable();

  updateBreadcrumbs(item: Breadcrumb) {
    this.breadcrumbsSource.next(item);
  }
}