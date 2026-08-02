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

import { About } from '../../models/about.model';
import { AboutService } from '../../services/about';

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { FileUploadComponent } from "src/app/shared/components/file-upload/file-upload.component";

@Component({
  selector: 'app-about-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    FileUploadComponent
],
  templateUrl: './about-form.component.html',
  styleUrls: ['./about-form.component.scss'],
})
export class AboutFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private aboutService = inject(AboutService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() about?: About;

  aboutForm!: FormGroup;

  saving = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.aboutForm = this.fb.group({

      heading: [
        this.about?.heading ?? '',
        Validators.required,
      ],

      subHeading: [
        this.about?.subHeading ?? '',
        Validators.required,
      ],

      description: [
        this.about?.description ?? '',
        Validators.required,
      ],

      profileImage: [
        this.about?.profileImage ?? '',
      ],

      yearsOfExperience: [
        this.about?.yearsOfExperience ?? 0,
        Validators.required,
      ],

      totalProjects: [
        this.about?.totalProjects ?? 0,
        Validators.required,
      ],

      totalClients: [
        this.about?.totalClients ?? 0,
        Validators.required,
      ],

      totalCertificates: [
        this.about?.totalCertificates ?? 0,
        Validators.required,
      ],

      resumeUrl: [
        this.about?.resumeUrl ?? '',
      ],

      isActive: [
        this.about?.isActive ?? true,
      ],

    });

  }

  submit(): void {

    if (this.aboutForm.invalid) {

      this.aboutForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const request = this.about
      ? this.aboutService.update(
          this.about._id!,
          this.aboutForm.value
        )
      : this.aboutService.create(
          this.aboutForm.value
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.about
            ? 'About updated successfully.'
            : 'About created successfully.',

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

          message: 'Something went wrong.',

          duration: 2000,

          color: 'danger',

        });

        await toast.present();

      },

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

  
}