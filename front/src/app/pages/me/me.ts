import { CommonModule } from '@angular/common';
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { finalize } from 'rxjs';
import {UserMe} from '../../models/user-me.model';
import {UserService} from '../../services/user.service';
import {SubscriptionService} from '../../services/subscription.service';
import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../shared/toast';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './me.html',
  styleUrl: './me.scss',
})
export class MeComponent implements OnInit {
  me:UserMe | null = null;
  loading = false;
  saving = false;
  unsubscribingTopicId: number | null = null;
  form!: FormGroup;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly authService: AuthService,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.fetchMe();
  }

  fetchMe(): void {
    this.loading = true;

    this.userService
      .me()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (me) => {
          this.me = me;
          this.form.patchValue({
            username: me.username,
            email: me.email,
            password: '',
          });
        },
        error: () => {
          this.toast.info("Impossible de charger le profil. Vérifie que l'utilisateur est bien connecté.");
        },
      });
  }

  save(): void {
    if (!this.me) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username = (this.form.value.username ?? '').trim();
    const email = (this.form.value.email ?? '').trim();
    const password = (this.form.value.password ?? '').trim();

    const payload: { username?: string; email?: string; password?: string } = {};

    if (username && username !== this.me.username) payload.username = username;
    if (email && email !== this.me.email) payload.email = email;
    if (password) payload.password = password;


    if (Object.keys(payload).length === 0) {
      this.toast.info('Aucune modification à enregistrer.');
      return;
    }

    this.saving = true;

    this.userService
      .updateMe(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.saving = false))
      )
      .subscribe({
        next: (updated) => {
          this.me = updated;
          this.form.patchValue({ password: '' });
          this.toast.info('Profil mis à jour.');
          this.logOut();
        },
        error: (err) => {
          if (err?.status === 409) {
            this.toast.info("Ce nom d'utilisateur ou cet email est déjà utilisé.");
            return;
          }
          this.toast.info("Erreur lors de l'enregistrement du profil.");
        },
      });
  }
  protected logOut() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => window.location.href = '/',
      error: () => this.toast.info('Une erreur est survenue'),
    });
  }

  unsubscribe(topicId: number): void {
    if (!this.me) return;

    this.unsubscribingTopicId = topicId;

    this.subscriptionService
      .unsubscribe(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.unsubscribingTopicId = null))
      )
      .subscribe({
        next: () => this.fetchMe(),
        error: () => {
          this.toast.info("Impossible de se désabonner pour le moment.");
        },
      });
  }
}
