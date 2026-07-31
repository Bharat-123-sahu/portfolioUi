import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { UploadService } from 'src/app/core/services/upload.service';

@Component({
  selector: 'app-gallery-upload',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  templateUrl: './gallery-upload.component.html',
  styleUrls: ['./gallery-upload.component.scss'],
})
export class GalleryUploadComponent {
  private uploadService = inject(UploadService);
  private toastController = inject(ToastController);


  @Input() label = 'Gallery';

  @Input() folder = 'gallery';

  @Input() images: string[] = [];

  @Output() imagesChange = new EventEmitter<string[]>();

  uploading = false;

  apiUrl = environment.apiUrl;

  async onFileSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.uploading = true;

    const files = Array.from(input.files);

    for (const file of files) {

      try {

        const response = await this.uploadService
          .upload(file, this.folder)
          .toPromise();

        if (response) {

          this.images = [
            ...this.images,
            response.fileUrl,
          ];

          this.imagesChange.emit(this.images);

        }

      } catch {

        const toast = await this.toastController.create({

          message: 'Image upload failed.',

          color: 'danger',

          duration: 2000,

        });

        await toast.present();

      }

    }

    this.uploading = false;

    input.value = '';

  }

  removeImage(index: number): void {

    this.images.splice(index, 1);

    this.images = [...this.images];

    this.imagesChange.emit(this.images);

  }

  getImageUrl(image: string): string {

    if (!image) {
      return '';
    }

    if (image.startsWith('http')) {
      return image;
    }

    return `${this.apiUrl}${image}`;

  }

}