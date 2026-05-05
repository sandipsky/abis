import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IApiResponse } from '@/shared/models/api-response.model';
import type { IConfigItem } from '@/features/settings/configuration/configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
    private _http = inject(HttpClient);
    readonly apiUrl = environment.apiUrl + '/configurations';

    private _configurations$ = new BehaviorSubject<IConfigItem[]>([]);
    readonly configurations$ = this._configurations$.asObservable();

    get configurations(): IConfigItem[] {
        return this._configurations$.value;
    }

    getConfigurations(): Observable<IConfigItem[]> {
        return this._http.get<IConfigItem[]>(this.apiUrl).pipe(
            tap(configs => this._configurations$.next(configs ?? []))
        );
    }

    editConfigurations(data: IConfigItem[]): Observable<IApiResponse> {
        return this._http.put<IApiResponse>(`${this.apiUrl}/edit`, data).pipe(
            tap(res => {
                if (res?.success) {
                    this.getConfigurations().subscribe();
                }
            })
        );
    }
}
