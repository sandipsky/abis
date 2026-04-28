import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterItem } from './master.model';
import { IApiResponse } from '../../shared/models/api-response.model';
import { IPaginatedRequest } from '../../shared/models/paginated-request.model';
import { IPaginatedResponse } from '../../shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  readonly apiUrl = environment.apiUrl + '/master';
  private _http = inject(HttpClient);

  getMasterList(filters: IPaginatedRequest, endPoint: string,): Observable<IPaginatedResponse<MasterItem>> {
    return this._http.post<IPaginatedResponse<MasterItem>>(`${this.apiUrl}/${endPoint}/view`, filters);
  }

  getMasterDetail(id: number, endPoint: string): Observable<MasterItem> {
    return this._http.get<MasterItem>(`${this.apiUrl}/${endPoint}/${id}`);
  }

  createMaster(masterData: MasterItem, endPoint: string): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}/${endPoint}`, masterData);
  }

  updateMaster(masterData: MasterItem, endPoint: string): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${endPoint}/${masterData.id}`, masterData);
  }

  deleteMaster(id: number, endPoint: string): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${endPoint}/${id}`);
  }
}
