import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { About } from 'src/app/features/about/models/about.model';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  private readonly publicService = inject(PublicService);

  readonly about = signal<About | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ downloadOutline, sparklesOutline });
    this.loadAbout();
  }

  imageUrl(about: About): string {
    return assetUrl(about.profileImage);
  }

  downloadResume(url?: string): void {
    if (url) window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  }

  private loadAbout(): void {
    this.publicService.getAbout()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.about.set(activeOnly(unwrapCollection<About>(response, 'abouts'))[0] ?? null);
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
