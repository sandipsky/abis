import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IUser } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly apiUrl = environment.apiUrl + '/users';
  private _http = inject(HttpClient);

  getUserList(filters: IPaginatedRequest): Observable<IPaginatedResponse<IUser>> {
    return this._http.post<IPaginatedResponse<IUser>>(`${this.apiUrl}/view`, filters);
  }

  getUserDetail(id: number): Observable<IUser> {
    return this._http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  getUserImageByUrl(url: string): Observable<Blob> {
    return this._http.get(environment.apiUrl + url, {
      responseType: 'blob',
    });
  }

  getUserImage(id: number): Observable<Blob> {
    return this._http.get(`${this.apiUrl}/image/${id}`, {
      responseType: 'blob',
    });
  }

  createUser(userData: FormData): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, userData);
  }

  updateUser(userData: FormData, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }

  unlockUser(id: number): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}/unlock/${id}`, {});
  }
}
