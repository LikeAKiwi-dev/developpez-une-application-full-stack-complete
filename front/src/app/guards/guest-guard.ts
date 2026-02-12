import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/feed']);
      return false;
    }

    return true;
  }
}
