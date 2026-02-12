import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserMe } from '../models/user-me.model';

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  me(): Observable<UserMe> {
    return this.http.get<UserMe>(`${environment.apiUrl}/users/me`);
  }

  updateMe(payload: UpdateUserPayload): Observable<UserMe> {
    return this.http.put<UserMe>(`${environment.apiUrl}/users/me`, payload);
  }
}
