import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { PostCreateComponent } from './post-create';
import { TopicService } from '../../services/topic.service';
import { PostService } from '../../services/post.service';
import { Router, provideRouter } from '@angular/router';
import { UserService } from '../../services/user.service';

describe('PostCreateComponent', () => {
  const topicServiceMock: { getAll: ReturnType<typeof vi.fn> } = {
    getAll: vi.fn(() => of([])),
  };

  const postServiceMock: { create: ReturnType<typeof vi.fn> } = {
    create: vi.fn(),
  };

  const routerMock: { navigate: ReturnType<typeof vi.fn> } = {
    navigate: vi.fn(),
  };

  const userServiceMock = {
    me: vi.fn(() => of({ id: 1, username: 'test', email: 'test@mail.com', subscriptions: [] })),
  };

  beforeEach(async () => {
    postServiceMock.create = vi.fn(() =>
      of({
        id: 1,
        title: 'T',
        content: 'C',
        createdAt: new Date().toISOString(),
        authorUsername: 'test',
        topic: { id: 1, name: 'Java' },
      })
    );

    await TestBed.configureTestingModule({
      imports: [PostCreateComponent],
      providers: [
        provideRouter([]),
        { provide: TopicService, useValue: topicServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    vi.clearAllMocks();
  });

  it('should create post and navigate to feed on success', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.form.setValue({
      title: 'Post',
      content: 'Contenu',
      topicId: 1,
    });

    component.submit();

    expect(postServiceMock.create).toHaveBeenCalledWith({
      title: 'Post',
      content: 'Contenu',
      topicId: 1,
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/feed']);
  });

  it('should set error on create failure', () => {
    postServiceMock.create.mockReturnValue(
      throwError(() => new Error('boom'))
    );

    const fixture = TestBed.createComponent(PostCreateComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.form.setValue({
      title: 'Post',
      content: 'Contenu',
      topicId: 1,
    });

    component.submit();

    expect(component.error).toContain('Création impossible');
  });


  it('should create component', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
