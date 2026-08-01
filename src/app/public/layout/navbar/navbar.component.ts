import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  menuOutline,
  sparklesOutline,
} from 'ionicons/icons';

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
  readonly isOpen = signal(false);
  readonly scrolled = signal(false);

  readonly navItems = [
    { label: 'Home', path: '/', fragment: 'home' },
    { label: 'About', path: '/', fragment: 'about' },
    { label: 'Skills', path: '/', fragment: 'skills' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {
    addIcons({ closeOutline, menuOutline, sparklesOutline });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  close(): void {
    this.isOpen.set(false);
  }

}
