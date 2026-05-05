import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IAccountTypeGroup, IMasterAccount, IParentAccount } from './master-account.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterAccountService {
  readonly apiUrl = environment.apiUrl + '/accountMaster';
  private _http = inject(HttpClient);

  getMasterAccountList(filters: IPaginatedRequest): Observable<IPaginatedResponse<IMasterAccount>> {
    return this._http.post<IPaginatedResponse<IMasterAccount>>(`${this.apiUrl}/view`, filters);
  }

  getMasterAccountDetail(id: number): Observable<IMasterAccount> {
    return this._http.get<IMasterAccount>(`${this.apiUrl}/${id}`);
  }

  createMasterAccount(data: IMasterAccount): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, data);
  }

  updateMasterAccount(data: IMasterAccount, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteMasterAccount(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }

  getAccountTypes(): Observable<IAccountTypeGroup[]> {
    return this._http.get<IAccountTypeGroup[]>(`${this.apiUrl}/getAccountTypes`);
  }

  getParentAccount(accountTypeName: string): Observable<IParentAccount[]> {
    return this._http.get<IParentAccount[]>(`${this.apiUrl}/getParentAccount/${encodeURIComponent(accountTypeName)}`);
  }
}
