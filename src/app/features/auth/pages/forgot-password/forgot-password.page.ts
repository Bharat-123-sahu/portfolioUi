import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { arrowBackOutline, mailOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = false;

  constructor() {
    addIcons({ arrowBackOutline, mailOutline, shieldCheckmarkOutline });
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.controls.email.value?.trim().toLowerCase() || '';
    this.loading = true;

    this.authService.forgotPassword({ email }).subscribe({
      next: async (response) => {
        sessionStorage.setItem('passwordResetEmail', email);
        await this.feedback.success(response.message || 'Verification code sent.');
        this.router.navigate(['/login/verify-otp']);
      },
      error: async () => {
        await this.feedback.error('We could not process the request right now.');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
