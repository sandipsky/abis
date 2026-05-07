import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDocumentNumberScheme } from './document-number-scheme.model';

@Injectable({ providedIn: 'root' })
export class DocumentNumberSchemeService {
  readonly apiUrl = environment.apiUrl + '/documentNumbering';
  private _http = inject(HttpClient);

  getDocumentNumberList(): Observable<IDocumentNumberScheme[]> {
    return this._http.get<IDocumentNumberScheme[]>(this.apiUrl);
  }
}
