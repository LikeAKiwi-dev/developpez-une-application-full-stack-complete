import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { GuestGuard } from './guest-guard';

describe('GuestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: Router, useValue: { navigate: () => void 0 } },
      ],
    });
  });

  afterEach(() => {
    localStorage.removeItem('token');
    vi.restoreAllMocks();
  });

  it('should allow access when no token', () => {
    localStorage.removeItem('token');
    const guard = TestBed.inject(GuestGuard);
    expect(guard.canActivate()).toBe(true);
  });

  it('should block access and navigate when token exists', () => {
    localStorage.setItem('token', 'jwt');
    const router = TestBed.inject(Router);

    const spy = vi.spyOn(router, 'navigate');

    const guard = TestBed.inject(GuestGuard);
    expect(guard.canActivate()).toBe(false);
    expect(spy).toHaveBeenCalledWith(['/feed']);
  });
});
