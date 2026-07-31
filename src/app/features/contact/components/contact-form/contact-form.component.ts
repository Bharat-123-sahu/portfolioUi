import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  IonicModule,
  ModalController,
  ToastController
} from '@ionic/angular';

import { Contact } from '../../models/contact.model';

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
    FileUploadComponent
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);


  @Input() contact?: Contact;

  contactForm!: FormGroup;

  saving = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    this.contactForm = this.fb.group({

      name: [
        this.contact?.name ?? '',
        Validators.required
      ],

      designation: [
        this.contact?.designation ?? '',
        Validators.required
      ],

      email: [
        this.contact?.email ?? '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        this.contact?.phone ?? '',
        Validators.required
      ],

      alternatePhone: [
        this.contact?.alternatePhone ?? ''
      ],

      website: [
        this.contact?.website ?? ''
      ],

      address: [
        this.contact?.address ?? '',
        Validators.required
      ],

      city: [
        this.contact?.city ?? '',
        Validators.required
      ],

      state: [
        this.contact?.state ?? '',
        Validators.required
      ],

      country: [
        this.contact?.country ?? '',
        Validators.required
      ],

      postalCode: [
        this.contact?.postalCode ?? ''
      ],

      googleMapUrl: [
        this.contact?.googleMapUrl ?? ''
      ],

      profileImage: [
        this.contact?.profileImage ?? ''
      ],

      resumeUrl: [
        this.contact?.resumeUrl ?? ''
      ],

      workingHours: [
        this.contact?.workingHours ?? ''
      ],

      availableForHire: [
        this.contact?.availableForHire ?? true
      ],

      displayOrder: [
        this.contact?.displayOrder ?? 1
      ],

      isActive: [
        this.contact?.isActive ?? true
      ]

    });

  }

  submit(): void {

    if (this.contactForm.invalid) {

      this.contactForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const request = this.contact
      ? this.contactService.update(
          this.contact._id!,
          this.contactForm.value
        )
      : this.contactService.create(
          this.contactForm.value
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.contact
            ? 'Contact updated successfully.'
            : 'Contact created successfully.',

          color: 'success',

          duration: 2000

        });

        await toast.present();

        this.modalController.dismiss({

          refresh: true

        });

      },

      error: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: 'Unable to save contact.',

          color: 'danger',

          duration: 2500

        });

        await toast.present();

      }

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

}