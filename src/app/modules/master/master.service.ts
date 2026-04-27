import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterItem } from './master.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { PaginatedRequest } from '../../shared/models/paginated-request.model';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  readonly apiUrl = environment.apiUrl + '/master';
  private _http = inject(HttpClient);

  getMasterList(filters: PaginatedRequest, endPoint: string,): Observable<PaginatedResponse<MasterItem>> {
    return this._http.post<PaginatedResponse<MasterItem>>(`${this.apiUrl}/${endPoint}/view`, filters);
  }

  getMasterDetail(id: number, endPoint: string): Observable<MasterItem> {
    return this._http.get<MasterItem>(`${this.apiUrl}/${endPoint}/${id}`);
  }

  createMaster(masterData: MasterItem, endPoint: string): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this.apiUrl}/${endPoint}`, masterData);
  }

  updateMaster(masterData: MasterItem, endPoint: string): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this.apiUrl}/${endPoint}/${masterData.id}`, masterData);
  }

  deleteMaster(id: number, endPoint: string): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this.apiUrl}/${endPoint}/${id}`);
  }
}
