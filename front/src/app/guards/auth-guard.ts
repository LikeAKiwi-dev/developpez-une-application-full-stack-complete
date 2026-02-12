import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
