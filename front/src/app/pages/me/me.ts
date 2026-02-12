import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { finalize } from 'rxjs';
import {UserMe} from '../../models/user-me.model';
import {UserService} from '../../services/user.service';
import {SubscriptionService} from '../../services/subscription.service';
import {AuthService} from '../../services/auth.service';

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

  errorMessage = '';
  successMessage = '';
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly authService: AuthService,
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
    this.errorMessage = '';
    this.successMessage = '';

    this.userService
      .me()
      .pipe(finalize(() => (this.loading = false)))
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
          this.errorMessage = "Impossible de charger le profil. Vérifie que l'utilisateur est bien connecté.";
        },
      });
  }

  save(): void {
    if (!this.me) return;

    this.errorMessage = '';
    this.successMessage = '';

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
      this.successMessage = 'Aucune modification à enregistrer.';
      return;
    }

    this.saving = true;

    this.userService
      .updateMe(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          this.me = updated;
          this.form.patchValue({ password: '' });
          this.successMessage = 'Profil mis à jour.';
          this.logOut();
        },
        error: (err) => {
          if (err?.status === 409) {
            this.errorMessage = "Ce nom d'utilisateur ou cet email est déjà utilisé.";
            return;
          }
          this.errorMessage = "Erreur lors de l'enregistrement du profil.";
        },
      });
  }
  protected logOut() {
    this.authService.logout().subscribe({
      next: () => window.location.href = '/',
      error: () => this.errorMessage = 'Une erreur est survenue',
    });
  }

  unsubscribe(topicId: number): void {
    if (!this.me) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.unsubscribingTopicId = topicId;

    this.subscriptionService
      .unsubscribe(topicId)
      .pipe(finalize(() => (this.unsubscribingTopicId = null)))
      .subscribe({
        next: () => this.fetchMe(),
        error: () => {
          this.errorMessage = "Impossible de se désabonner pour le moment.";
        },
      });
  }
}
