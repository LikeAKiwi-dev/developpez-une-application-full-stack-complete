import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { SubscriptionService } from './subscription.service';
import { environment } from '../../environments/environment';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SubscriptionService],
    });

    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('POST /subscriptions/:topicId', () => {
    service.subscribe(12).subscribe((res) => expect(res).toBeNull());

    const req = httpMock.expectOne(`${environment.apiUrl}/subscriptions/12`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
    httpMock.verify();
  });

  it('DELETE /subscriptions/:topicId', () => {
    service.unsubscribe(12).subscribe((res) => expect(res).toBeNull());

    const req = httpMock.expectOne(`${environment.apiUrl}/subscriptions/12`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    httpMock.verify();
  });
});
