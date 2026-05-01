import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SpinnerService } from '@/shared/services/spinner.service';

let sessionExpiredHandled = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const spinnerService = inject(SpinnerService);

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
        if (!sessionExpiredHandled) {
          sessionExpiredHandled = true;
          toastr.error(err.error.message, 'Error');
          authService.logout();
          spinnerService.setSpinner(false);
          setTimeout(() => (sessionExpiredHandled = false), 100);
        }
        return EMPTY;
      }

      return throwError(() => err);
    })
  );
};
