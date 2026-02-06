import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  login: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.url}/login`, payload, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/logout`, {}, { withCredentials: true });
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/users/me`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
