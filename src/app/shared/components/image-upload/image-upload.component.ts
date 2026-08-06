import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

import { IonicModule, ToastController } from '@ionic/angular';

import { UploadService } from 'src/app/core/services/upload.service';
import { assetUrl } from 'src/app/core/utils/url.util';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  private uploadService = inject(UploadService);
  private toastController = inject(ToastController);

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @Input() folder = 'general';

  @Input() label = 'Upload Image';

  @Input() imageUrl = '';

  @Output() imageUploaded = new EventEmitter<string>();

  uploading = false;

  get previewUrl(): string {
    return assetUrl(this.imageUrl);
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.showToast('Only JPG, PNG and WEBP images are allowed.');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Maximum file size is 2 MB.');
      input.value = '';
      return;
    }

    this.uploading = true;

    this.uploadService.upload(file, this.folder).subscribe({
      next: (response: any) => {
        this.uploading = false;

        this.imageUrl = response.fileUrl;

        this.imageUploaded.emit(response.fileUrl);

        input.value = '';
      },

      error: async (err) => {
        this.uploading = false;

        input.value = '';

        await this.showToast(
          err?.error?.message || 'Image upload failed.',
        );
      },
    });
  }

  removeImage() {
    this.imageUrl = '';

    this.imageUploaded.emit('');
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'danger',
    });

    await toast.present();
  }
}
