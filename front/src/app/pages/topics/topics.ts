import { Component, DestroyRef, inject } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { Topic } from '../../models/topic.model';
import { UserMe } from '../../models/user-me.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topics',
  standalone: true,
  templateUrl: './topics.html',
  imports: [],
})
export class TopicsComponent {
  topics: Topic[] = [];
  currentUser!: UserMe;
  error = '';
  successMsg = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private topicService: TopicService,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.load();
  }


  private load(): void {
    this.userService.me()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: user => {
          this.currentUser = user;
          this.loadTopics();
        },
        error: () => this.error = 'Utilisateur non connecté',
      });
  }

  private loadTopics(): void {
    this.topicService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: topics => this.topics = topics,
        error: () => this.error = 'Impossible de charger les topics',
      });
  }

  isSubscribed(topic: Topic): boolean {
    return topic.subscribers.some(s => s.username === this.currentUser.username);
  }

  subscribe(topicId: number): void {
    this.successMsg = '';
    this.subscriptionService.subscribe(topicId).subscribe({
      next: () => {
        this.successMsg = 'Abonnement effectué';
        this.loadTopics();
      },
      error: () => this.error = 'Impossible de s’abonner',
    });
  }

  unsubscribe(topicId: number): void {
    this.successMsg = '';
    this.subscriptionService.unsubscribe(topicId).subscribe({
      next: () => {
        this.successMsg = 'Désabonnement effectué';
        this.loadTopics();
      },
      error: () => this.error = 'Impossible de se désabonner',
    });
  }

  protected logOut() {
    this.authService.logout().subscribe({
      next: () => window.location.href = '/',
      error: () => this.error = 'Une erreur est survenue',
    });
  }

}
