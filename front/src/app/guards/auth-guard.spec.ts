import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { AuthGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isLoggedIn$: of(true) } },
        { provide: Router, useValue: { navigate: () => void 0 } },
      ],
    });
  });

  it('should be callable', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/feed' } as RouterStateSnapshot;

    const result$ = TestBed.runInInjectionContext(() => AuthGuard(route, state));
    expect(result$).toBeTruthy();
  });
});
