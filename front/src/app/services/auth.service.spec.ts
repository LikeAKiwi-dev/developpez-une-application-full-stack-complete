import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login() stores token and updates isLoggedIn$', () => {
    const states: boolean[] = [];
    const sub = service.isLoggedIn$.subscribe((v) => states.push(v));

    service.login({ login: 'test', password: 'Password123!' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token', message: 'ok' });

    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(states.at(-1)).toBe(true);

    sub.unsubscribe();
  });

  it('register() stores token', () => {
    service.register({ username: 'u', login: 'u@test.local', password: 'Password123!' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token', message: 'ok' });

    expect(localStorage.getItem('token')).toBe('jwt-token');
  });

  it('logout() clears token even if the API returns an error', () => {
    localStorage.setItem('token', 'jwt-token');

    let completed = false;
    service.logout().subscribe({ complete: () => (completed = true) });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    expect(localStorage.getItem('token')).toBeNull();
    expect(completed).toBe(true);
  });

  it('isLoggedIn() returns false when no token', () => {
    service.isLoggedIn().subscribe((v) => expect(v).toBe(false));
  });

  it('isLoggedIn() calls /users/me and returns true on success', () => {
    localStorage.setItem('token', 'jwt-token');

    service.isLoggedIn().subscribe((v) => expect(v).toBe(true));

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('isLoggedIn() returns false on /users/me error', () => {
    localStorage.setItem('token', 'jwt-token');

    service.isLoggedIn().subscribe((v) => expect(v).toBe(false));

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
