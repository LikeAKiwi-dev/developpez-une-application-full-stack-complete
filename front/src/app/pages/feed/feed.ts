import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedService } from '../../services/feed.service';
import { PostDto } from '../../models/post.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed.html',
})
export class FeedComponent {
  posts: PostDto[] = [];
  error = '';
  private readonly destroyRef = inject(DestroyRef);

  constructor(private feedService: FeedService) {
    this.feedService.getFeed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => (this.posts = data),
        error: () => (this.error = 'Impossible de charger le feed (êtes-vous connecté ?).'),
      });
  }
}
