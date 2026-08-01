import { Component, inject, signal } from '@angular/core';
import {
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, schoolOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Education } from 'src/app/features/education/models/education.model';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonSpinner,
  ],
})
export class EducationComponent {
  private readonly publicService = inject(PublicService);

  readonly education = signal<Education[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ locationOutline, schoolOutline });
    this.loadEducation();
  }

  logoUrl(item: Education): string {
    return assetUrl(item.instituteLogo);
  }

  private loadEducation(): void {
    this.publicService.getEducation()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.education.set(sortByDisplayOrder(activeOnly(unwrapCollection<Education>(response, 'educations'))));
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
