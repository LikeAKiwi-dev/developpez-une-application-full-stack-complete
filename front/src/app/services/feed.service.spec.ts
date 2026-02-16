import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { FeedService } from './feed.service';
import { environment } from '../../environments/environment';

describe('FeedService', () => {
  let service: FeedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), FeedService],
    });
    service = TestBed.inject(FeedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('GET /feed', () => {
    const mock = [
      {
        id: 1,
        title: 'Hello',
        content: 'World',
        createdAt: '2026-01-01',
        authorUsername: 'test',
        topic: { id: 1, name: 'Java' },
      },
    ];

    service.getFeed().subscribe((posts) => {
      expect(posts.length).toBe(1);
      expect(posts[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/feed`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    httpMock.verify();
  });
});
