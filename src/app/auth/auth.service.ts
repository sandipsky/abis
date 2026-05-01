import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SKIP_ERROR_TOAST } from '@/shared/interceptors/error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _http = inject(HttpClient);
  private _router = inject(Router);

  getFiscalYearDropdown(): Observable<any> {
    return this._http.get<any>(environment.apiUrl + '/dropdown/fiscalYear/switch');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    let authToken = localStorage.getItem('token');
    return authToken !== null ? true : false;
  }

  login(loginData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Fiscalyear': "2082-83",
      'Iscurrent': 'Yes'
    });
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    return this._http
      .post<any>(environment.apiUrl + '/login', loginData, { headers, context });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fiscalYear");
    this._router.navigateByUrl('/login');
  }

  userPermissionList() {
    return [];
  }
}
