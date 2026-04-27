import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const body = err.error;
      const isExpired =
        body?.errorCode === 403 &&
        body.message.toLowerCase().includes('jwt token has expired');

      if (isExpired) {
        toastr.error('Session expired. Please log in again.', 'Error');
        authService.logout();
      }

      return throwError(() => err);
    })
  );
};
