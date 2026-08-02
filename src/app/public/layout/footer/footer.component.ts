import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowUpOutline,
  logoGithub,
  logoLinkedin,
  mailOutline,
  sendOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { PublicService } from '../../public.service';
import { SocialLink } from 'src/app/features/social-links/models/social-link.model';
import { activeOnly, sortByDisplayOrder, unwrapCollection } from '../../public.utils';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonIcon,
    IonInput,
  ],
})
export class FooterComponent {
  private readonly publicService = inject(PublicService);
  private readonly themeService = inject(ThemeService);

  readonly year = new Date().getFullYear();
  readonly loading = signal(true);
  readonly socialLinks = signal<SocialLink[]>([]);
  readonly settings = computed(() => this.themeService.publicSettings());
  readonly siteTitle = computed(() => this.settings()?.siteTitle || 'Portfolio');
  readonly siteDescription = computed(() => this.settings()?.siteDescription || 'Design-led Angular products with performance in the details.');

  readonly quickLinks = [
    { label: 'Home', path: '/', fragment: 'home' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {
    addIcons({ arrowUpOutline, logoGithub, logoLinkedin, mailOutline, sendOutline });
    this.loadSocialLinks();
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadSocialLinks(): void {
    this.publicService.getSocialLinks()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const links = unwrapCollection<SocialLink>(response, 'socialLinks')
            .filter((link) => link.isVisible !== false);
          this.socialLinks.set(sortByDisplayOrder(activeOnly(links)));
        },
        error: () => this.socialLinks.set([]),
      });
  }

}
