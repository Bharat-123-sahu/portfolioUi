import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  callOutline,
  locationOutline,
  downloadOutline,
  chevronDownOutline,
  arrowForwardOutline,
  logoGithub,
  logoLinkedin,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Hero } from 'src/app/features/hero/models/hero.model';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  private readonly publicService = inject(PublicService);

  readonly hero = signal<Hero | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({
      logoGithub,
      logoLinkedin,
      mailOutline,
      callOutline,
      locationOutline,
      downloadOutline,
      chevronDownOutline,
      arrowForwardOutline,
    });
    this.loadHero();
  }

  imageUrl(hero: Hero): string {
    return assetUrl(hero.profileImage);
  }

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollDown(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  open(url?: string): void {
    if (!url) return;
    window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  }

  mail(email?: string): void {
    if (email) window.location.href = `mailto:${email}`;
  }

  call(phone?: string): void {
    if (phone) window.location.href = `tel:${phone}`;
  }

  private loadHero(): void {
    this.publicService.getHero()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.hero.set(activeOnly(unwrapCollection<Hero>(response, 'heroes'))[0] ?? null);
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
