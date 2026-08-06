import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  IonicModule,
  ToastController
} from '@ionic/angular';

import { PortfolioSettings } from '../../models/settings.model';

import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { TechnologyChipsComponent } from 'src/app/shared/components/technology-chips/technology-chips.component';
import { SettingsService } from '../../services/settings';
import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    FileUploadComponent,
    TechnologyChipsComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingComponent,
  ],
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private toastController = inject(ToastController);


  settingsForm!: FormGroup;

  loading = false;

  saving = false;

  errorMessage = '';

  settings?: PortfolioSettings;

  ngOnInit(): void {

    this.initializeForm();

    this.loadSettings();

  }

  initializeForm(): void {

    this.settingsForm = this.fb.group({

      siteTitle: [
        '',
        Validators.required
      ],

      siteDescription: [
        '',
        Validators.required
      ],

      siteKeywords: [
        []
      ],

      siteAuthor: [
        ''
      ],

      logo: [
        ''
      ],

      favicon: [
        ''
      ],

      primaryColor: [
        '#3880ff'
      ],

      secondaryColor: [
        '#5260ff'
      ],

      accentColor: [
        '#2dd36f'
      ],

      defaultResume: [
        ''
      ],

      contactEmail: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      supportEmail: [
        '',
        Validators.email
      ],

      phone: [
        ''
      ],

      address: [
        ''
      ],

      city: [
        ''
      ],

      state: [
        ''
      ],

      country: [
        ''
      ],

      postalCode: [
        ''
      ],

      metaTitle: [
        ''
      ],

      metaDescription: [
        ''
      ],

      metaKeywords: [
        []
      ],

      googleAnalyticsId: [
        ''
      ],

      googleTagManagerId: [
        ''
      ],

      maintenanceMode: [
        false
      ],

      enableBlog: [
        true
      ],

      enableProjects: [
        true
      ],

      enableContactForm: [
        true
      ],

      isActive: [
        true
      ]

    });

  }

  loadSettings(): void {

    this.loading = true;
    this.errorMessage = '';

    this.settingsService.getSettings().subscribe({

      next: (settings) => {

        this.settings = settings ?? undefined;

        if (settings) {
          this.settingsForm.patchValue(settings);
        }

        this.loading = false;

      },

      error: async () => {

        this.loading = false;
        this.errorMessage = 'Unable to load settings. Please try again.';

        const toast = await this.toastController.create({
          message: this.errorMessage,
          color: 'danger',
          duration: 2500,
        });

        await toast.present();

      }

    });

  }

  save(): void {

    if (this.settingsForm.invalid) {

      this.settingsForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const payload = this.normalizePayload(this.settingsForm.value);

    this.settingsService
      .updateSettings(payload)
      .subscribe({

        next: async () => {

          this.saving = false;

          const toast = await this.toastController.create({

            message: 'Settings updated successfully.',

            color: 'success',

            duration: 2000

          });

          await toast.present();

        },

        error: async () => {

          this.saving = false;

          const toast = await this.toastController.create({

            message: 'Unable to update settings.',

            color: 'danger',

            duration: 2500

          });

          await toast.present();

        }

      });

  }

  private normalizePayload(value: PortfolioSettings): Partial<PortfolioSettings> {
    const payload = { ...value };

    for (const key of ['supportEmail', 'contactEmail'] as const) {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim() as any;
      }
    }

    return payload;
  }

}
