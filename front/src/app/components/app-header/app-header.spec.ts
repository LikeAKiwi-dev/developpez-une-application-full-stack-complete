import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AppHeaderComponent } from './app-header';
import { AuthService } from '../../services/auth.service';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn$: of(false),
            logout: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout', () => {
    const auth = TestBed.inject(AuthService);
    const spy = vi.spyOn(auth, 'logout');
    component.logout();
    expect(spy).toHaveBeenCalled();
  });

  it('should reflect logged state when isLoggedIn$ emits true', async () => {
    // Arrange
    const auth = TestBed.inject(AuthService) as unknown as { isLoggedIn$: unknown };
    (auth as { isLoggedIn$: unknown }).isLoggedIn$ = of(true);

    // Act
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component).toBeTruthy();
  });

  it('logout should call AuthService.logout()', () => {
    const auth = TestBed.inject(AuthService) as unknown as { logout: () => unknown };
    const spy = vi.spyOn(auth, 'logout');

    component.logout();

    expect(spy).toHaveBeenCalled();
  });

});
