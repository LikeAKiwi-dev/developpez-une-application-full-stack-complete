import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopicService } from '../../services/topic.service';
import {CreatePostRequest, PostService} from '../../services/post.service';
import { Topic } from '../../models/topic.model';
import { UserMe } from '../../models/user-me.model';
import { UserService } from '../../services/user.service';
import {PageHeaderComponent} from '../../components/page-header/page-header';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './post-create.html',
})
export class PostCreateComponent {
  topics: Topic[] = [];
  error = '';
  currentUser!: UserMe;
  form!: FormGroup;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private postService: PostService,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', Validators.required],
      topicId: [null as number | null, Validators.required],
    });

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

  loadTopics(): void {
    this.topicService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (topics) => {
          this.topics = topics.filter(t =>
            t.subscribers.some(s => s.username === this.currentUser.username)
          );
        },
        error: () => (this.error = 'Impossible de charger les topics.'),
      });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    const payload: CreatePostRequest = this.form.getRawValue();

    if (payload.topicId === 0) {
      this.error = 'Veuillez choisir un topic.';
      return;
    }

    this.postService.create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/feed']),
        error: () => (this.error = 'Création impossible (connecté ? topicId valide ?).'),
      });
  }
}
