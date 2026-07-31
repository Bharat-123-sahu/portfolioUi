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
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { Certificate } from '../../models/certificate.models';
import { CertificateService } from '../../services/certificate';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    FileUploadComponent,
  ],
  templateUrl: './certificate-form.component.html',
  styleUrls: ['./certificate-form.component.scss'],
})
export class CertificateFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private certificateService = inject(CertificateService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() certificate?: Certificate;

  certificateForm!: FormGroup;

  saving = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.certificateForm = this.fb.group({

      title: [
        this.certificate?.title ?? '',
        Validators.required,
      ],

      issuer: [
        this.certificate?.issuer ?? '',
       
      ],

      issueDate: [
        this.certificate?.issueDate ?? '',
       
      ],

      expiryDate: [
        this.certificate?.expiryDate ?? '',
      ],

      credentialId: [
        this.certificate?.credentialId ?? '',
      ],

      credentialUrl: [
        this.certificate?.credentialUrl ?? '',
      ],

      certificateImage: [
        this.certificate?.certificateImage ?? '',
      ],

      certificateFile: [
        this.certificate?.certificateFile ?? '',
      ],

      description: [
        this.certificate?.description ?? '',
      ],

      displayOrder: [
        this.certificate?.displayOrder ?? 1,
      ],

      isActive: [
        this.certificate?.isActive ?? true,
      ],

    });

  }

  submit(): void {

    if (this.certificateForm.invalid) {

      this.certificateForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const request = this.certificate
      ? this.certificateService.update(
          this.certificate._id!,
          this.certificateForm.value
        )
      : this.certificateService.create(
          this.certificateForm.value
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.certificate
            ? 'Certificate updated successfully.'
            : 'Certificate created successfully.',

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

          message: 'Unable to save certificate.',

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