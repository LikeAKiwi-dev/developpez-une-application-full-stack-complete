import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('GET /users/me', () => {
    const mock = { id: 1, username: 'test', email: 'test@test.local', subscriptions: [] };

    service.me().subscribe((me) => {
      expect(me.username).toBe('test');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    httpMock.verify();
  });

  it('PUT /users/me', () => {
    const payload = { username: 'new' };
    const mock = { id: 1, username: 'new', email: 'test@test.local', subscriptions: [] };

    service.updateMe(payload).subscribe((me) => {
      expect(me.username).toBe('new');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
    httpMock.verify();
  });
});
