import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IPermissionMasterModule, IRolesPermission } from './roles-permission.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionService {
  readonly apiUrl = environment.apiUrl + '/roles';
  private _http = inject(HttpClient);

  getRolesPermissionList(filters: IPaginatedRequest): Observable<IPaginatedResponse<IRolesPermission>> {
    return this._http.post<IPaginatedResponse<IRolesPermission>>(`${this.apiUrl}/view`, filters);
  }

  getRolesPermissionDetail(id: number): Observable<IRolesPermission> {
    return this._http.get<IRolesPermission>(`${this.apiUrl}/${id}`);
  }

  createRolesPermission(data: IRolesPermission): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, data);
  }

  updateRolesPermission(data: IRolesPermission, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteRolesPermission(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }

  getRoleOperations(roleId: number): Observable<IPermissionMasterModule[]> {
    return this._http.get<IPermissionMasterModule[]>(`${this.apiUrl}/operations/${roleId}`);
  }
}
