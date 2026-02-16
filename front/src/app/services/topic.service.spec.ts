import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TopicService } from './topic.service';
import { environment } from '../../environments/environment';

describe('TopicService', () => {
  let service: TopicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TopicService],
    });

    service = TestBed.inject(TopicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('GET /topics', () => {
    const mock = [{ id: 1, name: 'Java', subscribers: [] }];

    service.getAll().subscribe((topics) => {
      expect(topics).toEqual(mock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/topics`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    httpMock.verify();
  });
});
