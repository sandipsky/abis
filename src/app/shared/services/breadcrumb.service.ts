import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  link: string;
  prefix?: string; 
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private _breadcrumbsSource = new BehaviorSubject<Breadcrumb>({ label: 'Home', link: 'dashboard', prefix: 'a' });
  breadcrumbs$ = this._breadcrumbsSource.asObservable();

  updateBreadcrumbs(item: Breadcrumb) {
    this._breadcrumbsSource.next(item);
  }
}