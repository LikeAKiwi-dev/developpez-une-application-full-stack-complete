import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly url = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  subscribe(topicId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/${topicId}`, {});
  }

  unsubscribe(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${topicId}`);
  }
}
