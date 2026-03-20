import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    return true;
  }

  login(): Observable<any> {
    return of();
  }

  logout() {

  }

  userPermissionList() {
    return [];
  }
}
