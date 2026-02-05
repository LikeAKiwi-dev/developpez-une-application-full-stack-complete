import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { FeedComponent } from './feed';
import { FeedService } from '../../services/feed.service';
import { provideRouter } from '@angular/router';

describe('FeedComponent', () => {
  const feedServiceMock = {
    getFeed: vi.fn(() => of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        provideRouter([]),
        { provide: FeedService, useValue: feedServiceMock },
      ],
    }).compileComponents();

    vi.clearAllMocks();
  });

  it('should load feed', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    fixture.detectChanges();
    expect(feedServiceMock.getFeed).toHaveBeenCalled();
  });
});
