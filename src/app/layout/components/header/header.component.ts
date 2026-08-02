import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { menuOutline, logOutOutline, moonOutline, personCircleOutline, sunnyOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly themeService = inject(ThemeService);
  readonly theme = computed(() => this.themeService.adminTheme());

  constructor() {
    addIcons({
      menuOutline,
      logOutOutline,
      moonOutline,
      personCircleOutline,
      sunnyOutline,
    });
  }

  toggleTheme() {
    this.themeService.toggle('admin');
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
