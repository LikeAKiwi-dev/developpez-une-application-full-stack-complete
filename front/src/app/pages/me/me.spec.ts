import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MeComponent } from './me';
import { UserService } from '../../services/user.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { UserMe } from '../../models/user-me.model';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const meMock: UserMe = {
    id: 1,
    username: 'test',
    email: 'test@test.local',
    subscriptions: [],
  };

  const userServiceMock = {
    me: vi.fn(() => of(meMock)),
    updateMe: vi.fn((payload: { username?: string; email?: string; password?: string }) =>
      of({ ...meMock, ...payload }),
    ),
  };

  const subscriptionServiceMock = {
    unsubscribe: vi.fn(() => of(null)),
  };

  const authServiceMock = {
    logout: vi.fn(() => of(null)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MeComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    // Empêche la redirection window.location.href (logOut appelé après save() succès)
    const componentWithLogout = component as unknown as { logOut: () => void };
    vi.spyOn(componentWithLogout, 'logOut').mockImplementation(() => void 0);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fetchMe should call userService.me() and set me', () => {
    userServiceMock.me.mockClear();

    component.fetchMe();

    expect(userServiceMock.me).toHaveBeenCalled();
  });

  it('save should call userService.updateMe() when something changed', () => {
    // IMPORTANT : save() return si me est null
    component.me = meMock;

    // Simule une modification
    component.form.patchValue({
      username: 'new',
      email: meMock.email,
      password: '',
    });

    userServiceMock.updateMe.mockClear();

    component.save();

    expect(userServiceMock.updateMe).toHaveBeenCalledWith({ username: 'new' });
  });

  it('unsubscribe should call subscriptionService.unsubscribe and then fetchMe', () => {
    component.me = meMock;

    const componentWithFetch = component as unknown as { fetchMe: () => void };
    const fetchSpy = vi.spyOn(componentWithFetch, 'fetchMe');

    subscriptionServiceMock.unsubscribe.mockClear();

    component.unsubscribe(1);

    expect(subscriptionServiceMock.unsubscribe).toHaveBeenCalledWith(1);
    expect(fetchSpy).toHaveBeenCalled();
  });
});
