import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
import { AuthService } from '../../services/auth.service';
import {
  getPasswordStrength,
  matchFieldsValidator,
  strongPasswordValidator,
} from '../../utils/password-strength.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setup-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText,
  ],
  templateUrl: './setup-admin.page.html',
  styleUrls: ['./setup-admin.page.scss'],
})
export class SetupAdminPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  environment = environment;
  readonly token = this.route.snapshot.queryParamMap.get('token') || '';
  readonly passwordValue = signal('');
  readonly strength = computed(() => getPasswordStrength(this.passwordValue()));

  loading = false;
  serverError = '';

  readonly form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [matchFieldsValidator('password', 'confirmPassword')],
    },
  );

  constructor() {
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.passwordValue.set(value || '');
    });
  }

  submit(): void {
    this.serverError = '';

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.controls.email.value?.trim().toLowerCase() || '';
    const password = this.form.controls.password.value || '';
    const confirmPassword = this.form.controls.confirmPassword.value || '';

    this.loading = true;

    this.authService
      .setupAdmin(
        {
          email,
          password,
          confirmPassword,
          token: environment.adminSetupToken,
        },
        environment.adminSetupToken,
      )
      .subscribe({
        next: async (response) => {
          await this.feedback.success(
            response.message || 'Admin account created successfully.',
          );
          this.router.navigate(['/login']);
        },
        error: async (error) => {
          this.serverError =
            error?.error?.message || 'Unable to create admin account.';
          await this.feedback.error(this.serverError);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
