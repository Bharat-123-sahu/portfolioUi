import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
    // IonContent,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
  ],
})
export class DashboardPage implements OnDestroy {
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.themeService.setTheme('admin', this.themeService.adminTheme());
    document.body.classList.add('admin-route');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('admin-route');
  }
}
