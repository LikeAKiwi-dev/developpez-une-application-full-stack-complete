import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { TopicsComponent } from './topics';
import { TopicService } from '../../services/topic.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { provideRouter } from '@angular/router';

describe('TopicsComponent', () => {
  const userMock = { id: 1, username: 'test', email: 'test@mail.com', subscriptions: [] };

  const topicsMock = [
    { id: 1, name: 'Java', subscribers: [{ id: 1, username: 'test' }] },
    { id: 2, name: 'Angular', subscribers: [] },
  ];

  const topicServiceMock = {
    getAll: vi.fn(() => of(topicsMock)),
  };

  const subscriptionMock = {
    subscribe: vi.fn(() => of({})),
    unsubscribe: vi.fn(() => of({})),
  };

  const userServiceMock = {
    me: vi.fn(() => of(userMock)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsComponent],
      providers: [
        provideRouter([]),
        { provide: TopicService, useValue: topicServiceMock },
        { provide: SubscriptionService, useValue: subscriptionMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    vi.clearAllMocks();
  });

  it('should load topics', () => {
    const fixture = TestBed.createComponent(TopicsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.topics.length).toBe(2);
  });

  it('should detect subscribed topic', () => {
    const fixture = TestBed.createComponent(TopicsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isSubscribed(topicsMock[0])).toBe(true);
    expect(component.isSubscribed(topicsMock[1])).toBe(false);
  });
});
