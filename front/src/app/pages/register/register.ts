import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService, RegisterRequest} from '../../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import { Location } from '@angular/common';
import {PageHeaderComponent} from '../../components/page-header/page-header';

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
  error: string = "";
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    const payload: RegisterRequest = this.form.getRawValue();

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/topics']),
      error: (err: HttpErrorResponse) => (this.error = err.error?.message || 'Une erreur est survenue'),
    });
  }

}
