import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
import { AuthService } from '../../services/auth.service';
import {
  getPasswordStrength,
  matchFieldsValidator,
  strongPasswordValidator,
} from '../../utils/password-strength.util';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText,
  ],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly router = inject(Router);

  readonly email = sessionStorage.getItem('passwordResetEmail') || '';
  readonly resetToken = sessionStorage.getItem('passwordResetToken') || '';
  showNewPassword = false;
  showConfirmPassword = false;
  loading = false;
  success = false;
  readonly passwordValue = signal('');
  readonly strength = computed(() => getPasswordStrength(this.passwordValue()));

  readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [matchFieldsValidator('newPassword', 'confirmPassword')],
    },
  );

  constructor() {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
    });

    if (!this.email || !this.resetToken) {
      this.router.navigate(['/login/forgot-password']);
    }

    this.form.controls.newPassword.valueChanges.subscribe((value) =>
      this.passwordValue.set(value || ''),
    );
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService
      .resetPassword({
        email: this.email,
        resetToken: this.resetToken,
        newPassword: this.form.controls.newPassword.value || '',
      })
      .subscribe({
        next: async (response) => {
          sessionStorage.removeItem('passwordResetEmail');
          sessionStorage.removeItem('passwordResetToken');
          this.success = true;
          await this.feedback.success(response.message || 'Password reset successfully.');
          setTimeout(() => this.router.navigate(['/login']), 1400);
        },
        error: async (error) => {
          await this.feedback.error(
            error?.error?.message || 'Unable to reset password.',
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
