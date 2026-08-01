import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  globeOutline,
  locationOutline,
  mailOutline,
  paperPlaneOutline,
  timeOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Contact } from 'src/app/features/contact/models/contact.model';
import { PublicService } from '../../public.service';
import { activeOnly, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-contact-section',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonInput,
    IonSpinner,
    IonTextarea,
  ],
})
export class ContactComponent {
  private readonly publicService = inject(PublicService);
  private readonly formBuilder = inject(FormBuilder);

  readonly contact = signal<Contact | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly submitted = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    addIcons({ callOutline, globeOutline, locationOutline, mailOutline, paperPlaneOutline, timeOutline });
    this.loadContact();
  }

  submit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const email = this.contact()?.email ?? '';
    const body = encodeURIComponent(`${value.message}\n\nFrom: ${value.name} <${value.email}>`);
    window.location.href = `mailto:${email}?subject=Portfolio inquiry&body=${body}`;
    this.form.reset();
    this.submitted.set(false);
  }

  private loadContact(): void {
    this.publicService.getContact()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.contact.set(activeOnly(unwrapCollection<Contact>(response, 'contacts'))[0] ?? null);
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
