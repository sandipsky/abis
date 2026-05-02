import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _http = inject(HttpClient);
  private _router = inject(Router);

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    let authToken = localStorage.getItem('token');
    return authToken !== null ? true : false;
  }

  login(loginData: any): Observable<any> {
    return this._http
      .post<any>(environment.apiUrl + '/login', loginData);
  }

  logout() {
    localStorage.removeItem("token");
    this._router.navigateByUrl('/login');
  }

  userPermissionList() {
    return [];
  }
}
