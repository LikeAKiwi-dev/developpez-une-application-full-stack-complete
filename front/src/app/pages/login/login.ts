import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService, LoginRequest} from '../../services/auth.service';
import {PageHeaderComponent} from '../../components/page-header/page-header';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './login.html',
})
export class LoginComponent {
  error: string = '';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    const payload: LoginRequest = this.form.getRawValue();

    this.auth.login(payload).subscribe({
      next: () => this.router.navigate(['/topics']),
      error: () => (this.error = 'Identifiants invalides (ou back non joignable).'),
    });
  }
}
