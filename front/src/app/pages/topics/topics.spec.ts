import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TopicsComponent } from './topics';
import { TopicService } from '../../services/topic.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { Topic } from '../../models/topic.model';
import { UserMe } from '../../models/user-me.model';

describe('TopicsComponent', () => {
  let component: TopicsComponent;
  let fixture: ComponentFixture<TopicsComponent>;

  const currentUserMock: UserMe = {
    id: 1,
    username: 'test',
    email: 'test@test.local',
    subscriptions: [],
  };

  const topicsMock: Topic[] = [
    { id: 1, name: 'Java', description: 'desc', subscribers: [{ id: 10, username: 'test' }] },
    { id: 2, name: 'Angular', description: 'desc', subscribers: [] },
  ];

  const topicServiceMock = {
    // IMPORTANT: async (microtask) pour éviter NG0100
    getAll: vi.fn(() => from(Promise.resolve(topicsMock))),
  };

  const subscriptionServiceMock = {
    subscribe: vi.fn(() => of(null)),
    unsubscribe: vi.fn(() => of(null)),
  };

  const userServiceMock = {
    // IMPORTANT: async (microtask) pour éviter NG0100
    me: vi.fn(() => from(Promise.resolve(currentUserMock))),
    updateMe: vi.fn(() => of(currentUserMock)),
  };

  const authServiceMock = {
    logout: vi.fn(() => of(null)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TopicsComponent],
      providers: [
        { provide: TopicService, useValue: topicServiceMock },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
    component = fixture.componentInstance;

    // 1) premier rendu
    fixture.detectChanges();

    // 2) attendre les microtasks (Promise.resolve)
    await fixture.whenStable();

    // 3) rendu avec données chargées
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isSubscribed should return true when currentUser is in subscribers', () => {
    expect(component.isSubscribed(topicsMock[0])).toBe(true);
  });

  it('isSubscribed should return false when currentUser is not in subscribers', () => {
    expect(component.isSubscribed(topicsMock[1])).toBe(false);
  });

  it('subscribe should call service and refresh topics', async () => {
    subscriptionServiceMock.subscribe.mockClear();
    topicServiceMock.getAll.mockClear();

    component.subscribe(1);

    expect(subscriptionServiceMock.subscribe).toHaveBeenCalledWith(1);

    // laisse le refresh async se produire
    await fixture.whenStable();
    expect(topicServiceMock.getAll).toHaveBeenCalled();
  });

  it('unsubscribe should call service and refresh topics', async () => {
    subscriptionServiceMock.unsubscribe.mockClear();
    topicServiceMock.getAll.mockClear();

    component.unsubscribe(1);

    expect(subscriptionServiceMock.unsubscribe).toHaveBeenCalledWith(1);

    await fixture.whenStable();
    expect(topicServiceMock.getAll).toHaveBeenCalled();
  });
});
