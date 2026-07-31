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



import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { Project } from '../../models/project.models';
import { ProjectService } from '../../services/projects';
import { GalleryUploadComponent } from 'src/app/shared/components/gallery-upload/gallery-upload.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    GalleryUploadComponent,
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() project?: Project;

  projectForm!: FormGroup;

  saving = false;

  categories = [
    'Web Application',
    'Mobile Application',
    'Desktop Application',
    'Backend API',
    'Full Stack',
    'UI/UX',
    'Open Source',
    'Other'
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.projectForm = this.fb.group({

      title: [
        this.project?.title ?? '',
        Validators.required,
      ],

      slug: [
        this.project?.slug ?? '',
        Validators.required,
      ],

      shortDescription: [
        this.project?.shortDescription ?? '',
        Validators.required,
      ],

      description: [
        this.project?.description ?? '',
        Validators.required,
      ],

      category: [
        this.project?.category ?? '',
        Validators.required,
      ],

      technologies: [
        this.project?.technologies?.join(', ') ?? '',
      ],

      thumbnail: [
        this.project?.thumbnail ?? '',
      ],

      images: [
        this.project?.images ?? [],
      ],

      githubUrl: [
        this.project?.githubUrl ?? '',
      ],

      liveDemoUrl: [
        this.project?.liveDemoUrl ?? '',
      ],

      playStoreUrl: [
        this.project?.playStoreUrl ?? '',
      ],

      appStoreUrl: [
        this.project?.appStoreUrl ?? '',
      ],

      isFeatured: [
        this.project?.isFeatured ?? false,
      ],

      displayOrder: [
        this.project?.displayOrder ?? 1,
      ],

      isActive: [
        this.project?.isActive ?? true,
      ],

    });

    this.projectForm
      .get('title')
      ?.valueChanges.subscribe(value => {

        if (!this.project) {

          this.projectForm.patchValue({

            slug: this.generateSlug(value),

          }, { emitEvent: false });

        }

      });

  }

  generateSlug(value: string): string {

    if (!value) {
      return '';
    }

    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  }

  submit(): void {

    if (this.projectForm.invalid) {

      this.projectForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const payload = {

      ...this.projectForm.value,

      technologies: this.projectForm.value.technologies
        ? this.projectForm.value.technologies
            .split(',')
            .map((tech: string) => tech.trim())
            .filter(Boolean)
        : []

    };

    const request = this.project
      ? this.projectService.update(
          this.project._id!,
          payload
        )
      : this.projectService.create(
          payload
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.project
            ? 'Project updated successfully.'
            : 'Project created successfully.',

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

          message: 'Unable to save project.',

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