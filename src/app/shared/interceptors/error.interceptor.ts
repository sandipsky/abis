import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { SpinnerService } from '@/shared/services/spinner.service';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const skipErrorToast = (context: HttpContext = new HttpContext()) =>
  context.set(SKIP_ERROR_TOAST, true);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const spinnerService = inject(SpinnerService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      spinnerService.setSpinner(false);

      if (req.context.get(SKIP_ERROR_TOAST)) {
        return throwError(() => err);
      }

      const messages = extractMessages(err);
      messages.forEach((msg) => toastr.error(msg, 'Error', { closeButton: true }));

      return throwError(() => err);
    })
  );
};

function extractMessages(err: HttpErrorResponse): string[] {
  const body = err.error;

  if (body?.messages?.length) {
    return body.messages
      .map((m: any) => (typeof m === 'string' ? m : m?.message))
      .filter(Boolean);
  }

  const single = body?.message ?? err.message;
  return single ? [single] : ['Something went wrong.'];
}
