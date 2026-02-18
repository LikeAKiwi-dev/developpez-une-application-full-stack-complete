import {Component, DestroyRef, inject} from '@angular/core';
import {Router, RouterLink, NavigationEnd, RouterLinkActive} from '@angular/router';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgOptimizedImage, RouterLinkActive],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeaderComponent {
  menuOpen: boolean = false;
  showHeader: boolean = true;
  isLoggedIn$!: Observable<boolean>;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showHeader = this.router.url !== '/';
      });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.auth
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.closeMenu();
      this.router.navigate(['/']);
    });
  }
}
