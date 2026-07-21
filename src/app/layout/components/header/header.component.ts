import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { menuOutline, logOutOutline, personCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    // IonButtons,
    // IonButton,
    // IonIcon,
  ],
})
export class HeaderComponent {

  constructor() {
    addIcons({
      menuOutline,
      logOutOutline,
      personCircleOutline,
    });
  }

  logout() {
    console.log('Logout clicked');
  }
}