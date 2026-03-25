import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  apiUrl = environment.apiUrl + '/master/roles'

  constructor(private _http: HttpClient) { }

  getAllRoles() {
    return this._http.get<any>(this.apiUrl);
  }

  getRolesList(filterData: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/view`, filterData);
  }

  getRolesAndOperations(id: number) {
    return this._http.get<any>(this.apiUrl + '/' + id);
  }

  createRolesAndOperations(formData: any) {
    return this._http.post(this.apiUrl, formData);
  }

  updateRolesAndOperations(formData: any, id: number) {
    return this._http.put(this.apiUrl + '/' + id, formData);
  }

  changeRoleStatus(formData: any, id: number) {
    return this._http.put(`${environment.apiUrl}/master/updateStatus/${id}/${formData.status}`, {});
  }

  deleteRolesAndOperations(id: number) {
    return this._http.delete(this.apiUrl + '/' + id);
  }

  updateUserRole(id: number, data: any): Observable<any> {
    return this._http.put(environment.apiUrl + `/master/roles/usersInfo/${id}`, data);
  }

}
