import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
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

  loginForm: FormGroup;

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

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        const accessToken =
          response?.data?.accessToken ??
          response?.accessToken ??
          response?.data?.data?.accessToken;
        const refreshToken =
          response?.data?.refreshToken ??
          response?.refreshToken ??
          response?.data?.data?.refreshToken;

        if (!accessToken) {
          console.error('Login response did not include an access token.');
          return;
        }

        this.tokenService.setTokens(accessToken, refreshToken);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
}
