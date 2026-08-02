import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  eyeOutline,
  globeOutline,
  logoGithub,
  rocketOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Project } from 'src/app/features/projects/models/project.models';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonSpinner,
    RouterLink,
  ],
})
export class ProjectsComponent {
  private readonly publicService = inject(PublicService);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ arrowForwardOutline, eyeOutline, globeOutline, logoGithub, rocketOutline });
    this.loadProjects();
  }

  imageUrl(project: Project): string {
    return assetUrl(project.thumbnail || project.images?.[0]);
  }

  open(url?: string): void {
    if (url) window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  }

  private loadProjects(): void {
    this.publicService.getProjects()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.projects.set(sortByDisplayOrder(activeOnly(unwrapCollection<Project>(response, 'projects'))));
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
