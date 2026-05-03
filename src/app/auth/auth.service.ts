import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUserSession, Login } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _http = inject(HttpClient);
  private _router = inject(Router);

  private _currentUser$ = new BehaviorSubject<IUserSession | null>(null);
  readonly currentUser$ = this._currentUser$.asObservable();

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    let authToken = localStorage.getItem('token');
    return authToken !== null ? true : false;
  }

  login(loginData: Login): Observable<Login> {
    return this._http
      .post<Login>(environment.apiUrl + '/login', loginData);
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser$.next(null);
    this._router.navigateByUrl('/login');
  }

  getUserRoleOperations(): Observable<IUserSession> {
    return this._http
      .get<IUserSession>(environment.apiUrl + '/getUserRoleOperations')
      .pipe(tap(user => this._currentUser$.next(user)));
  }

  get currentUser(): IUserSession | null {
    return this._currentUser$.value;
  }
}
