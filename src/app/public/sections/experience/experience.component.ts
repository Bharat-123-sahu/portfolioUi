import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { businessOutline, calendarOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Experience } from 'src/app/features/experience/models/experience.model';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonIcon,
    IonSpinner,
  ],
})
export class ExperienceComponent {
  private readonly publicService = inject(PublicService);

  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ businessOutline, calendarOutline });
    this.loadExperience();
  }

  logoUrl(item: Experience): string {
    return assetUrl(item.companyLogo);
  }

  private loadExperience(): void {
    this.publicService.getExperience()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.experiences.set(sortByDisplayOrder(activeOnly(unwrapCollection<Experience>(response, 'experiences'))));
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
