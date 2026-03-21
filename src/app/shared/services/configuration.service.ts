import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
    private configuration = new BehaviorSubject<any>({ dateType: 'BS' });
    configuration$ = this.configuration.asObservable();

    updateBreadcrumbs(item: any) {
        this.configuration.next(item);
    }
}