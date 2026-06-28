import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Cannot reach the server. Check your connection.';
    const body = error.error as Record<string, unknown> | string | null;
    if (typeof body === 'string') return body;
    if (body && typeof body === 'object') {
      if (typeof body['message'] === 'string') return body['message'];
      if (typeof body['error'] === 'string') return body['error'];
    }
    return `Request failed (${error.status}).`;
  }
  return 'Something went wrong. Please try again.';
}

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  currentYear = new Date().getFullYear();

  forgotPasswordForm: FormGroup;
  serverError: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.serverError = null;
    this.successMessage = null;
    this.isSubmitting = true;

    // TODO: Replace with actual forgot password service method
    // this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
    //   next: () => {
    //     this.isSubmitting = false;
    //     this.successMessage = 'Check your email for password reset instructions.';
    //     this.forgotPasswordForm.reset();
    //     this.cdr.detectChanges();
    //   },
    //   error: (err: unknown) => {
    //     this.isSubmitting = false;
    //     this.serverError = extractApiErrorMessage(err);
    //     this.cdr.detectChanges();
    //   },
    // });

    // Temporary: Just show success for now
    this.isSubmitting = false;
    this.successMessage = 'Check your email for password reset instructions.';
    this.forgotPasswordForm.reset();
    this.cdr.detectChanges();
  }
}
