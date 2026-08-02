import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  menuOutline,
  moonOutline,
  sparklesOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { ThemeService } from 'src/app/core/services/theme.service';
import { assetUrl } from '../../public.utils';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonButton,
    IonIcon,
  ],
})
export class NavbarComponent {
  private readonly themeService = inject(ThemeService);

  readonly isOpen = signal(false);
  readonly scrolled = signal(false);
  readonly theme = computed(() => this.themeService.publicTheme());
  readonly settings = computed(() => this.themeService.publicSettings());
  readonly siteTitle = computed(() => this.settings()?.siteTitle || 'Portfolio');
  readonly logoUrl = computed(() => assetUrl(this.settings()?.logo));

  readonly navItems = [
    { label: 'Home', path: '/', fragment: 'home' },
    { label: 'About', path: '/', fragment: 'about' },
    { label: 'Skills', path: '/', fragment: 'skills' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {
    addIcons({ closeOutline, menuOutline, moonOutline, sparklesOutline, sunnyOutline });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle('public');
  }

}
