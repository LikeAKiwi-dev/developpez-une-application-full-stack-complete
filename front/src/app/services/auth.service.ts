import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.url}/login`, payload).pipe(
      tap((res) => localStorage.setItem('token', res.token)),
      map(() => void 0)
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    return this.http.post<void>(`${this.url}/logout`, {});
  }

  isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    return this.http.get(`${environment.apiUrl}/users/me`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
