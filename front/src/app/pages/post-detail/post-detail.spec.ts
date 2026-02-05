import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { PostDetailComponent } from './post-detail';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('PostDetailComponent', () => {
  const mockDetail = {
    post: {
      id: 10,
      title: 'Titre',
      content: 'Contenu',
      createdAt: new Date().toISOString(),
      authorUsername: 'test',
      topic: { id: 1, name: 'Java' },
    },
    comments: [],
  };

  const postServiceMock = {
    getById: vi.fn(() => of(mockDetail)),
    addComment: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        provideRouter([]),
        { provide: PostService, useValue: postServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '10' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    vi.clearAllMocks();
  });

  it('should load post detail on init', () => {
    const fixture = TestBed.createComponent(PostDetailComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(postServiceMock.getById).toHaveBeenCalledWith(10);
    expect(component.data?.post.id).toBe(10);
  });

  it('should add comment and reload', () => {
    const fixture = TestBed.createComponent(PostDetailComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.commentForm.setValue({ content: 'Hello' });
    component.addComment();

    expect(postServiceMock.addComment).toHaveBeenCalledWith(10, { content: 'Hello' });
    expect(postServiceMock.getById).toHaveBeenCalledTimes(2);
  });
});
