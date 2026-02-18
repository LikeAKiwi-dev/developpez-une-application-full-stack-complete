import {Component, DestroyRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService, LoginRequest} from '../../services/auth.service';
import {PageHeaderComponent} from '../../components/page-header/page-header';
import {ToastService} from '../../shared/toast';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './login.html',
})
export class LoginComponent {
  form!: FormGroup;
  error!: string;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService) {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload: LoginRequest = this.form.getRawValue();

    this.auth.login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.router.navigate(['/feed']),
      error: () => {
        this.error = 'Identifiants invalides (ou back non joignable).';
        this.toast.info(this.error);
      },
    });
  }
}
