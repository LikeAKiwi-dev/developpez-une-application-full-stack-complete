import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { FeedComponent } from './feed';
import { FeedService } from '../../services/feed.service';
import { PostDto } from '../../models/post.model';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  const postsMock: PostDto[] = [
    {
      id: 1,
      title: 'Old',
      content: '...',
      createdAt: '2020-01-01T00:00:00.000Z',
      authorUsername: 'test',
      topic: { id: 1, name: 'Java' },
    },
    {
      id: 2,
      title: 'New',
      content: '...',
      createdAt: '2021-01-01T00:00:00.000Z',
      authorUsername: 'test',
      topic: { id: 1, name: 'Java' },
    },
  ];


  const feedServiceMock = {
    getFeed: () => of(postsMock),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        { provide: FeedService, useValue: feedServiceMock },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}), queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleSort should sort by date asc/desc and flip flags', () => {
    // Les posts sont chargés via le constructor
    expect(component.posts.length).toBe(2);

    // par défaut sortDesc=true => si on toggle, ça devient asc
    component.toggleSort();
    expect(component.sortAsc).toBe(true);
    expect(component.sortDesc).toBe(false);
    expect(component.posts[0].id).toBe(1); // asc => Old d'abord

    component.toggleSort();
    expect(component.sortAsc).toBe(false);
    expect(component.sortDesc).toBe(true);
    expect(component.posts[0].id).toBe(2); // desc => New d'abord
  });
});
