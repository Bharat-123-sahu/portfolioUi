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

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { TechnologyChipsComponent } from 'src/app/shared/components/technology-chips/technology-chips.component';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    FileUploadComponent,
    TechnologyChipsComponent
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

      defaultProfileImage: [
        ''
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

    this.settingsService.getSettings().subscribe({

      next: (settings) => {

        this.settings = settings;

        this.settingsForm.patchValue(settings);

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  save(): void {

    if (this.settingsForm.invalid) {

      this.settingsForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    this.settingsService
      .updateSettings(this.settingsForm.value)
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

}