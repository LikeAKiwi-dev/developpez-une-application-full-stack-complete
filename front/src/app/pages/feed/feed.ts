import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedService } from '../../services/feed.service';
import { PostDto } from '../../models/post.model';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastService} from '../../shared/toast';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class FeedComponent {
  posts: PostDto[] = [];
  sortDesc: boolean = true;
  sortAsc: boolean = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private feedService: FeedService,
    private toast: ToastService,) {
    this.feedService.getFeed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => (this.posts = data),
        error: () => (this.toast.info('Impossible de charger le feed (êtes-vous connecté ?).')),
      });
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.sortDesc = !this.sortDesc;
    this.posts = [...this.posts].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return this.sortDesc ? db - da : da - db;
    });
  }


}
