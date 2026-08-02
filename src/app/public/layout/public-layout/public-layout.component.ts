import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PublicService } from '../../public.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { assetUrl, unwrapItem } from '../../public.utils';
import { PortfolioSettings } from 'src/app/features/settings/models/settings.model';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    IonContent,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent {
  private readonly publicService = inject(PublicService);
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.publicService.getSettings().subscribe({
      next: (response) => {
        const settings = unwrapItem<PortfolioSettings>(response, 'settings');
        this.themeService.setPublicSettings(settings);

        if (settings?.siteTitle) {
          document.title = settings.siteTitle;
        }

        if (settings?.siteDescription) {
          this.setMetaDescription(settings.siteDescription);
        }

        if (settings?.favicon) {
          this.setFavicon(assetUrl(settings.favicon));
        }
      },
      error: () => undefined,
    });
  }

  private setMetaDescription(content: string): void {
    const selector = 'meta[name="description"]';
    const meta = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta');

    meta.name = 'description';
    meta.content = content;

    if (!meta.parentElement) {
      document.head.appendChild(meta);
    }
  }

  private setFavicon(href: string): void {
    const selector = 'link[rel="icon"], link[rel="shortcut icon"]';
    const icon = document.querySelector<HTMLLinkElement>(selector) ?? document.createElement('link');

    icon.rel = 'icon';
    icon.href = href;

    if (!icon.parentElement) {
      document.head.appendChild(icon);
    }
  }
}
