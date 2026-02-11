import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  username: string;
  login: string;
  password: string;
}

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
  private readonly tokenKey = 'token';

  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  login(payload: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.url}/login`, payload).pipe(
      tap((res) => this.setToken(res.token)),
      map(() => void 0)
    );
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.url}/register`, payload).pipe(
      tap((res) => this.setToken(res.token)),
      map(() => void 0)
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);

    return this.http.post<void>(`${this.url}/logout`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  isLoggedIn(): Observable<boolean> {
    if (!this.hasToken()) return of(false);

    return this.http.get(`${environment.apiUrl}/users/me`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

}
