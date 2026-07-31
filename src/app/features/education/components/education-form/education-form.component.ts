import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Education } from '../../models/education.model';

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { EducationService } from '../../services/education';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    // ImageUploadComponent,
  ],
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
})
export class EducationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private educationService = inject(EducationService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() education?: Education;

  educationForm!: FormGroup;

  saving = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.educationForm = this.fb.group({

      instituteName: [
        this.education?.instituteName ?? '',
        Validators.required,
      ],

      degree: [
        this.education?.degree ?? '',
        Validators.required,
      ],

      fieldOfStudy: [
        this.education?.fieldOfStudy ?? '',
        Validators.required,
      ],

      location: [
        this.education?.location ?? '',
        Validators.required,
      ],

      startYear: [
        this.education?.startYear ?? '',
        [
          Validators.required,
          Validators.min(1900),
        ],
      ],

      endYear: [
        this.education?.endYear ?? '',
        [
          Validators.required,
          Validators.min(1900),
        ],
      ],

      grade: [
        this.education?.grade ?? '',
      ],

      description: [
        this.education?.description ?? '',
      ],

      // instituteLogo: [
      //   this.education?.instituteLogo ?? '',
      // ],

      displayOrder: [
        this.education?.displayOrder ?? 1,
      ],

      isActive: [
        this.education?.isActive ?? true,
      ],

    });

  }

  submit(): void {

    if (this.educationForm.invalid) {

      this.educationForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const request = this.education
      ? this.educationService.update(
          this.education._id!,
          this.educationForm.value
        )
      : this.educationService.create(
          this.educationForm.value
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.education
            ? 'Education updated successfully.'
            : 'Education created successfully.',

          color: 'success',

          duration: 2000,

        });

        await toast.present();

        this.modalController.dismiss({

          refresh: true,

        });

      },

      error: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: 'Unable to save education.',

          color: 'danger',

          duration: 2000,

        });

        await toast.present();

      }

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

}