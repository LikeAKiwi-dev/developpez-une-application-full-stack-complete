import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostDetailResponse, PostDto } from '../models/post.model';

export interface CreatePostRequest {
  title: string;
  content: string;
  topicId: number;
}

export interface CreateCommentRequest {
  content: string;
}

/**
 * Service métier responsable de la gestion des posts.
 *
 * Responsabilités :
 * - Création d’un post associé à un utilisateur authentifié
 * - Récupération d’un post avec ses commentaires
 * - Accès aux données via PostRepository
 *
 * Les opérations sont exécutées dans un contexte transactionnel.
 */

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly url = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  create(payload: CreatePostRequest): Observable<PostDto> {
    return this.http.post<PostDto>(this.url, payload);
  }

  getById(id: number): Observable<PostDetailResponse> {
    return this.http.get<PostDetailResponse>(`${this.url}/${id}`);
  }

  addComment(postId: number, payload: CreateCommentRequest) {
    return this.http.post(`${this.url}/${postId}/comments`, payload);
  }
}
