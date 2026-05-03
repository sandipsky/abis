import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUser) {
    return true;
  }

  return authService.getUserRoleOperations().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
