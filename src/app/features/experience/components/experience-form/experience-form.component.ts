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

import { Experience } from '../../models/experience.model';

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { ExperienceService } from '../../services/experience';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
  ],
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss'],
})
export class ExperienceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() experience?: Experience;

  experienceForm!: FormGroup;

  saving = false;

  employmentTypes = [
    'Full-time',
    'Part-time',
    'Internship',
    'Contract',
    'Freelance',
    'Remote',
    'Hybrid'
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.experienceForm = this.fb.group({

      companyName: [
        this.experience?.companyName ?? '',
        Validators.required,
      ],

      designation: [
        this.experience?.designation ?? '',
        Validators.required,
      ],

      employmentType: [
        this.experience?.employmentType ?? '',
        Validators.required,
      ],

      location: [
        this.experience?.location ?? '',
        Validators.required,
      ],

      startDate: [
        this.experience?.startDate ?? '',
        Validators.required,
      ],

      endDate: [
        this.experience?.endDate ?? '',
      ],

      currentlyWorking: [
        this.experience?.currentlyWorking ?? false,
      ],

      companyLogo: [
        this.experience?.companyLogo ?? '',
      ],

      description: [
        this.experience?.description ?? '',
        Validators.required,
      ],

      technologies: [
        this.experience?.technologies?.join(', ') ?? '',
      ],

      displayOrder: [
        this.experience?.displayOrder ?? 1,
      ],

      isActive: [
        this.experience?.isActive ?? true,
      ],

    });

    this.experienceForm
      .get('currentlyWorking')
      ?.valueChanges.subscribe(value => {

        if (value) {

          this.experienceForm.patchValue({
            endDate: null,
          });

        }

      });

  }

  submit(): void {

    if (this.experienceForm.invalid) {

      this.experienceForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const payload = {

      ...this.experienceForm.value,

      technologies: this.experienceForm.value.technologies
        ? this.experienceForm.value.technologies
            .split(',')
            .map((item: string) => item.trim())
            .filter(Boolean)
        : []

    };

    const request = this.experience
      ? this.experienceService.update(
          this.experience._id!,
          payload
        )
      : this.experienceService.create(
          payload
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.experience
            ? 'Experience updated successfully.'
            : 'Experience created successfully.',

          duration: 2000,

          color: 'success',

        });

        await toast.present();

        this.modalController.dismiss({

          refresh: true,

        });

      },

      error: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: 'Unable to save experience.',

          duration: 2000,

          color: 'danger',

        });

        await toast.present();

      }

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

}