import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { UploadService } from 'src/app/core/services/upload.service';
import { assetUrl } from 'src/app/core/utils/url.util';

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
  private uploadService = inject(UploadService);
  private toastController = inject(ToastController);


  @Input() label = 'Upload File';

  @Input() folder = 'documents';

  @Input() accept = '.pdf';

  @Input() fileUrl = '';

  @Output() fileUploaded = new EventEmitter<string>();

  uploading = false;

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!this.isAllowedFile(file)) {
      this.showError('Selected file type is not allowed or exceeds 5 MB.');
      input.value = '';
      return;
    }

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
          input.value = '';

          await this.showError('File upload failed.');

        }

      });

  }

  getFileName(): string {

    if (!this.fileUrl) {

      return '';

    }

    return this.fileUrl.split('/').pop() ?? '';

  }

  getFileUrl(): string {
    return assetUrl(this.fileUrl);
  }

  private isAllowedFile(file: File): boolean {
    const accepted = this.accept
      .split(',')
      .map((type) => type.trim().toLowerCase())
      .filter(Boolean);
    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;

    return file.size <= 5 * 1024 * 1024
      && (!accepted.length || accepted.includes(extension) || accepted.includes(file.type.toLowerCase()));
  }

  private async showError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2200,
    });

    await toast.present();
  }

}
