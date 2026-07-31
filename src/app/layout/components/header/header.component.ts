import { Component, inject } from '@angular/core';
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
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';

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
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  constructor() {
    addIcons({
      menuOutline,
      logOutOutline,
      personCircleOutline,
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
