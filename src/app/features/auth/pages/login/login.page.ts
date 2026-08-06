import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    RouterLink,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private feedback = inject(UiFeedbackService);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: async (response: any) => {
        const accessToken =
          response?.data?.accessToken ??
          response?.accessToken ??
          response?.data?.data?.accessToken;
        const refreshToken =
          response?.data?.refreshToken ??
          response?.refreshToken ??
          response?.data?.data?.refreshToken;

        if (!accessToken) {
          this.errorMessage = 'Login succeeded but no access token was returned.';
          this.loading = false;
          await this.feedback.error(this.errorMessage);
          return;
        }

        this.tokenService.setTokens(accessToken, refreshToken);
        this.router.navigate(['/dashboard']);
      },

      error: async (error) => {
        this.errorMessage = error?.error?.message || 'Unable to sign in. Please check your credentials.';
        this.loading = false;
        await this.feedback.error(this.errorMessage);
      },

      complete: () => {
        this.loading = false;
      },
    });
  }
}
