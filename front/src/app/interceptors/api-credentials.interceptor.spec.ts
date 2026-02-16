import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { apiCredentialsInterceptor } from './api-credentials.interceptor';
import { environment } from '../../environments/environment';

describe('apiCredentialsInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiCredentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('adds Authorization header when token is present and URL is not /api/auth', () => {
    localStorage.setItem('token', 'jwt-token');

    http.get(`${environment.apiUrl}/topics`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/topics`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush([]);
    httpMock.verify();
  });

  it('does not add Authorization header for /api/auth calls', () => {
    localStorage.setItem('token', 'jwt-token');

    http.post(`${environment.apiUrl}/auth/login`, { login: 'a', password: 'b' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ token: 'x', message: 'ok' });
    httpMock.verify();
  });
});
