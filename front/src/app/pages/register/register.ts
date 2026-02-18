import {Component, DestroyRef, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService, RegisterRequest} from '../../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import { Location } from '@angular/common';
import {PageHeaderComponent} from '../../components/page-header/page-header';
import {ToastService} from '../../shared/toast';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form!: FormGroup;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload: RegisterRequest = this.form.getRawValue();

    this.auth
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.router.navigate(['/topics']),
      error: (err: HttpErrorResponse) => {
        const backendError = err.error as {
          message?: string;
          errors?: { password?: string };
        };
        const msg =
          backendError?.errors?.password ??
          backendError?.message ??
          'Une erreur est survenue';

        this.toast.info(msg);
      }
    });
  }

}
