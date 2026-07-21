import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { UploadService } from 'src/app/core/services/upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
@Input() folder = 'general';
  @Input() imageUrl = '';

  @Input() label = 'Upload Image';

  @Output() imageUploaded = new EventEmitter<string>();

  uploading = false;

  constructor(
    private uploadService: UploadService,
    private toastController: ToastController
  ) {}

  async onFileSelected(event: any): Promise<void> {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showToast('Only image files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Maximum file size is 2 MB.');
      return;
    }

    this.uploading = true;

    this.uploadService.upload(file, this.folder).subscribe({

      next: (response: any) => {

        this.imageUrl = response.fileUrl;

        this.imageUploaded.emit(this.imageUrl);

        this.uploading = false;

      },

      error: () => {

        this.uploading = false;

        this.showToast('Image upload failed.');

      }

    });

  }

  removeImage(): void {

    this.imageUrl = '';

    this.imageUploaded.emit('');

  }

  private async showToast(message: string): Promise<void> {

    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger'
    });

    await toast.present();

  }

}