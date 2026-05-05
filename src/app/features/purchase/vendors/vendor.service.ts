import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IVendor } from './vendor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  readonly apiUrl = environment.apiUrl + '/vendor';
  private _http = inject(HttpClient);

  getVendorList(filters: IPaginatedRequest): Observable<IPaginatedResponse<IVendor>> {
    return this._http.post<IPaginatedResponse<IVendor>>(`${this.apiUrl}/view`, filters);
  }

  getVendorDetail(id: number): Observable<IVendor> {
    return this._http.get<IVendor>(`${this.apiUrl}/${id}`);
  }

  createVendor(vendorData: IVendor): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, vendorData);
  }

  updateVendor(vendorData: IVendor, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, vendorData);
  }

  deleteVendor(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }
}
