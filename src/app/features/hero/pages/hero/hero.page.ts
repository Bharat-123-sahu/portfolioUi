import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { UploadService } from 'src/app/core/services/upload.service';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { assetUrl } from 'src/app/core/utils/url.util';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroListComponent,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class HeroPage implements OnInit {
  private fb = inject(FormBuilder);
  private heroService = inject(HeroService);
  private toastController = inject(ToastController);
  private router = inject(Router);
  private uploadService = inject(UploadService);

  heroForm!: FormGroup;

  isSubmitting = false;

  selectedFile?: File;

  uploading = false;

  ngOnInit(): void {
    this.initializeForm();
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

  async submit() {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = this.heroForm.value;

    this.heroService.create(payload).subscribe({
      next: async () => {
        this.isSubmitting = false;

        const toast = await this.toastController.create({
          message: 'Hero created successfully.',
          color: 'success',
          duration: 2000,
        });

        await toast.present();

        this.heroForm.reset({
          isActive: true,
        });
      },

      error: async () => {
        this.isSubmitting = false;

        const toast = await this.toastController.create({
          message: 'Unable to create Hero.',
          color: 'danger',
          duration: 2500,
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

      error: () => {
        this.uploading = false;
      },
    });
  }

  getImageUrl(path: string): string {
    return assetUrl(path);
  }
}
