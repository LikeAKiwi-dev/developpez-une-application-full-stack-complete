import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostDto } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private readonly url = `${environment.apiUrl}/feed`;

  constructor(private http: HttpClient) {}

  getFeed(): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(this.url, { withCredentials: true });
  }
}
