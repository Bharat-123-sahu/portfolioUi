import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  copyOutline,
  eyeOutline,
  globeOutline,
  gridOutline,
  layersOutline,
  linkOutline,
  logoGithub,
  rocketOutline,
  shareSocialOutline,
} from 'ionicons/icons';
import { catchError, distinctUntilChanged, finalize, forkJoin, map, of, switchMap } from 'rxjs';

import { Project } from 'src/app/features/projects/models/project.models';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection, unwrapItem } from '../../public.utils';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);

  readonly project = signal<Project | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly copied = signal(false);

  readonly gallery = computed(() => {
    const project = this.project();
    if (!project) return [];

    return [...new Set([project.thumbnail, ...(project.images ?? [])].filter(Boolean))]
      .map((image) => assetUrl(image));
  });

  readonly related = computed(() => {
    const current = this.project();
    if (!current) return [];

    return this.projects()
      .filter((project) => project.slug !== current.slug)
      .filter((project) =>
        project.category === current.category ||
        project.technologies?.some((tech) => current.technologies?.includes(tech))
      )
      .slice(0, 3);
  });

  readonly previous = computed(() => this.adjacentProject(-1));
  readonly next = computed(() => this.adjacentProject(1));

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      copyOutline,
      eyeOutline,
      globeOutline,
      gridOutline,
      layersOutline,
      linkOutline,
      logoGithub,
      rocketOutline,
      shareSocialOutline,
    });

    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      distinctUntilChanged(),
      switchMap((slug) => {
        this.loading.set(true);
        this.error.set(false);
        this.project.set(null);

        return forkJoin({
          detail: this.publicService.getProjectBySlug(slug),
          projects: this.publicService.getProjects().pipe(catchError(() => of([]))),
        }).pipe(finalize(() => this.loading.set(false)));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ detail, projects }) => {
        const project = unwrapItem<Project>(detail, 'project');
        const allProjects = sortByDisplayOrder(activeOnly(unwrapCollection<Project>(projects, 'projects')));

        if (!project) {
          this.error.set(true);
          return;
        }

        this.project.set(project);
        this.projects.set(allProjects);
        this.updateSeo(project);
      },
      error: () => this.error.set(true),
    });
  }

  imageUrl(path?: string): string {
    return assetUrl(path);
  }

  projectImage(project: Project): string {
    return assetUrl(project.thumbnail || project.images?.[0]);
  }

  share(): void {
    const project = this.project();
    if (!project) return;

    const url = this.currentUrl();
    const payload = {
      title: project.title,
      text: project.shortDescription,
      url,
    };

    if (navigator.share) {
      void navigator.share(payload);
      return;
    }

    void navigator.clipboard?.writeText(url);
    this.flashCopied();
  }

  copyLink(): void {
    void navigator.clipboard?.writeText(this.currentUrl());
    this.flashCopied();
  }

  private adjacentProject(offset: -1 | 1): Project | null {
    const current = this.project();
    const projects = this.projects();
    if (!current || !projects.length) return null;

    const index = projects.findIndex((project) => project.slug === current.slug);
    const adjacentIndex = index + offset;

    return adjacentIndex >= 0 && adjacentIndex < projects.length ? projects[adjacentIndex] : null;
  }

  private currentUrl(): string {
    return typeof window === 'undefined' ? '' : window.location.href;
  }

  private flashCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }

  private updateSeo(project: Project): void {
    const title = `${project.title} | Project`;
    const description = project.shortDescription || project.description || 'Project case study and implementation details.';
    const image = this.projectImage(project);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    if (image) this.meta.updateTag({ property: 'og:image', content: image });
  }
}
