import { Component, DestroyRef, inject } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { Topic } from '../../models/topic.model';
import { UserMe } from '../../models/user-me.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import {ToastService} from '../../shared/toast';

@Component({
  selector: 'app-topics',
  standalone: true,
  templateUrl: './topics.html',
  imports: [],
})
export class TopicsComponent {
  topics: Topic[] = [];
  currentUser!: UserMe;
  error!: string;
  successMsg:string =  '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private topicService: TopicService,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService
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
        error: () => {
          this.error = 'Utilisateur non connecté'
          this.toast.info(this.error)
        } ,
      });
  }

  private loadTopics(): void {
    this.topicService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: topics => this.topics = topics,
        error: () => {
          this.error = 'Impossible de charger les topics';
          this.toast.info(this.error)
        },
      });
  }

  isSubscribed(topic: Topic): boolean {
    return topic.subscribers.some(s => s.username === this.currentUser.username);
  }

  subscribe(topicId: number): void {
    this.subscriptionService
      .subscribe(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.successMsg = 'Abonnement effectué';
        this.loadTopics();
      },
      error: () => {
        this.error = 'Impossible de s’abonner';
        this.toast.info(this.error);
        this.loadTopics();
      },
    });
  }


  unsubscribe(topicId: number): void {
    this.subscriptionService
      .unsubscribe(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.successMsg = 'Désabonnement effectué';
        this.loadTopics();
      },
      error: () => {
        this.error = 'Impossible de se désabonner'
        this.toast.info(this.error)
      },
    });
  }

  protected logOut() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => window.location.href = '/',
      error: () => {
        this.error = 'Une erreur est survenue'
        this.toast.info(this.error)
      },
    });
  }

}
