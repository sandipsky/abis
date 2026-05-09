import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IPurchaseEntry } from './purchase-entry.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseEntryService {
  readonly apiUrl = environment.apiUrl + '/purchase-entry';
  private _http = inject(HttpClient);

  getPurchaseEntryList(filters: IPaginatedRequest): Observable<IPaginatedResponse<IPurchaseEntry>> {
    return this._http.post<IPaginatedResponse<IPurchaseEntry>>(`${this.apiUrl}/view`, filters);
  }

  getPurchaseEntryDetail(id: number): Observable<IPurchaseEntry> {
    return this._http.get<IPurchaseEntry>(`${this.apiUrl}/${id}`);
  }

  createPurchaseEntry(data: IPurchaseEntry): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, data);
  }

  updatePurchaseEntry(data: IPurchaseEntry, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, data);
  }

  deletePurchaseEntry(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }
}
