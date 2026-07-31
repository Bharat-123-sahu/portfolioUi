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

import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class HeroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private heroService = inject(HeroService);
  private uploadService = inject(UploadService);
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);

  @Input() hero?: Hero;

  heroForm!: FormGroup;

  isSubmitting = false;

  uploading = false;

  selectedFile?: File;

  environment = environment;

  ngOnInit(): void {
    this.initializeForm();

    if (this.hero) {
      this.heroForm.patchValue({
        title: this.hero.title,
        subtitle: this.hero.subtitle,
        description: this.hero.description,
        profileImage: this.hero.profileImage,
        resumeUrl: this.hero.resumeUrl,
        githubUrl: this.hero.githubUrl,
        linkedinUrl: this.hero.linkedinUrl,
        email: this.hero.email,
        phone: this.hero.phone,
        location: this.hero.location,
        isActive: this.hero.isActive,
      });
    }
  }

  initializeForm(): void {
    this.heroForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      description: ['', Validators.required],
      profileImage: [''],
      resumeUrl: [''],
      githubUrl: [''],
      linkedinUrl: [''],
      email: ['', Validators.email],
      phone: [''],
      location: [''],
      isActive: [true],
    });
  }

  submit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    if (this.hero?._id) {
      this.updateHero();
    } else {
      this.createHero();
    }
  }

  createHero(): void {
    this.isSubmitting = true;

    this.heroService.create(this.heroForm.value).subscribe({
      next: async () => {
        this.isSubmitting = false;

        const toast = await this.toastController.create({
          message: 'Hero created successfully.',
          color: 'success',
          duration: 2000,
        });

        await toast.present();

        this.modalController.dismiss(true, 'saved');
      },

      error: async () => {
        this.isSubmitting = false;

        const toast = await this.toastController.create({
          message: 'Unable to create Hero.',
          color: 'danger',
          duration: 2000,
        });

        await toast.present();
      },
    });
  }

  updateHero(): void {
    this.isSubmitting = true;

    this.heroService
      .update(this.hero!._id!, this.heroForm.value)
      .subscribe({
        next: async () => {
          this.isSubmitting = false;

          const toast = await this.toastController.create({
            message: 'Hero updated successfully.',
            color: 'success',
            duration: 2000,
          });

          await toast.present();

          this.modalController.dismiss(true, 'saved');
        },

        error: async () => {
          this.isSubmitting = false;

          const toast = await this.toastController.create({
            message: 'Unable to update Hero.',
            color: 'danger',
            duration: 2000,
          });

          await toast.present();
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];

    this.uploadImage();
  }

  // uploadImage(): void {
  //   if (!this.selectedFile) {
  //     return;
  //   }

  //   this.uploading = true;

  //   this.uploadService.upload(this.selectedFile, 'hero').subscribe({
  //     next: (response) => {
  //       this.uploading = false;

  //       this.heroForm.patchValue({
  //         profileImage: response.fileUrl,
  //       });
  //     },

  //     error: () => {
  //       this.uploading = false;
  //     },
  //   });
  // }
uploadImage(): void {
  if (!this.selectedFile) {
    return;
  }

  this.uploading = true;

  this.uploadService.upload(this.selectedFile, 'hero').subscribe({
    next: (response) => {
      this.uploading = false;

      this.heroForm.patchValue({
        profileImage: response.fileUrl,
      });
    },

    error: async () => {
      this.uploading = false;

      const toast = await this.toastController.create({
        message: 'Image upload failed.',
        color: 'danger',
        duration: 2000,
      });

      await toast.present();
    },
  });
}
  

  close(): void {
    this.modalController.dismiss();
  }
}