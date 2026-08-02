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
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
import { AuthService } from '../../services/auth.service';
import {
  differentFieldsValidator,
  getPasswordStrength,
  matchFieldsValidator,
  strongPasswordValidator,
} from '../../utils/password-strength.util';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly router = inject(Router);

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  loading = false;
  readonly passwordValue = signal('');
  readonly strength = computed(() => getPasswordStrength(this.passwordValue()));

  readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        matchFieldsValidator('newPassword', 'confirmPassword'),
        differentFieldsValidator('currentPassword', 'newPassword'),
      ],
    },
  );

  constructor() {
    addIcons({
      arrowBackOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
    });

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
      .changePassword({
        currentPassword: this.form.controls.currentPassword.value || '',
        newPassword: this.form.controls.newPassword.value || '',
      })
      .subscribe({
        next: async (response) => {
          await this.feedback.success(response.message || 'Password changed.');
          this.router.navigate(['/dashboard/settings']);
        },
        error: async (error) => {
          await this.feedback.error(
            error?.error?.message || 'Unable to change password.',
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
