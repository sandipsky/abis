import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { IDocumentNumberScheme } from '@/features/settings/document-number-scheme/document-number-scheme.model';

@Injectable({ providedIn: 'root' })
export class DocumentNumberSchemeService {
    private _http = inject(HttpClient);
    readonly apiUrl = environment.apiUrl + '/documentNumber';

    private _documentNumbers$ = new BehaviorSubject<IDocumentNumberScheme[]>([]);
    readonly documentNumbers$ = this._documentNumbers$.asObservable();

    get documentNumbers(): IDocumentNumberScheme[] {
        return this._documentNumbers$.value;
    }

    getDocumentNumbers(): Observable<IDocumentNumberScheme[]> {
        return this._http.get<IDocumentNumberScheme[]>(this.apiUrl).pipe(
            tap(items => this._documentNumbers$.next(items ?? []))
        );
    }

    getCurrentNumber(url: string): Observable<string> {
        return this._http.get(url, { responseType: 'text' });
    }
}
