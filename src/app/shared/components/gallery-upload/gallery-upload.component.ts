import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { UploadService } from 'src/app/core/services/upload.service';
import { assetUrl } from 'src/app/core/utils/url.util';

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

  async onFileSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const files = Array.from(input.files);
    const invalidFile = files.find((file) => !this.isValidImage(file));

    if (invalidFile) {
      await this.showError('Only JPG, PNG and WEBP images up to 2 MB are allowed.');
      input.value = '';
      return;
    }

    this.uploading = true;

    for (const file of files) {

      try {

        const response = await firstValueFrom(
          this.uploadService.upload(file, this.folder),
        );

        if (response) {

          this.images = [
            ...this.images,
            response.fileUrl,
          ];

          this.imagesChange.emit(this.images);

        }

      } catch {
        await this.showError('Image upload failed.');

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

    return assetUrl(image);

  }

  trackByImage(index: number, image: string): string {
    return `${image}-${index}`;
  }

  private isValidImage(file: File): boolean {
    return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)
      && file.size <= 2 * 1024 * 1024;
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
