import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { PostService } from './post.service';
import { environment } from '../../environments/environment';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('POST /posts (create)', () => {
    const payload = { title: 'T', content: 'C', topicId: 1 };
    const mock = {
      id: 10,
      title: 'T',
      content: 'C',
      createdAt: '2026-01-01',
      authorUsername: 'test',
      topic: { id: 1, name: 'Java' },
    };

    service.create(payload).subscribe((post) => {
      expect(post.id).toBe(10);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
    httpMock.verify();
  });

  it('GET /posts/:id (details)', () => {
    const mock = {
      post: {
        id: 10,
        title: 'T',
        content: 'C',
        createdAt: '2026-01-01',
        authorUsername: 'test',
        topic: { id: 1, name: 'Java' },
      },
      comments: [
        {
          id: 1,
          content: 'hi',
          createdAt: '2026-01-01',
          authorUsername: 'someone',
        },
      ],
    };

    service.getById(10).subscribe((res) => {
      expect(res.post.id).toBe(10);
      expect(res.comments.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts/10`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    httpMock.verify();
  });

  it('POST /posts/:id/comments', () => {
    service.addComment(10, { content: 'hello' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/posts/10/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'hello' });
    req.flush({});
    httpMock.verify();
  });
});
