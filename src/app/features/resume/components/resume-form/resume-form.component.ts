import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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


import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { Resume } from '../../models/resume.models';
import { ResumeService } from '../../services/resume';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FileUploadComponent,
  ],
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.scss'],
})
export class ResumeFormComponent implements OnInit {

  @Input() resume?: Resume;

  resumeForm!: FormGroup;

  saving = false;

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.resumeForm = this.fb.group({

      title: [
        this.resume?.title ?? '',
        Validators.required,
      ],

      version: [
        this.resume?.version ?? '1.0',
        Validators.required,
      ],

      resumeFile: [
        this.resume?.resumeFile ?? '',
        Validators.required,
      ],

      description: [
        this.resume?.description ?? '',
      ],

      displayOrder: [
        this.resume?.displayOrder ?? 1,
        Validators.required,
      ],

      isDefault: [
        this.resume?.isDefault ?? false,
      ],

      isActive: [
        this.resume?.isActive ?? true,
      ],

    });

  }

  submit(): void {

    if (this.resumeForm.invalid) {

      this.resumeForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const payload = this.resumeForm.getRawValue();

    const request = this.resume
      ? this.resumeService.update(this.resume._id!, payload)
      : this.resumeService.create(payload);

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.resume
            ? 'Resume updated successfully.'
            : 'Resume uploaded successfully.',

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

          message: 'Failed to save resume.',

          color: 'danger',

          duration: 2500,

        });

        await toast.present();

      }

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

}