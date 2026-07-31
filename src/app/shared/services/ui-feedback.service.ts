import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UiFeedbackService {
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);


  async success(message: string): Promise<void> {
    await this.showToast(message, 'success', 'checkmark-circle-outline');
  }

  async error(message: string): Promise<void> {
    await this.showToast(message, 'danger', 'alert-circle-outline');
  }

  async confirmDelete(itemName: string, itemType = 'record'): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: `Delete ${itemType}`,
        message: `Are you sure you want to delete <strong>${itemName}</strong>? This action cannot be undone.`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Delete',
            role: 'destructive',
            cssClass: 'danger',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger',
    icon: string,
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      icon,
      duration: 2200,
      position: 'top',
    });

    await toast.present();
  }
}
