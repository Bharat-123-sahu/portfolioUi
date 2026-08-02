import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, keyOutline, refreshOutline } from 'ionicons/icons';
import { Subscription, interval } from 'rxjs';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonSpinner,
    IonText,
  ],
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage implements AfterViewInit, OnDestroy {
  @ViewChildren('otpBox') otpInputs!: QueryList<ElementRef<HTMLIonInputElement>>;

  private readonly authService = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly router = inject(Router);
  private timerSub?: Subscription;

  readonly email = sessionStorage.getItem('passwordResetEmail') || '';
  digits = ['', '', '', '', '', ''];
  secondsRemaining = 600;
  loading = false;
  resending = false;
  errorMessage = '';

  constructor() {
    addIcons({ arrowBackOutline, keyOutline, refreshOutline });

    if (!this.email) {
      this.router.navigate(['/login/forgot-password']);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusInput(0), 150);
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  get otp(): string {
    return this.digits.join('');
  }

  get timerLabel(): string {
    const minutes = Math.floor(this.secondsRemaining / 60);
    const seconds = String(this.secondsRemaining % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    this.digits[index] = value;
    this.errorMessage = '';

    if (value && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6);

    if (!pasted) {
      return;
    }

    event.preventDefault();
    this.digits = Array.from({ length: 6 }, (_, index) => pasted[index] || '');
    this.focusInput(Math.min(pasted.length, 5));
  }

  verify(): void {
    if (this.otp.length !== 6 || this.loading) {
      this.errorMessage = 'Enter the 6 digit verification code.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: async (response) => {
        const resetToken = response.data?.resetToken;

        if (!resetToken) {
          this.errorMessage = 'Verification succeeded but reset token was missing.';
          return;
        }

        sessionStorage.setItem('passwordResetToken', resetToken);
        await this.feedback.success(response.message || 'OTP verified.');
        this.router.navigate(['/login/reset-password']);
      },
      error: async (error) => {
        this.errorMessage =
          error?.error?.message || 'Invalid or expired verification code.';
        await this.feedback.error(this.errorMessage);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  resend(): void {
    if (this.resending || this.secondsRemaining > 0) {
      return;
    }

    this.resending = true;
    this.errorMessage = '';

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: async (response) => {
        this.digits = ['', '', '', '', '', ''];
        this.secondsRemaining = 600;
        this.startTimer();
        await this.feedback.success(response.message || 'A new OTP has been sent.');
        setTimeout(() => this.focusInput(0), 100);
      },
      error: async () => {
        await this.feedback.error('Unable to resend OTP right now.');
      },
      complete: () => {
        this.resending = false;
      },
    });
  }

  private startTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining -= 1;
      }
    });
  }

  private focusInput(index: number): void {
    this.otpInputs?.get(index)?.nativeElement.setFocus();
  }
}
