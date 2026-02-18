import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {CreateCommentRequest, PostService} from '../../services/post.service';
import { PostDetailResponse } from '../../models/post.model';
import {PageHeaderComponent} from '../../components/page-header/page-header';
import {ToastService} from '../../shared/toast';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent {
  data?: PostDetailResponse;
  private readonly destroyRef = inject(DestroyRef);

  commentForm!: FormGroup;
  private postId!: number;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private toast: ToastService) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });

    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.postService.getById(this.postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => (this.data = d),
        error: () => (this.toast.info('Post introuvable ou accès refusé.')),
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
        error: () => (this.toast.info("Impossible d'ajouter le commentaire.")),
      });
  }
}
