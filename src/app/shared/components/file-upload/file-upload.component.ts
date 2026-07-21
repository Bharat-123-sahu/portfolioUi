import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { UploadService } from 'src/app/core/services/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {

  @Input() label = 'Upload File';

  @Input() folder = 'documents';

  @Input() accept = '.pdf';

  @Input() fileUrl = '';

  @Output() fileUploaded = new EventEmitter<string>();

  uploading = false;

  apiUrl = environment.apiUrl;

  constructor(
    private uploadService: UploadService,
    private toastController: ToastController
  ) {}

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.uploading = true;

    this.uploadService
      .upload(file, this.folder)
      .subscribe({

        next: (response) => {

          this.uploading = false;

          this.fileUrl = response.fileUrl;

          this.fileUploaded.emit(response.fileUrl);

          input.value = '';

        },

        error: async () => {

          this.uploading = false;

          const toast = await this.toastController.create({

            message: 'File upload failed.',

            color: 'danger',

            duration: 2000,

          });

          await toast.present();

        }

      });

  }

  getFileName(): string {

    if (!this.fileUrl) {

      return '';

    }

    return this.fileUrl.split('/').pop() ?? '';

  }

}