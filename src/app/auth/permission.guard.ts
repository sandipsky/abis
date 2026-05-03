import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const required = route.data['permission'] as string | string[] | undefined;

  if (!required) {
    return true;
  }

  const operations = authService.currentUser?.operations ?? [];
  const allowed = Array.isArray(required)
    ? required.some(p => operations.includes(p))
    : operations.includes(required);

  if (allowed) {
    return true;
  }

  toastr.error('You do not have permission to access this page');
  return router.createUrlTree(['/dashboard']);
};
