import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {CreateCommentRequest, PostService} from '../../services/post.service';
import { PostDetailResponse } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent {
  data?: PostDetailResponse;
  error = '';
  private readonly destroyRef = inject(DestroyRef);

  commentForm!: FormGroup;
  private postId!: number;

  constructor(private route: ActivatedRoute, private postService: PostService, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });

    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.error = '';
    this.postService.getById(this.postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => (this.data = d),
        error: () => (this.error = 'Post introuvable ou accès refusé.'),
      });
  }

  addComment(): void {
    if (this.commentForm.invalid) return;

    const payload: CreateCommentRequest = this.commentForm.getRawValue();

    this.postService.addComment(this.postId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.commentForm.reset();
          this.load();
        },
        error: () => (this.error = "Impossible d'ajouter le commentaire."),
      });
  }
}
